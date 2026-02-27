import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, CalendarDays, Users, Palette, Zap, Image,
  UserCog, MessageCircle, Tag, Package, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

export type AdminTab =
  | 'overview' | 'bookings' | 'calendar' | 'clients' | 'artists'
  | 'flash' | 'gallery' | 'users' | 'chat' | 'promotions'
  | 'inventory' | 'settings';

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'artists', label: 'Artists', icon: Palette },
  { id: 'flash', label: 'Flash Designs', icon: Zap },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'users', label: 'Users', icon: UserCog },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'promotions', label: 'Promotions', icon: Tag },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  session: { display_name: string; email: string };
}

export function AdminLayout({ children, activeTab, onTabChange, session }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-white font-sans overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8956C]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#C8956C]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0c]/80 backdrop-blur-xl border-r border-white/10 flex flex-col
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C8956C] to-[#b8855c] flex items-center justify-center shadow-lg shadow-[#C8956C]/20">
              <span className="text-white font-black text-xs tracking-tighter">CT</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Cuba Tattoo</p>
              <p className="text-[10px] text-[#C8956C] uppercase tracking-widest font-semibold mt-0.5">Admin Portal</p>
            </div>
          </a>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold
                  transition-all duration-200
                  ${isActive
                    ? 'bg-[#C8956C]/10 text-[#C8956C] shadow-sm shadow-[#C8956C]/5'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#C8956C]' : 'text-gray-500'} />
                <span className="tracking-wide">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-[#C8956C] font-bold text-sm">
                {session.display_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-200 truncate">{session.display_name}</p>
              <p className="text-[11px] text-gray-500 truncate">{session.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 text-[13px] font-semibold text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col min-w-0 z-10">
        {/* Header */}
        <header className="h-16 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/10 flex items-center px-6 lg:px-8 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 text-gray-400 hover:text-white transition-colors">
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-white capitalize tracking-wide">
            {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <a href="/" target="_blank" className="text-[13px] font-semibold text-gray-400 hover:text-[#C8956C] transition-colors flex items-center gap-2">
              View Site
              <ChevronRight size={14} />
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
