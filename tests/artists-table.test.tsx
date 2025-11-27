import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArtistsTable from '../src/components/admin/artists/ArtistsTable';

// Mock Supabase
vi.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'mock-token' } },
      }),
    },
  },
}));

// Mock window.location
const originalLocation = window.location;

beforeEach(() => {
  // @ts-expect-error - JSDOM window.location is readonly, mock for navigation assertions
  delete window.location;
  // @ts-expect-error - JSDOM window.location is readonly, mock for navigation assertions
  window.location = { ...originalLocation, href: '' };
  
  // Reset fetch mock
  global.fetch = vi.fn();
  
  // Reset confirm mock
  window.confirm = vi.fn(() => true);
});

afterEach(() => {
  window.location = originalLocation as any;
  vi.clearAllMocks();
});

describe('ArtistsTable', () => {
  const mockArtists = [
    {
      id: '1',
      name: 'Artist 1',
      specialty: 'Realism',
      is_active: true,
      slug: 'artist-1',
    },
    {
      id: '2',
      name: 'Artist 2',
      specialty: 'Traditional',
      is_active: false,
      slug: 'artist-2',
    },
  ];

  it('renders loading state initially', () => {
    (global.fetch as any).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<ArtistsTable />);
    expect(screen.getByText('Loading artists...')).toBeInTheDocument();
  });

  it('fetches and displays artists', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockArtists,
    });

    render(<ArtistsTable />);

    await waitFor(() => {
      expect(screen.getByText('Artist 1')).toBeInTheDocument();
      expect(screen.getByText('Artist 2')).toBeInTheDocument();
      expect(screen.getByText('Realism')).toBeInTheDocument();
      expect(screen.getByText('Traditional')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
      json: async () => ({ error: { message: 'Failed to fetch' } }),
    });

    render(<ArtistsTable />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('renders empty state', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<ArtistsTable />);

    await waitFor(() => {
      expect(screen.getByText('No artists found. Add one to get started.')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    (global.fetch as any).mockImplementation((url: string, options: any) => {
      if (url === '/api/artists' && options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: async () => mockArtists,
        });
      }
      if (url === '/api/artists' && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      }
      return Promise.reject(new Error('Unknown request'));
    });

    render(<ArtistsTable />);

    await waitFor(() => {
      expect(screen.getByText('Artist 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('.lucide-trash-2'));
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Artist "Artist 1" deleted successfully!')).toBeInTheDocument();
    });

    expect(screen.queryByText('Artist 1')).not.toBeInTheDocument();
    expect(screen.getByText('Artist 2')).toBeInTheDocument();
  });

  it('handles delete error', async () => {
     (global.fetch as any).mockImplementation((url: string, options: any) => {
      if (url === '/api/artists' && options?.method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: async () => mockArtists,
        });
      }
      if (url === '/api/artists' && options?.method === 'POST') {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: { message: 'Delete failed' } }),
        });
      }
      return Promise.reject(new Error('Unknown request'));
    });

    render(<ArtistsTable />);

    await waitFor(() => {
      expect(screen.getByText('Artist 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('.lucide-trash-2'));
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Delete failed')).toBeInTheDocument();
    });
    
    // Artist should still be there
    expect(screen.getByText('Artist 1')).toBeInTheDocument();
  });

  it('navigates to create page', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<ArtistsTable />);

    await waitFor(() => {
        expect(screen.getByText('Add Artist')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Artist'));

    expect(window.location.href).toBe('/admin/artists/new');
  });

  it('navigates to edit page', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockArtists,
    });

    render(<ArtistsTable />);

    await waitFor(() => {
      expect(screen.getByText('Artist 1')).toBeInTheDocument();
    });
    
    // Wait for edit buttons to appear
    await waitFor(() => {
        // Lucide icons render as SVGs with specific classes
        // Edit icon has class "lucide-square-pen" or similar depending on import
        // Let's try finding by the SVG class or path
        const editButtons = document.querySelectorAll('button svg.lucide-square-pen');
        if (editButtons.length === 0) {
             // Fallback to checking button content/attributes if class check fails
             // In the log we see: <svg class="lucide lucide-square-pen h-4 w-4" ...>
             // So querySelector('.lucide-square-pen') inside button should work if button is parent
             const buttons = screen.getAllByRole('button');
             const editBtn = buttons.find(b => b.querySelector('.lucide-square-pen'));
             expect(editBtn).toBeDefined();
             if(editBtn) fireEvent.click(editBtn);
        } else {
            fireEvent.click(editButtons[0].closest('button')!);
        }
    });

    expect(window.location.href).toBe('/admin/artists/1');
  });
});
