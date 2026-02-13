import { atom } from 'nanostores';

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
