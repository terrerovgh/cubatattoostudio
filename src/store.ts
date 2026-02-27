import { atom, map } from 'nanostores';

/** ID of the currently visible section */
export const $activeSection = atom<string>('hero');

/** URL of the current background image */
export const $currentBackground = atom<string>('/backgrounds/hero.svg');

/** Map of section ID → background image URL */
export const $sectionBackgrounds = atom<Record<string, string>>({});

/** Map of image IDs to their source URLs (static or R2) */
export const $imageRegistry = atom<Record<string, string>>({});

/** Client-side cache statistics */
export const $cacheStats = atom<{ count: number; totalSize: number } | null>(null);

/** Page mode — controls FloatingDock behavior */
export const $pageMode = atom<'home' | 'artist'>('home');

/** Artist accent color for portfolio pages */
export const $artistAccent = atom<string>('#C8956C');

/** Current booking wizard step (persisted for recovery) */
export const $bookingStep = atom<number>(0);

/** Live price estimate shown throughout the wizard */
export const $bookingPriceEstimate = atom<{
  totalMin: number;
  totalMax: number;
  deposit: number;
  duration: number;
} | null>(null);

/** Booking form draft — persisted to localStorage for recovery */
const BOOKING_STORAGE_KEY = 'cuba_booking_draft';

interface BookingDraft {
  artist_id: string;
  service_type: string;
  style: string;
  description: string;
  placement: string;
  body_region: string;
  size_category: string;
  size_inches: string;
  is_cover_up: boolean;
  is_touch_up: boolean;
  reference_image_urls: string[];
  scheduled_date: string;
  scheduled_time: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

const getDefaultDraft = (): BookingDraft => ({
  artist_id: '',
  service_type: '',
  style: '',
  description: '',
  placement: '',
  body_region: '',
  size_category: 'medium',
  size_inches: '',
  is_cover_up: false,
  is_touch_up: false,
  reference_image_urls: [],
  scheduled_date: '',
  scheduled_time: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
});

const loadDraft = (): BookingDraft => {
  if (typeof window === 'undefined') return getDefaultDraft();
  try {
    const stored = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (stored) {
      return { ...getDefaultDraft(), ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return getDefaultDraft();
};

export const $bookingDraft = map<BookingDraft>(loadDraft());

/** Save draft to localStorage on change */
if (typeof window !== 'undefined') {
  $bookingDraft.listen((value) => {
    try {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // ignore storage errors
    }
  });
}

/** Clear booking draft after successful submission */
export function clearBookingDraft() {
  $bookingDraft.set(getDefaultDraft());
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }
}
