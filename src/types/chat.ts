export interface ChatRoom {
  id: string;
  client_id: string;
  artist_id: string;
  status: 'active' | 'archived' | 'blocked';
  last_message_at?: string;
  created_at: string;
}

export interface ChatRoomWithDetails extends ChatRoom {
  client_name: string;
  client_email: string;
  artist_name: string;
  unread_count: number;
  last_message?: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_type: 'artist' | 'client';
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'booking_link';
  is_read: boolean;
  created_at: string;
}

export interface ChatToken {
  id: string;
  token: string;
  room_id: string;
  client_id: string;
  expires_at: string;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  image_url: string;
  style?: string;
  tags?: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Promotion {
  id: string;
  artist_id?: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed' | 'custom';
  discount_value?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

// WebSocket message types
export type WSMessageType = 'message' | 'typing' | 'read' | 'connected' | 'disconnected';

export interface WSMessage {
  type: WSMessageType;
  payload: {
    room_id: string;
    sender_type?: 'artist' | 'client';
    sender_id?: string;
    content?: string;
    message_type?: 'text' | 'image' | 'booking_link';
    message_id?: string;
    timestamp?: string;
  };
}
