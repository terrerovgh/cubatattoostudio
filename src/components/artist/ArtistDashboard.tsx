import { useState, lazy, Suspense } from 'react';
import { ArtistLayout, type ArtistTab } from './ArtistLayout';

const ArtistOverviewTab = lazy(() => import('./tabs/ArtistOverviewTab').then(m => ({ default: m.ArtistOverviewTab })));
const ArtistBookingsTab = lazy(() => import('./tabs/ArtistBookingsTab').then(m => ({ default: m.ArtistBookingsTab })));
const ArtistCalendarTab = lazy(() => import('./tabs/ArtistCalendarTab').then(m => ({ default: m.ArtistCalendarTab })));
const ArtistPortfolioTab = lazy(() => import('./tabs/ArtistPortfolioTab').then(m => ({ default: m.ArtistPortfolioTab })));
const ArtistFlashTab = lazy(() => import('./tabs/ArtistFlashTab').then(m => ({ default: m.ArtistFlashTab })));
const ArtistChatTab = lazy(() => import('./tabs/ArtistChatTab').then(m => ({ default: m.ArtistChatTab })));
const ArtistPromotionsTab = lazy(() => import('./tabs/ArtistPromotionsTab').then(m => ({ default: m.ArtistPromotionsTab })));
const ArtistSettingsTab = lazy(() => import('./tabs/ArtistSettingsTab').then(m => ({ default: m.ArtistSettingsTab })));

interface Props {
  session: {
    user_id: string;
    email: string;
    role: string;
    display_name: string;
    artist_id?: string;
  };
}

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#C8956C]/30 border-t-[#C8956C] rounded-full animate-spin" />
    </div>
  );
}

export function ArtistDashboard({ session }: Props) {
  const [activeTab, setActiveTab] = useState<ArtistTab>('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <ArtistOverviewTab />;
      case 'bookings': return <ArtistBookingsTab />;
      case 'calendar': return <ArtistCalendarTab />;
      case 'portfolio': return <ArtistPortfolioTab />;
      case 'flash': return <ArtistFlashTab />;
      case 'chat': return <ArtistChatTab />;
      case 'promotions': return <ArtistPromotionsTab />;
      case 'settings': return <ArtistSettingsTab session={session} />;
      default: return <ArtistOverviewTab />;
    }
  };

  return (
    <ArtistLayout activeTab={activeTab} onTabChange={setActiveTab} session={session}>
      <Suspense fallback={<TabLoader />}>
        {renderTab()}
      </Suspense>
    </ArtistLayout>
  );
}
