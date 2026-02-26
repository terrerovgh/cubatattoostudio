import { useState, lazy, Suspense } from 'react';
import { AdminLayout, type AdminTab } from './AdminLayout';

const OverviewTab = lazy(() => import('./tabs/OverviewTab').then(m => ({ default: m.OverviewTab })));
const BookingsTab = lazy(() => import('./tabs/BookingsTab').then(m => ({ default: m.BookingsTab })));
const CalendarTab = lazy(() => import('./tabs/CalendarTab').then(m => ({ default: m.CalendarTab })));
const ClientsTab = lazy(() => import('./tabs/ClientsTab').then(m => ({ default: m.ClientsTab })));
const ArtistsTab = lazy(() => import('./tabs/ArtistsTab').then(m => ({ default: m.ArtistsTab })));
const FlashTab = lazy(() => import('./tabs/FlashTab').then(m => ({ default: m.FlashTab })));
const GalleryTab = lazy(() => import('./tabs/GalleryTab').then(m => ({ default: m.GalleryTab })));
const UsersTab = lazy(() => import('./tabs/UsersTab').then(m => ({ default: m.UsersTab })));
const ChatTab = lazy(() => import('./tabs/ChatTab').then(m => ({ default: m.ChatTab })));
const PromotionsTab = lazy(() => import('./tabs/PromotionsTab').then(m => ({ default: m.PromotionsTab })));
const InventoryTab = lazy(() => import('./tabs/InventoryTab').then(m => ({ default: m.InventoryTab })));
const SettingsTab = lazy(() => import('./tabs/SettingsTab').then(m => ({ default: m.SettingsTab })));

interface Props {
  session: {
    user_id: string;
    email: string;
    role: string;
    display_name: string;
  };
}

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin" />
    </div>
  );
}

export function AdminDashboard({ session }: Props) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'bookings': return <BookingsTab />;
      case 'calendar': return <CalendarTab />;
      case 'clients': return <ClientsTab />;
      case 'artists': return <ArtistsTab />;
      case 'flash': return <FlashTab />;
      case 'gallery': return <GalleryTab />;
      case 'users': return <UsersTab />;
      case 'chat': return <ChatTab />;
      case 'promotions': return <PromotionsTab />;
      case 'inventory': return <InventoryTab />;
      case 'settings': return <SettingsTab session={session} />;
      default: return <OverviewTab />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} session={session}>
      <Suspense fallback={<TabLoader />}>
        {renderTab()}
      </Suspense>
    </AdminLayout>
  );
}
