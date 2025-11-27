import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArtistForm from '../src/components/admin/artists/ArtistForm';
import { supabase } from '../src/lib/supabase';

// Mock Supabase client
vi.mock('../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

// Mock window.location
const originalLocation = window.location;

beforeEach(() => {
  // @ts-expect-error - JSDOM window.location is readonly, mock for redirects
  delete window.location;
  // @ts-expect-error - JSDOM window.location is readonly, mock for redirects
  window.location = { href: '' };
  vi.clearAllMocks();
});

afterEach(() => {
  window.location = originalLocation as any;
});

describe('ArtistForm', () => {
  it('renders correctly in create mode', () => {
    render(<ArtistForm />);
    expect(screen.getByText('New Artist')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
  });

  it('renders correctly in edit mode and fetches data', async () => {
    const mockArtist = {
      id: '123',
      name: 'Test Artist',
      slug: 'test-artist',
      specialty: 'Tattoos',
      bio: 'Bio',
      avatar_url: 'https://example.com/avatar.jpg',
      portfolio_url: 'https://example.com/portfolio',
      instagram: 'testinsta',
      display_order: 1,
      is_active: true,
    };

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockArtist, error: null }),
      }),
    });

    (supabase.from as any).mockReturnValue({
      select: selectMock,
    });

    render(<ArtistForm artistId="123" />);

    expect(screen.getByText('Loading artist...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Artist')).toBeInTheDocument();
    });
    
    expect(screen.getByDisplayValue('test-artist')).toBeInTheDocument();
  });

  it('verifies URL constructor behavior', () => {
    expect(() => new URL('invalid-url')).toThrow();
  });

  it('validates required fields', async () => {
    render(<ArtistForm />);
    
    const form = screen.getByTestId('artist-form');
    fireEvent.submit(form);

    await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Slug is required')).toBeInTheDocument();
        expect(screen.getByText('Specialty is required')).toBeInTheDocument();
    });
  });

  it('validates URL fields', async () => {
    render(<ArtistForm />);
    
    const avatarInput = screen.getByLabelText(/avatar url/i);
    fireEvent.change(avatarInput, { target: { value: 'invalid-url' } });
    
    const form = screen.getByTestId('artist-form');
    fireEvent.submit(form);

    await waitFor(() => {
        expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });
  });

  it('auto-generates slug from name', () => {
    render(<ArtistForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'New Artist Name' } });
    
    const slugInput = screen.getByLabelText(/slug/i);
    expect(slugInput).toHaveValue('new-artist-name');
  });

  it('submits new artist successfully', async () => {
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
      }),
    });

    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });

    render(<ArtistForm />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Artist' } });
    fireEvent.change(screen.getByLabelText(/specialty/i), { target: { value: 'Art' } });
    // Slug is auto-generated
    
    const form = screen.getByTestId('artist-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalled();
      expect(screen.getByText('Artist created successfully!')).toBeInTheDocument();
    });
    
    // Check redirection
    await waitFor(() => {
        expect(window.location.href).toBe('/admin/artists');
    }, { timeout: 2000 });
  });

  it('handles submission error', async () => {
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
      }),
    });

    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });

    render(<ArtistForm />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Artist' } });
    fireEvent.change(screen.getByLabelText(/specialty/i), { target: { value: 'Art' } });
    
    const form = screen.getByTestId('artist-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeInTheDocument();
    });
  });
  
  it('handles slug conflict error', async () => {
     const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { code: '23505' } }),
      }),
    });

    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });

    render(<ArtistForm />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Artist' } });
    fireEvent.change(screen.getByLabelText(/specialty/i), { target: { value: 'Art' } });
    
    const form = screen.getByTestId('artist-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('This slug is already in use. Please choose a different one.')).toBeInTheDocument();
    });
  });
});
