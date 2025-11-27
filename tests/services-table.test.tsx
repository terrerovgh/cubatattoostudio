import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ServicesTable from '../src/components/admin/services/ServicesTable';

// Mock Supabase
const mockSelect = vi.fn();
const mockDelete = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();

vi.mock('../src/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      delete: mockDelete,
    })),
  },
}));

// Mock window.location
const originalLocation = window.location;

beforeEach(() => {
  // Reset mocks
  vi.clearAllMocks();
  
  // Setup Supabase chain mocks
  mockSelect.mockReturnValue({
    order: mockOrder,
  });
  mockDelete.mockReturnValue({
    eq: mockEq,
  });
  
  // Default success responses
  mockOrder.mockResolvedValue({ data: [], error: null });
  mockEq.mockResolvedValue({ error: null });

  // Mock window.location
  // @ts-expect-error - JSDOM window.location is readonly, mock for navigation assertions
  delete window.location;
  // @ts-expect-error - JSDOM window.location is readonly, mock for navigation assertions
  window.location = { ...originalLocation, href: '' };
  
  // Mock window.confirm
  window.confirm = vi.fn(() => true);
  // Mock window.alert
  window.alert = vi.fn();
});

afterEach(() => {
  cleanup();
  window.location = originalLocation as any;
});

describe('ServicesTable', () => {
  const mockServices = [
    {
      id: '1',
      title: 'Service 1',
      slug: 'service-1',
      is_active: true,
      display_order: 1,
    },
    {
      id: '2',
      title: 'Service 2',
      slug: 'service-2',
      is_active: false,
      display_order: 2,
    },
  ];

  it('renders loading state initially', () => {
    // Return a promise that never resolves to simulate loading
    mockOrder.mockReturnValue(new Promise(() => {}));
    
    render(<ServicesTable />);
    expect(screen.getByText('Loading services...')).toBeInTheDocument();
  });

  it('fetches and displays services', async () => {
    mockOrder.mockResolvedValue({ data: mockServices, error: null });

    render(<ServicesTable />);

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('Service 2')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  it('handles fetch error', async () => {
    // Mock console.error to avoid cluttering test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockOrder.mockResolvedValue({ data: null, error: { message: 'Failed to fetch' } });

    render(<ServicesTable />);

    // Wait for loading to finish (component sets services to empty array on error)
    await waitFor(() => {
        // The component catches error and just logs it, then sets loading false.
        // It doesn't show an error message in UI, just empty list or whatever was there.
        // If it sets services to [], it shows "No services found".
        expect(screen.getByText('No services found. Add one to get started.')).toBeInTheDocument();
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching services:', expect.objectContaining({ message: 'Failed to fetch' }));
    consoleSpy.mockRestore();
  });

  it('renders empty state', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    render(<ServicesTable />);

    await waitFor(() => {
      expect(screen.getByText('No services found. Add one to get started.')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    mockOrder.mockResolvedValue({ data: mockServices, error: null });
    
    render(<ServicesTable />);

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
    });

    // Find delete button (Trash2 icon)
    // Try multiple selectors for robustness
    const deleteButtons = screen.getAllByRole('button');
    const deleteBtn = deleteButtons.find(btn => btn.querySelector('.lucide-trash-2'));
    
    expect(deleteBtn).toBeDefined();
    fireEvent.click(deleteBtn!);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this service?');
    
    // Check if delete was called
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', '1'); // Assuming first button is for first service
    
    // After delete, it refetches
    await waitFor(() => {
        expect(mockSelect).toHaveBeenCalledTimes(2); // Initial + after delete
    });
  });

  it('handles delete cancellation', async () => {
    mockOrder.mockResolvedValue({ data: mockServices, error: null });
    (window.confirm as any).mockReturnValue(false);

    render(<ServicesTable />);

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button');
    const deleteBtn = deleteButtons.find(btn => btn.querySelector('.lucide-trash-2'));
    
    fireEvent.click(deleteBtn!);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('navigates to create page', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    render(<ServicesTable />);

    await waitFor(() => {
      expect(screen.getByText('Add Service')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Service'));

    expect(window.location.href).toBe('/admin/services/new');
  });

  it('navigates to edit page', async () => {
    mockOrder.mockResolvedValue({ data: mockServices, error: null });

    render(<ServicesTable />);

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
    });

    // Find edit button (Edit icon)
    const buttons = screen.getAllByRole('button');
    // Helper to find edit button with various possible classes
    const editBtn = buttons.find(b => 
        b.querySelector('.lucide-edit') || 
        b.querySelector('.lucide-pen-square') || 
        b.querySelector('.lucide-square-pen')
    );
    
    expect(editBtn).toBeDefined();
    fireEvent.click(editBtn!);

    expect(window.location.href).toBe('/admin/services/1');
  });
});
