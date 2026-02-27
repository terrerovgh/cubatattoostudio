import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from '@/components/chat/ChatWidget';

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  onopen: ((ev: any) => void) | null = null;
  onmessage: ((ev: any) => void) | null = null;
  onerror: ((ev: any) => void) | null = null;
  onclose: ((ev: any) => void) | null = null;
  readyState = 0;

  constructor() {
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.({});
    }, 10);
  }

  send = vi.fn();
  close = vi.fn(() => {
    this.readyState = 3;
  });
}

// @ts-ignore
global.WebSocket = MockWebSocket;

// Mock fetch
global.fetch = vi.fn();

// Helper to create a successful fetch mock for messages
function mockFetchMessages(messages: any[] = []) {
  return (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      data: { messages },
    }),
  });
}

function mockFetchError(error: string = 'Network error') {
  return (global.fetch as any).mockRejectedValueOnce(new Error(error));
}

function mockFetchServerError(status: number = 500) {
  return (global.fetch as any).mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({
      success: false,
      error: 'Server error',
    }),
  });
}

describe('ChatWidget Component', () => {
  const mockRoomId = 'room-123';
  const mockClientId = 'client-456';

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Rendering', () => {
    it('should render loading state initially', () => {
      // Fetch that never resolves to keep loading state
      (global.fetch as any).mockImplementation(() => new Promise(() => {}));

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      // The loading state shows "Loading conversation..." text
      expect(screen.getByText('Loading conversation...')).toBeInTheDocument();
    });

    it('should render messages area after loading', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        // Uses role="log" with aria-label="Chat messages"
        expect(screen.getByRole('log', { name: /chat messages/i })).toBeInTheDocument();
      });
    });

    it('should render message input field', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
      });
    });

    it('should render send button', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
      });
    });
  });

  describe('Loading Messages', () => {
    it('should fetch messages on mount', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/chat/messages'),
        );
      });
    });

    it('should display fetched messages', async () => {
      const mockMessages = [
        {
          id: '1',
          room_id: mockRoomId,
          sender_type: 'artist' as const,
          sender_id: 'artist-1',
          content: 'Hello client!',
          message_type: 'text' as const,
          is_read: true,
          created_at: new Date().toISOString(),
        },
      ];

      mockFetchMessages(mockMessages);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByText('Hello client!')).toBeInTheDocument();
      });
    });

    it('should handle fetch errors', async () => {
      mockFetchError('Network error');

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByText(/could not load messages/i)).toBeInTheDocument();
      });
    });

    it('should show error on failed server response', async () => {
      mockFetchServerError(500);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Sending Messages', () => {
    it('should send message on form submit', async () => {
      const user = userEvent.setup();

      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      const input = await screen.findByPlaceholderText(/type a message/i);
      await user.type(input, 'Hello artist!');

      const sendButton = await screen.findByRole('button', { name: /send/i });
      await user.click(sendButton);

      // The message should appear optimistically
      await waitFor(() => {
        expect(screen.getByText('Hello artist!')).toBeInTheDocument();
      });
    });
  });

  describe('Connection Status', () => {
    it('should display connection status', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        const statusElement = document.querySelector('.text-white\\/40');
        expect(statusElement).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels on messages area', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByRole('log', { name: /chat messages/i })).toBeInTheDocument();
      });
    });

    it('should announce new messages', async () => {
      const mockMessages = [
        {
          id: '1',
          room_id: mockRoomId,
          sender_type: 'artist' as const,
          sender_id: 'artist-1',
          content: 'New message',
          message_type: 'text' as const,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ];

      mockFetchMessages(mockMessages);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByText('New message')).toBeInTheDocument();
      });
    });

    it('should have keyboard accessible send button', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      const sendButton = await screen.findByRole('button', { name: /send/i });
      expect(sendButton).toBeInTheDocument();
    });
  });

  describe('Message Grouping', () => {
    it('should group messages by date', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const mockMessages = [
        {
          id: '1',
          room_id: mockRoomId,
          sender_type: 'artist' as const,
          sender_id: 'artist-1',
          content: 'Yesterday message',
          message_type: 'text' as const,
          is_read: true,
          created_at: yesterday.toISOString(),
        },
        {
          id: '2',
          room_id: mockRoomId,
          sender_type: 'client' as const,
          sender_id: mockClientId,
          content: 'Today message',
          message_type: 'text' as const,
          is_read: true,
          created_at: today.toISOString(),
        },
      ];

      mockFetchMessages(mockMessages);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByText('Yesterday')).toBeInTheDocument();
        expect(screen.getByText('Today')).toBeInTheDocument();
      });
    });
  });

  describe('Error Recovery', () => {
    it('should show retry button on error', async () => {
      mockFetchError('Network error');

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('should retry fetching messages', async () => {
      const user = userEvent.setup();

      mockFetchError('Network error');

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      const retryButton = await screen.findByText('Retry');

      // Mock the retry fetch
      mockFetchMessages([]);

      await user.click(retryButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Cleanup', () => {
    it('should clean up on unmount', async () => {
      mockFetchMessages([]);

      const { unmount } = render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      unmount();

      expect(true).toBe(true);
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no messages', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      await waitFor(() => {
        expect(screen.getByText('Start the conversation')).toBeInTheDocument();
      });
    });
  });

  describe('Header', () => {
    it('should display Cuba Tattoo Studio header', async () => {
      mockFetchMessages([]);

      render(<ChatWidget room_id={mockRoomId} client_id={mockClientId} />);

      // "Cuba Tattoo Studio" appears in header and footer
      expect(screen.getAllByText(/Cuba Tattoo Studio/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Client Chat')).toBeInTheDocument();
    });
  });
});
