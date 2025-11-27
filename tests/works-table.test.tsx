import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WorksTable from '../src/components/admin/works/WorksTable';

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
});

afterEach(() => {
  cleanup();
  window.location = originalLocation as any;
});

describe('WorksTable', () => {
  const mockWorks = [
    {
      id: '1',
      title: 'Work 1',
      image_url: 'https://example.com/image1.jpg',
      published: true,
      created_at: '2023-01-01',
    },
    {
      id: '2',
      title: 'Work 2',
      image_url: null,
      published: false,
      created_at: '2023-01-02',
    },
  ];

  it('renders loading state initially', () => {
    mockOrder.mockReturnValue(new Promise(() => {}));
    
    render(<WorksTable />);
    expect(screen.getByText('Loading works...')).toBeInTheDocument();
  });

  it('fetches and displays works', async () => {
    mockOrder.mockResolvedValue({ data: mockWorks, error: null });

    render(<WorksTable />);

    await waitFor(() => {
      expect(screen.getByText('Work 1')).toBeInTheDocument();
      expect(screen.getByText('Work 2')).toBeInTheDocument();
      expect(screen.getByText('Published')).toBeInTheDocument();
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });
    
    // Check for image
    const image = screen.getByAltText('Work 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('handles fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockOrder.mockResolvedValue({ data: null, error: { message: 'Failed to fetch' } });

    render(<WorksTable />);

    await waitFor(() => {
        // WorksTable sets error state which renders an error message
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
    
    consoleSpy.mockRestore();
  });

  it('renders empty state', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    render(<WorksTable />);

    await waitFor(() => {
      expect(screen.getByText('No works found. Add one to get started.')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    mockOrder.mockResolvedValue({ data: mockWorks, error: null });
    
    render(<WorksTable />);

    await waitFor(() => {
      expect(screen.getByText('Work 1')).toBeInTheDocument();
    });

    // Find delete button (Trash2 icon)
    const deleteButtons = screen.getAllByRole('button');
    const deleteBtn = deleteButtons.find(btn => btn.querySelector('.lucide-trash-2'));
    
    expect(deleteBtn).toBeDefined();
    fireEvent.click(deleteBtn!);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Work 1"? This action cannot be undone.');
    
    // Check if delete was called
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', '1');
    
    // Should show success message
    await waitFor(() => {
        expect(screen.getByText('Work "Work 1" deleted successfully!')).toBeInTheDocument();
    });
    
    // Should remove item from list
    expect(screen.queryByText('Work 1')).not.toBeInTheDocument();
  });

  it('handles delete error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockOrder.mockResolvedValue({ data: mockWorks, error: null });
    mockEq.mockResolvedValue({ error: { message: 'Delete failed' } });
    
    render(<WorksTable />);

    await waitFor(() => {
      expect(screen.getByText('Work 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button');
    const deleteBtn = deleteButtons.find(btn => btn.querySelector('.lucide-trash-2'));
    
    fireEvent.click(deleteBtn!);

    await waitFor(() => {
        expect(screen.getByText('Delete failed')).toBeInTheDocument();
    });
    
    // Item should still be there
    expect(screen.getByText('Work 1')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('navigates to create page', async () => {
    mockOrder.mockResolvedValue({ data: [], error: null });

    render(<WorksTable />);

    await waitFor(() => {
      expect(screen.getByText('Add Work')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Work'));

    expect(window.location.href).toBe('/admin/works/new');
  });

  it('navigates to edit page', async () => {
    mockOrder.mockResolvedValue({ data: mockWorks, error: null });

    render(<WorksTable />);

    await waitFor(() => {
      expect(screen.getByText('Work 1')).toBeInTheDocument();
    });

    // Find edit button
    const buttons = screen.getAllByRole('button');
    const editBtn = buttons.find(b => 
        b.querySelector('.lucide-edit') || 
        b.querySelector('.lucide-pen-square') || 
        b.querySelector('.lucide-square-pen')
    );
    
    expect(editBtn).toBeDefined();
    fireEvent.click(editBtn!);

    expect(window.location.href).toBe('/admin/works/1');
  });
});
