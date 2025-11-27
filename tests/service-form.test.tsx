import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ServiceForm from '../src/components/admin/services/ServiceForm';
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

describe('ServiceForm', () => {
  it('renders correctly in create mode', () => {
    render(<ServiceForm />);
    expect(screen.getByText('New Service')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
  });

  it('renders correctly in edit mode and fetches data', async () => {
    const mockService = {
      id: '123',
      title: 'Test Service',
      slug: 'test-service',
      description: 'Description',
      icon: 'icon-name',
      cover_image_url: 'https://example.com/image.jpg',
      display_order: 1,
      is_active: true,
    };

    const selectMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: mockService, error: null }),
      }),
    });

    (supabase.from as any).mockReturnValue({
      select: selectMock,
    });

    render(<ServiceForm serviceId="123" />);

    expect(screen.getByText('Loading service...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Service')).toBeInTheDocument();
    });
    
    expect(screen.getByDisplayValue('test-service')).toBeInTheDocument();
  });

  it('submits new service successfully', async () => {
    const insertMock = vi.fn().mockReturnValue({
        error: null
    });

    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });

    render(<ServiceForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Service' } });
    fireEvent.change(screen.getByLabelText(/slug/i), { target: { value: 'test-service' } });
    
    const form = screen.getByTestId('service-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalled();
    });
    
    // Check redirection
    await waitFor(() => {
        expect(window.location.href).toBe('/admin/services');
    }, { timeout: 2000 });
  });

  it('updates existing service successfully', async () => {
    const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
            error: null
        })
    });

    const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ 
              data: { 
                  id: '123', 
                  title: 'Old Title', 
                  slug: 'old-slug' 
              }, 
              error: null 
          }),
        }),
    });

    (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'services') {
            return {
                select: selectMock,
                update: updateMock,
            };
        }
        return {};
    });

    render(<ServiceForm serviceId="123" />);

    await waitFor(() => {
        expect(screen.getByDisplayValue('Old Title')).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Title' } });
    
    const form = screen.getByTestId('service-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalled();
    });
    
    expect(window.location.href).toBe('/admin/services');
  });

  it('handles submission error', async () => {
    const insertMock = vi.fn().mockReturnValue({
        error: { message: 'Database error' }
    });

    (supabase.from as any).mockReturnValue({
      insert: insertMock,
    });

    // Mock alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ServiceForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Service' } });
    fireEvent.change(screen.getByLabelText(/slug/i), { target: { value: 'test-service' } });
    
    const form = screen.getByTestId('service-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error saving service');
    });

    alertMock.mockRestore();
    consoleErrorMock.mockRestore();
  });
});
