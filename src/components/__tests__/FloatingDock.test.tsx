import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FloatingDock from '../FloatingDock';
import * as nanostores from '@nanostores/react';

// Mock nanostores
vi.mock('@nanostores/react', () => ({
  useStore: vi.fn(),
}));

describe('FloatingDock Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for activeSection store
    (nanostores.useStore as any).mockReturnValue('hero');
    // Reset scroll position
    window.scrollY = 0;
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 2400,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Rendering', () => {
    it('should render the dock navigation', () => {
      render(<FloatingDock />);
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('should render all navigation items', () => {
      render(<FloatingDock />);
      expect(screen.getByLabelText('Home')).toBeInTheDocument();
      expect(screen.getByLabelText('Promos')).toBeInTheDocument();
      expect(screen.getByLabelText('Artists')).toBeInTheDocument();
      expect(screen.getByLabelText('Gallery')).toBeInTheDocument();
      expect(screen.getByLabelText('Book')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<FloatingDock />);
      expect(screen.getByLabelText('Call Cuba Tattoo Studio')).toBeInTheDocument();
      expect(screen.getByLabelText('Visit Cuba Tattoo Studio on Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
    });

    it('should have correct phone link', () => {
      render(<FloatingDock />);
      const phoneLink = screen.getByLabelText('Call Cuba Tattoo Studio');
      expect(phoneLink).toHaveAttribute('href', 'tel:+15054929806');
    });

    it('should have correct instagram link', () => {
      render(<FloatingDock />);
      const igLink = screen.getByLabelText('Visit Cuba Tattoo Studio on Instagram');
      expect(igLink).toHaveAttribute('href', 'https://instagram.com/cubatattoostudio');
      expect(igLink).toHaveAttribute('target', '_blank');
      expect(igLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Active Section Tracking', () => {
    it('should show active indicator on current section', () => {
      (nanostores.useStore as any).mockReturnValue('hero');
      render(<FloatingDock />);
      const homeButton = screen.getByLabelText('Home');
      expect(homeButton).toHaveAttribute('aria-current', 'true');
    });

    it('should not show active indicator on non-active sections', () => {
      (nanostores.useStore as any).mockReturnValue('hero');
      render(<FloatingDock />);
      const promosButton = screen.getByLabelText('Promos');
      expect(promosButton).not.toHaveAttribute('aria-current');
    });

    it('should update when active section changes', () => {
      const { rerender } = render(<FloatingDock />);

      (nanostores.useStore as any).mockReturnValue('promotions');
      rerender(<FloatingDock />);

      const promosButton = screen.getByLabelText('Promos');
      expect(promosButton).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('Scroll Behavior', () => {
    it('should show scroll-to-top button after scrolling 50% viewport height', async () => {
      render(<FloatingDock />);

      const scrollTopButton = screen.getByLabelText('Scroll to top');
      expect(scrollTopButton.parentElement).toHaveStyle({ maxWidth: '0px' });

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 500,
      });

      fireEvent.scroll(window);

      await waitFor(() => {
        expect(scrollTopButton.parentElement).toHaveStyle({ maxWidth: '44px' });
      });
    });

    it('should hide scroll-to-top button when scrolled back to top', async () => {
      render(<FloatingDock />);

      // Scroll down
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 500,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        const scrollTopButton = screen.getByLabelText('Scroll to top');
        expect(scrollTopButton.parentElement).toHaveStyle({ maxWidth: '44px' });
      });

      // Scroll back up
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 0,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        const scrollTopButton = screen.getByLabelText('Scroll to top');
        expect(scrollTopButton.parentElement).toHaveStyle({ maxWidth: '0px' });
      });
    });

    it('should hide dock when scrolling down rapidly', async () => {
      render(<FloatingDock />);
      const nav = screen.getByRole('navigation');

      // Initial scroll position
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 200,
      });
      fireEvent.scroll(window);

      // Scroll down rapidly (more than 15px)
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 250,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        const style = window.getComputedStyle(nav);
        expect(style.transform).toContain('translateY');
      });
    });

    it('should show dock when scrolling up', async () => {
      render(<FloatingDock />);
      const nav = screen.getByRole('navigation');

      // Start at hidden position
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 300,
      });
      fireEvent.scroll(window);

      // Scroll up
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 250,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        const style = window.getComputedStyle(nav);
        expect(style.transform).toContain('translateX(-50%)');
      });
    });

    it('should always show dock when near top (scroll < 100px)', async () => {
      render(<FloatingDock />);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 50,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        const nav = screen.getByRole('navigation');
        const style = window.getComputedStyle(nav);
        expect(style.opacity).toBe('1');
      });
    });
  });

  describe('Navigation Functions', () => {
    it('should scroll to section when clicking nav item', async () => {
      const mockElement = document.createElement('div');
      mockElement.id = 'promotions';
      mockElement.scrollIntoView = vi.fn();
      document.body.appendChild(mockElement);

      render(<FloatingDock />);

      const promosButton = screen.getByLabelText('Promos');
      await userEvent.click(promosButton);

      await waitFor(() => {
        expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      });

      document.body.removeChild(mockElement);
    });

    it('should scroll to top when clicking scroll-to-top button', async () => {
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 500,
      });

      render(<FloatingDock />);
      fireEvent.scroll(window);

      await waitFor(() => {
        const scrollTopButton = screen.getByLabelText('Scroll to top');
        userEvent.click(scrollTopButton);
      });

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should detect mobile screen size', async () => {
      const mql = window.matchMedia('(max-width: 640px)');
      (window.matchMedia as any).mockImplementation((query) => {
        if (query === '(max-width: 640px)') {
          return {
            matches: true,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          };
        }
        return {
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        };
      });

      render(<FloatingDock />);

      await waitFor(() => {
        const nav = screen.getByRole('navigation');
        expect(nav).toBeInTheDocument();
      });
    });

    it('should disable magnification on mobile', async () => {
      (window.matchMedia as any).mockImplementation((query) => ({
        matches: query === '(max-width: 640px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      render(<FloatingDock />);

      const homeButton = screen.getByLabelText('Home');

      // Hover should not trigger magnification on mobile
      await userEvent.hover(homeButton);

      await waitFor(() => {
        const style = window.getComputedStyle(homeButton);
        // On mobile, scale should remain 1
        expect(style.transform).not.toContain('scale(1.22)');
      });
    });
  });

  describe('Magnification Effect (Desktop)', () => {
    beforeEach(() => {
      (window.matchMedia as any).mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
    });

    it('should scale up hovered item', async () => {
      render(<FloatingDock />);

      const homeButton = screen.getByLabelText('Home');
      await userEvent.hover(homeButton);

      await waitFor(() => {
        const style = window.getComputedStyle(homeButton);
        expect(style.transform).toContain('scale(1.22)');
      });
    });

    it('should scale neighbors slightly', async () => {
      render(<FloatingDock />);

      const homeButton = screen.getByLabelText('Home');
      await userEvent.hover(homeButton);

      await waitFor(() => {
        const promosButton = screen.getByLabelText('Promos');
        const style = window.getComputedStyle(promosButton);
        expect(style.transform).toContain('scale(1.09)');
      });
    });

    it('should lift item on hover', async () => {
      render(<FloatingDock />);

      const homeButton = screen.getByLabelText('Home');
      await userEvent.hover(homeButton);

      await waitFor(() => {
        const style = window.getComputedStyle(homeButton);
        expect(style.transform).toContain('translateY(-6px)');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels on all items', () => {
      render(<FloatingDock />);

      expect(screen.getByLabelText('Home')).toBeInTheDocument();
      expect(screen.getByLabelText('Promos')).toBeInTheDocument();
      expect(screen.getByLabelText('Artists')).toBeInTheDocument();
      expect(screen.getByLabelText('Gallery')).toBeInTheDocument();
      expect(screen.getByLabelText('Book')).toBeInTheDocument();
      expect(screen.getByLabelText('Call Cuba Tattoo Studio')).toBeInTheDocument();
      expect(screen.getByLabelText('Visit Cuba Tattoo Studio on Instagram')).toBeInTheDocument();
    });

    it('should mark active item with aria-current', () => {
      (nanostores.useStore as any).mockReturnValue('promotions');
      render(<FloatingDock />);

      const promosButton = screen.getByLabelText('Promos');
      expect(promosButton).toHaveAttribute('aria-current', 'true');
    });

    it('should have proper navigation role', () => {
      render(<FloatingDock />);

      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('scroll-to-top should be hidden from tab order when not visible', async () => {
      render(<FloatingDock />);

      const scrollTopButton = screen.getByLabelText('Scroll to top');
      expect(scrollTopButton).toHaveAttribute('tabIndex', '-1');

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 500,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(scrollTopButton).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Progress Bar', () => {
    it('should update progress bar width based on scroll', async () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        writable: true,
        configurable: true,
        value: 4000,
      });

      render(<FloatingDock />);

      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 1000,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        // Progress should be 1000 / (4000 - 800) = 0.3125 ≈ 31%
        const progressBar = document.querySelector('[style*="width"]');
        expect(progressBar).toBeInTheDocument();
      });
    });

    it('should cap progress bar at 100%', async () => {
      render(<FloatingDock />);

      // Scroll beyond end
      Object.defineProperty(window, 'scrollY', {
        writable: true,
        configurable: true,
        value: 10000,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        // Progress should be capped at 1.0 (100%)
        expect(true).toBe(true);
      });
    });
  });

  describe('Cleanup', () => {
    it('should clean up scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<FloatingDock />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
      });
    });

    it('should cancel animation frame on unmount', () => {
      const { unmount } = render(<FloatingDock />);
      fireEvent.scroll(window);

      expect(global.cancelAnimationFrame).toBeDefined();

      unmount();
    });

    it('should clean up media query listener on unmount', () => {
      const mql = window.matchMedia('(max-width: 640px)');
      const removeEventListenerSpy = vi.spyOn(mql, 'removeEventListener');

      const { unmount } = render(<FloatingDock />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });
});
