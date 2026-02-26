import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, CalendarDays, Briefcase, Zap, Image,
  MessageCircle, Tag, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

export type ArtistTab =
  | 'overview' | 'bookings' | 'calendar' | 'portfolio'
  | 'flash' | 'chat' | 'promotions' | 'settings';

interface NavItem {
  id: ArtistTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'My Bookings', icon: CalendarDays },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'portfolio', label: 'Portfolio', icon: Image },
  { id: 'flash', label: 'Flash Designs', icon: Zap },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'promotions', label: 'Promotions', icon: Tag },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface ArtistLayoutProps {
  children: ReactNode;
  activeTab: ArtistTab;
  onTabChange: (tab: ArtistTab) => void;
  session: { display_name: string; email: string; artist_id?: string };
}

export function ArtistLayout({ children, activeTab, onTabChange, session }: ArtistLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/artist/login';
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C8956C] flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">Cuba Tattoo</p>
              <p className="text-[10px] text-gray-400 -mt-0.5">Artist Portal</p>
            </div>
          </a>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5
                  transition-colors duration-150
                  ${isActive
                    ? 'bg-[#C8956C]/10 text-[#C8956C]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#C8956C]/20 flex items-center justify-center">
              <span className="text-[#C8956C] font-semibold text-sm">
                {session.display_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1a1a2e] truncate">{session.display_name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{session.artist_id || 'Artist'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 text-gray-500">
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-semibold text-[#1a1a2e] capitalize">
            {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <a href={`/artists/${session.artist_id || ''}`} className="text-sm text-gray-500 hover:text-[#C8956C] transition-colors">
              View Profile
            </a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
