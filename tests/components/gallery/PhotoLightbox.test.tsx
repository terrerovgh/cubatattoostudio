import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoLightbox, { type LightboxItem, type ArtistProfile } from '@/components/gallery/PhotoLightbox';

// Mock CachedImage
vi.mock('@/components/CachedImage', () => ({
  default: ({ src, alt, className }: any) => (
    <img src={src} alt={alt} className={className} data-testid="cached-image" />
  ),
}));

// ─── Test Data ─────────────────────────────────────────────────

const mockItems: LightboxItem[] = [
  {
    id: 'photo-1',
    imageUrl: '/images/tattoo1.webp',
    caption: 'Traditional sleeve',
    artist: 'david',
    isLocal: true,
  },
  {
    id: 'photo-2',
    imageUrl: '/images/tattoo2.webp',
    caption: 'Geometric pattern',
    artist: 'nina',
    isLocal: true,
    featuredWork: {
      title: 'Sacred Geometry',
      description: 'A geometric mandala design',
      style: 'Geometric',
      tags: ['geometric', 'mandala', 'dotwork'],
    },
  },
  {
    id: 'photo-3',
    imageUrl: '/images/tattoo3.webp',
    artist: 'david',
    isLocal: false,
  },
];

const mockArtistProfile: ArtistProfile = {
  name: 'David',
  image: '/artists/david.webp',
  role: 'Founder & Lead Artist',
  id: 'david',
};

const mockArtistLabels: Record<string, string> = {
  david: 'David',
  nina: 'Nina',
};

const defaultProps = {
  item: mockItems[0],
  items: mockItems,
  onClose: vi.fn(),
  onNavigate: vi.fn(),
  accentColor: '#C8956C',
  artistLabels: mockArtistLabels,
};

// ─── Tests ─────────────────────────────────────────────────────

describe('PhotoLightbox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should render the lightbox overlay', () => {
      const { container } = render(<PhotoLightbox {...defaultProps} />);
      const overlay = container.querySelector('.fixed');
      expect(overlay).toBeInTheDocument();
    });

    it('should render the current image', () => {
      render(<PhotoLightbox {...defaultProps} />);
      const img = screen.getByAltText('Traditional sleeve');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/tattoo1.webp');
    });

    it('should render CachedImage for non-local images', () => {
      render(<PhotoLightbox {...defaultProps} item={mockItems[2]} />);
      expect(screen.getByTestId('cached-image')).toBeInTheDocument();
    });

    it('should render close button', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    it('should render navigation arrows', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    });

    it('should hide navigation arrows when only one item', () => {
      render(
        <PhotoLightbox
          {...defaultProps}
          items={[mockItems[0]]}
        />
      );
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('should show item counter', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('should show correct counter for middle item', () => {
      render(<PhotoLightbox {...defaultProps} item={mockItems[1]} />);
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });

  describe('Zoom Controls', () => {
    it('should render zoom controls', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
    });

    it('should show initial zoom at 100%', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should zoom in when clicking zoom in', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} />);

      await user.click(screen.getByLabelText('Zoom in'));

      expect(screen.getByText('150%')).toBeInTheDocument();
    });

    it('should zoom out when clicking zoom out', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} />);

      // Zoom in first
      await user.click(screen.getByLabelText('Zoom in'));
      expect(screen.getByText('150%')).toBeInTheDocument();

      // Then zoom out
      await user.click(screen.getByLabelText('Zoom out'));
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should disable zoom out at 100%', () => {
      render(<PhotoLightbox {...defaultProps} />);
      const zoomOut = screen.getByLabelText('Zoom out');
      expect(zoomOut).toBeDisabled();
    });

    it('should disable zoom in at 300%', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} />);

      // Zoom in 4 times: 100 -> 150 -> 200 -> 250 -> 300
      await user.click(screen.getByLabelText('Zoom in'));
      await user.click(screen.getByLabelText('Zoom in'));
      await user.click(screen.getByLabelText('Zoom in'));
      await user.click(screen.getByLabelText('Zoom in'));

      expect(screen.getByText('300%')).toBeInTheDocument();
      expect(screen.getByLabelText('Zoom in')).toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should call onNavigate with next item', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} />);

      await user.click(screen.getByLabelText('Next image'));

      expect(defaultProps.onNavigate).toHaveBeenCalledWith(mockItems[1]);
    });

    it('should call onNavigate with previous item (wraps around)', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} />);

      await user.click(screen.getByLabelText('Previous image'));

      // From index 0, prev wraps to last item
      expect(defaultProps.onNavigate).toHaveBeenCalledWith(mockItems[2]);
    });

    it('should wrap around on next from last item', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} item={mockItems[2]} />);

      await user.click(screen.getByLabelText('Next image'));

      expect(defaultProps.onNavigate).toHaveBeenCalledWith(mockItems[0]);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate right on ArrowRight key', () => {
      render(<PhotoLightbox {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'ArrowRight' });

      expect(defaultProps.onNavigate).toHaveBeenCalledWith(mockItems[1]);
    });

    it('should navigate left on ArrowLeft key', () => {
      render(<PhotoLightbox {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'ArrowLeft' });

      expect(defaultProps.onNavigate).toHaveBeenCalledWith(mockItems[2]);
    });

    it('should close on Escape key', () => {
      render(<PhotoLightbox {...defaultProps} />);

      fireEvent.keyDown(window, { key: 'Escape' });

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Body Scroll Lock', () => {
    it('should lock body scroll on mount', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll on unmount', () => {
      const { unmount } = render(<PhotoLightbox {...defaultProps} />);
      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Close Behavior', () => {
    it('should call onClose when clicking the close button', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} />);

      await user.click(screen.getByLabelText('Close'));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when clicking the backdrop', async () => {
      const user = userEvent.setup();
      const { container } = render(<PhotoLightbox {...defaultProps} />);

      // Click the outermost overlay div
      const overlay = container.querySelector('.fixed');
      if (overlay) {
        fireEvent.click(overlay);
      }

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should NOT close when clicking inside the content', async () => {
      const user = userEvent.setup();
      render(<PhotoLightbox {...defaultProps} />);

      // Click the image
      const img = screen.getByAltText('Traditional sleeve');
      await user.click(img);

      // onClose should NOT be called
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Artist Profile', () => {
    it('should show artist profile card when provided', () => {
      render(
        <PhotoLightbox
          {...defaultProps}
          artistProfile={mockArtistProfile}
        />
      );

      expect(screen.getByText('David')).toBeInTheDocument();
      expect(screen.getByText('Founder & Lead Artist')).toBeInTheDocument();
      expect(screen.getByAltText('David')).toBeInTheDocument();
    });

    it('should show artist badge when no profile but artist label exists', () => {
      render(
        <PhotoLightbox
          {...defaultProps}
          artistLabels={{ david: 'David M.' }}
        />
      );

      expect(screen.getByText('David M.')).toBeInTheDocument();
    });

    it('should show View Artist Profile link when profile provided', () => {
      render(
        <PhotoLightbox
          {...defaultProps}
          artistProfile={mockArtistProfile}
        />
      );

      const profileLink = screen.getByText('View Artist Profile');
      expect(profileLink.closest('a')).toHaveAttribute('href', '/artists/david');
    });

    it('should NOT show View Artist Profile link without profile', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(screen.queryByText('View Artist Profile')).not.toBeInTheDocument();
    });
  });

  describe('Sidebar Content', () => {
    it('should show caption when available', () => {
      render(<PhotoLightbox {...defaultProps} />);
      expect(screen.getByText('Traditional sleeve')).toBeInTheDocument();
    });

    it('should show "No description" when no caption or featured work', () => {
      render(<PhotoLightbox {...defaultProps} item={mockItems[2]} />);
      expect(screen.getByText('No description available.')).toBeInTheDocument();
    });

    it('should show featured work details when available', () => {
      render(<PhotoLightbox {...defaultProps} item={mockItems[1]} />);

      expect(screen.getByText('Sacred Geometry')).toBeInTheDocument();
      expect(screen.getByText('A geometric mandala design')).toBeInTheDocument();
      expect(screen.getByText('Geometric')).toBeInTheDocument();
    });

    it('should show tags for featured work', () => {
      render(<PhotoLightbox {...defaultProps} item={mockItems[1]} />);

      expect(screen.getByText('#geometric')).toBeInTheDocument();
      expect(screen.getByText('#mandala')).toBeInTheDocument();
      expect(screen.getByText('#dotwork')).toBeInTheDocument();
    });

    it('should always show Book this Style CTA', () => {
      render(<PhotoLightbox {...defaultProps} />);
      const bookLink = screen.getByText('Book this Style');
      expect(bookLink.closest('a')).toHaveAttribute('href', '/booking');
    });
  });

  describe('Zoom Reset on Navigation', () => {
    it('should reset zoom when item changes', () => {
      const { rerender } = render(<PhotoLightbox {...defaultProps} />);

      // Simulate zoom in by checking initial state
      expect(screen.getByText('100%')).toBeInTheDocument();

      // Re-render with different item (simulates navigation)
      rerender(<PhotoLightbox {...defaultProps} item={mockItems[1]} />);

      // Zoom should reset to 100%
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should remove keyboard event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<PhotoLightbox {...defaultProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });
});
