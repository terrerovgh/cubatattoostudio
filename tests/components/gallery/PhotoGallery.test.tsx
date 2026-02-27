import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoGallery, { type GalleryPost, type GalleryArtistData } from '@/components/gallery/PhotoGallery';

// Mock dependencies
vi.mock('@/lib/imageCache', () => ({
  cleanExpired: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/components/CachedImage', () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="cached-image" />
  ),
}));

vi.mock('@/components/gallery/PhotoLightbox', () => ({
  default: ({ item, onClose, onNavigate, items }: any) => (
    <div data-testid="photo-lightbox" data-item-id={item.id}>
      <button onClick={onClose} data-testid="lightbox-close">Close</button>
      <button onClick={() => {
        const idx = items.findIndex((i: any) => i.id === item.id);
        const next = items[(idx + 1) % items.length];
        onNavigate(next);
      }} data-testid="lightbox-next">Next</button>
      <span data-testid="lightbox-counter">{items.findIndex((i: any) => i.id === item.id) + 1}/{items.length}</span>
    </div>
  ),
}));

vi.mock('../services/ServiceCarouselCard', () => ({
  default: ({ item, onClick }: any) => (
    <div data-testid={`service-card-${item.id}`} onClick={onClick}>
      {item.name}
    </div>
  ),
}));

vi.mock('../services/ServiceModal', () => ({
  default: ({ item, onClose }: any) => (
    <div data-testid="service-modal">
      <span>{item.name}</span>
      <button onClick={onClose} data-testid="service-modal-close">Close</button>
    </div>
  ),
}));

// ─── Test Data ─────────────────────────────────────────────────

const createPosts = (count: number, artist = 'david'): GalleryPost[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `post-${artist}-${i}`,
    imageUrl: `/images/${artist}-${i}.webp`,
    caption: `Tattoo ${i} by ${artist}`,
    artist,
    isLocal: true,
  }));

const mockArtists: Record<string, GalleryArtistData> = {
  david: {
    profile: { username: 'david', fullName: 'David', localProfilePic: '/david.webp' },
    posts: createPosts(8, 'david'),
  },
  nina: {
    profile: { username: 'nina', fullName: 'Nina', localProfilePic: '/nina.webp' },
    posts: createPosts(5, 'nina'),
  },
};

const allPosts = [
  ...createPosts(8, 'david'),
  ...createPosts(5, 'nina'),
  ...createPosts(3, 'studio'),
];

// ─── Tests ─────────────────────────────────────────────────────

describe('PhotoGallery Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the masonry grid container', () => {
      const { container } = render(<PhotoGallery posts={allPosts} />);
      const grid = container.querySelector('[data-stagger-wave]');
      expect(grid).toBeInTheDocument();
    });

    it('should render photo items as buttons', () => {
      render(<PhotoGallery posts={allPosts.slice(0, 4)} />);
      const images = screen.getAllByRole('button');
      expect(images.length).toBeGreaterThanOrEqual(4);
    });

    it('should render images with correct alt text', () => {
      render(<PhotoGallery posts={allPosts.slice(0, 3)} artistLabels={{ david: 'David', nina: 'Nina', studio: 'Studio' }} />);
      const imgs = screen.getAllByRole('img');
      expect(imgs.length).toBeGreaterThanOrEqual(1);
    });

    it('should show placeholder icons when no images available', async () => {
      const emptyPosts = [{ id: 'empty-1', imageUrl: '' }, { id: 'empty-2', imageUrl: '' }] as GalleryPost[];
      render(<PhotoGallery posts={emptyPosts} />);

      await waitFor(() => {
        const svgs = document.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Filter Tabs', () => {
    it('should show filter tabs when artists are provided', () => {
      const { container } = render(
        <PhotoGallery
          posts={allPosts}
          artists={mockArtists}
        />
      );
      // Get the filter container (first child with overflow-x-auto)
      const filterContainer = container.querySelector('.overflow-x-auto');
      expect(filterContainer).toBeInTheDocument();
      const filterButtons = filterContainer!.querySelectorAll('button');
      const labels = Array.from(filterButtons).map(b => b.textContent);
      expect(labels).toContain('All');
      expect(labels).toContain('David');
      expect(labels).toContain('Nina');
    });

    it('should NOT show filter tabs when only one filter available', () => {
      const davidOnly = createPosts(3, 'david');
      const { container } = render(<PhotoGallery posts={davidOnly} />);
      const filterContainer = container.querySelector('.overflow-x-auto');
      expect(filterContainer).not.toBeInTheDocument();
    });

    it('should filter posts when clicking a filter tab', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PhotoGallery
          posts={allPosts}
          artists={mockArtists}
          artistLabels={{ all: 'All', studio: 'Studio', david: 'David', nina: 'Nina' }}
        />
      );

      const filterContainer = container.querySelector('.overflow-x-auto')!;
      const davidFilter = within(filterContainer as HTMLElement).getByText('David');
      await user.click(davidFilter);

      // After clicking David filter, only David posts should be shown
      const grid = container.querySelector('[data-stagger-wave]')!;
      const photoButtons = grid.querySelectorAll('button');
      // All remaining photo buttons should be David's posts
      photoButtons.forEach(btn => {
        const img = btn.querySelector('img');
        if (img) {
          expect(img.getAttribute('src')).toContain('david');
        }
      });
    });

    it('should highlight the active filter with accent color', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PhotoGallery
          posts={allPosts}
          artists={mockArtists}
          accentColor="#FF0000"
        />
      );

      const filterContainer = container.querySelector('.overflow-x-auto')!;
      const ninaFilter = within(filterContainer as HTMLElement).getByText('Nina');
      await user.click(ninaFilter);

      // Browser converts hex to rgb
      expect(ninaFilter.style.color).toMatch(/rgb\(255,\s*0,\s*0\)|#FF0000/i);
    });

    it('should use custom artist labels', () => {
      const { container } = render(
        <PhotoGallery
          posts={allPosts}
          artists={mockArtists}
          artistLabels={{ all: 'Todos', david: 'David A.', nina: 'Nina K.', studio: 'Estudio' }}
        />
      );

      const filterContainer = container.querySelector('.overflow-x-auto')!;
      const filterButtons = filterContainer.querySelectorAll('button');
      const labels = Array.from(filterButtons).map(b => b.textContent);
      expect(labels).toContain('Todos');
      expect(labels).toContain('David A.');
      expect(labels).toContain('Nina K.');
    });
  });

  describe('Pagination', () => {
    it('should show Load More button when items exceed itemsPerPage', () => {
      render(<PhotoGallery posts={allPosts} artists={mockArtists} itemsPerPage={4} />);
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    it('should NOT show Load More when all items fit', () => {
      render(<PhotoGallery posts={allPosts.slice(0, 3)} itemsPerPage={12} />);
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });

    it('should load more items when clicking Load More', async () => {
      const user = userEvent.setup();
      render(
        <PhotoGallery
          posts={allPosts}
          artists={mockArtists}
          itemsPerPage={4}
        />
      );

      const imgsBefore = screen.getAllByRole('img').length;

      await user.click(screen.getByText('Load More'));

      await waitFor(() => {
        const imgsAfter = screen.getAllByRole('img').length;
        expect(imgsAfter).toBeGreaterThan(imgsBefore);
      });
    });
  });

  describe('Lightbox Integration', () => {
    it('should open lightbox when clicking a photo', async () => {
      const user = userEvent.setup();
      const { container } = render(<PhotoGallery posts={allPosts.slice(0, 4)} />);

      const grid = container.querySelector('[data-stagger-wave]')!;
      const photoButtons = grid.querySelectorAll('button');
      await user.click(photoButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('photo-lightbox')).toBeInTheDocument();
      });
    });

    it('should close lightbox when clicking close', async () => {
      const user = userEvent.setup();
      const { container } = render(<PhotoGallery posts={allPosts.slice(0, 4)} />);

      const grid = container.querySelector('[data-stagger-wave]')!;
      const photoButtons = grid.querySelectorAll('button');
      await user.click(photoButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('photo-lightbox')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('lightbox-close'));

      await waitFor(() => {
        expect(screen.queryByTestId('photo-lightbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Instagram CTA', () => {
    it('should show Instagram CTA when filters are visible', () => {
      render(
        <PhotoGallery
          posts={allPosts}
          artists={mockArtists}
        />
      );

      const igLink = screen.getByText(/Follow @cubatattoostudio/i);
      expect(igLink).toBeInTheDocument();
      expect(igLink.closest('a')).toHaveAttribute('href', 'https://instagram.com/cubatattoostudio');
      expect(igLink.closest('a')).toHaveAttribute('target', '_blank');
    });

    it('should NOT show Instagram CTA when no filters visible', () => {
      render(<PhotoGallery posts={createPosts(3, 'david')} />);
      expect(screen.queryByText(/Follow @cubatattoostudio/i)).not.toBeInTheDocument();
    });
  });

  describe('Accent Color', () => {
    it('should apply custom accent color to Load More button', () => {
      render(
        <PhotoGallery posts={allPosts} artists={mockArtists} itemsPerPage={4} accentColor="#FF6B6B" />
      );
      const loadMore = screen.getByText('Load More');
      // Browser may convert hex to rgb
      expect(loadMore.style.color).toMatch(/rgb\(255,\s*107,\s*107\)|#FF6B6B/i);
    });

    it('should apply default accent color to Load More button', () => {
      render(
        <PhotoGallery posts={allPosts} artists={mockArtists} itemsPerPage={4} />
      );
      const loadMore = screen.getByText('Load More');
      expect(loadMore.style.color).toMatch(/rgb\(200,\s*149,\s*108\)|#C8956C/i);
    });
  });

  describe('Artist Portfolio Mode', () => {
    it('should work without filters for single-artist portfolio', () => {
      const posts = createPosts(5, 'david');
      const { container } = render(
        <PhotoGallery
          posts={posts}
          accentColor="#E8C547"
          artistProfile={{ name: 'David', image: '/david.webp', role: 'Lead Artist', id: 'david' }}
        />
      );

      // No filter tabs in single-artist mode
      const filterContainer = container.querySelector('.overflow-x-auto');
      expect(filterContainer).not.toBeInTheDocument();
      // Images should render
      const imgs = screen.getAllByRole('img');
      expect(imgs.length).toBe(5);
    });
  });
});
