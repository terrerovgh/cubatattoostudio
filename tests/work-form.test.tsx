import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WorkForm from '../src/components/admin/works/WorkForm';
import { supabase } from '../src/lib/supabase';

// Mock Supabase client
vi.mock('../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
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

describe('WorkForm', () => {
  it('renders correctly in create mode and fetches dependencies', async () => {
    const artistsData = [{ id: 'a1', name: 'Artist 1' }];
    const servicesData = [{ id: 's1', title: 'Service 1' }];

    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'artists') {
            return {
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: artistsData, error: null }),
                }),
            };
        }
        if (table === 'services') {
            return {
                select: vi.fn().mockReturnValue({
                    order: vi.fn().mockResolvedValue({ data: servicesData, error: null }),
                }),
            };
        }
        return {
            select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
        };
    });

    render(<WorkForm />);

    expect(screen.getByText('New Work')).toBeInTheDocument();
    
    await waitFor(() => {
        expect(screen.getByText('Artist 1')).toBeInTheDocument();
        expect(screen.getByText('Service 1')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<WorkForm />);
    
    const form = screen.getByTestId('work-form');
    fireEvent.submit(form);

    await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
        expect(screen.getByText('Image URL is required')).toBeInTheDocument();
    });
  });

  it('validates URL format', async () => {
    render(<WorkForm />);
    
    fireEvent.change(screen.getByLabelText(/image url/i), { target: { value: 'invalid-url' } });
    
    const form = screen.getByTestId('work-form');
    fireEvent.submit(form);

    await waitFor(() => {
        expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument();
    });
  });

  it('adds and removes tags', () => {
    render(<WorkForm />);
    
    const tagInput = screen.getByLabelText(/tags/i);
    fireEvent.change(tagInput, { target: { value: 'New Tag' } });
    fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });
    
    expect(screen.getByText('New Tag')).toBeInTheDocument();
    
    const removeButton = screen.getByText('×'); // &times; is ×
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('New Tag')).not.toBeInTheDocument();
  });

  it('submits new work successfully', async () => {
    const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
        }),
    });

    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'works') {
            return {
                insert: insertMock,
            };
        }
        return {
             select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
        };
    });

    render(<WorkForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Work' } });
    fireEvent.change(screen.getByLabelText(/image url/i), { target: { value: 'https://example.com/image.jpg' } });
    
    const form = screen.getByTestId('work-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalled();
      expect(screen.getByText('Work created successfully!')).toBeInTheDocument();
    });
    
    await waitFor(() => {
        expect(window.location.href).toBe('/admin/works');
    }, { timeout: 2000 });
  });

  it('fetches and updates existing work', async () => {
    const mockWork = {
      id: '123',
      title: 'Old Title',
      image_url: 'https://example.com/old.jpg',
      tags: ['old-tag'],
      artist_id: 'a1',
      service_id: 's1',
      published: true,
      featured: false,
    };

    const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockWork, error: null }),
            }),
        })
    });

    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'works') {
             return {
                select: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: mockWork, error: null }),
                    }),
                }),
                update: updateMock,
            };
        }
        // Dependencies
        return {
             select: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
        };
    });

    render(<WorkForm workId="123" />);
    
    await waitFor(() => {
        expect(screen.getByDisplayValue('Old Title')).toBeInTheDocument();
        expect(screen.getByText('old-tag')).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
    
    const form = screen.getByTestId('work-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
      expect(screen.getByText('Work updated successfully!')).toBeInTheDocument();
    });
  });
});
