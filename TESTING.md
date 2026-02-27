# Cuba Tattoo Studio - Testing Guide

## Overview

This project includes a comprehensive test suite using **Vitest** as the test runner and **React Testing Library** for component testing.

## Quick Start

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.ts                              # Test environment setup
├── unit/
│   └── store.test.ts                     # Nanostores state management tests (32 tests)
├── components/
│   ├── FloatingDock.test.tsx             # Floating dock navigation tests (29 tests)
│   ├── chat/
│   │   └── ChatWidget.test.tsx          # Chat widget tests (19 tests)
│   └── gallery/
│       ├── PhotoGallery.test.tsx         # Unified masonry gallery tests (19 tests)
│       └── PhotoLightbox.test.tsx        # Fullscreen lightbox tests (36 tests)
```

## Test Suites

### 1. FloatingDock Component Tests (29 tests)

**File:** `tests/components/FloatingDock.test.tsx`

**Coverage:**
- ✅ Rendering - dock, nav items, action buttons
- ✅ Active section tracking with nanostores
- ✅ Scroll behavior (hide/show, progress bar)
- ✅ Navigation functions (scroll to section, scroll to top)
- ✅ Mobile responsiveness and magnification on desktop
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Event cleanup on unmount

**Test Groups:**
1. **Rendering** - Verify all elements render correctly
2. **Active Section Tracking** - Test section detection and indicator display
3. **Scroll Behavior** - Test hide/show on scroll, progress bar updates
4. **Navigation Functions** - Test scroll-to-section and scroll-to-top
5. **Mobile Responsiveness** - Test responsive breakpoints
6. **Magnification Effect** - Test desktop hover scaling (desktop only)
7. **Accessibility** - Test ARIA labels, keyboard navigation, tab order
8. **Progress Bar** - Test progress calculation
9. **Cleanup** - Test event listener cleanup

### 2. ChatWidget Component Tests (19 tests)

**File:** `tests/components/chat/ChatWidget.test.tsx`

**Coverage:**
- ✅ Loading and displaying messages (with WebSocket mock)
- ✅ Sending messages with optimistic updates
- ✅ Connection status indication
- ✅ Message grouping by date (Today/Yesterday labels)
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Error recovery with retry button
- ✅ Empty state display
- ✅ Resource cleanup on unmount

**Test Groups:**
1. **Rendering** - Loading state, messages area, input, send button
2. **Loading Messages** - Fetch, display, error handling, server errors
3. **Sending Messages** - Form submit with optimistic insert
4. **Connection Status** - WebSocket status indicators
5. **Accessibility** - ARIA labels, keyboard navigation
6. **Message Grouping** - Date-based grouping
7. **Error Recovery** - Retry button and re-fetch
8. **Empty/Header State** - Empty conversation, header branding
9. **Cleanup** - Resource cleanup

### 3. PhotoGallery Component Tests (19 tests)

**File:** `tests/components/gallery/PhotoGallery.test.tsx`

**Coverage:**
- ✅ Masonry grid rendering with CSS columns
- ✅ Filter tabs (show/hide, active state, custom labels)
- ✅ Pagination with Load More button
- ✅ Lightbox integration (open/close)
- ✅ Instagram CTA link visibility
- ✅ Accent color theming
- ✅ Artist portfolio mode (single artist, no filters)

**Test Groups:**
1. **Rendering** - Grid container, photo buttons, alt text, placeholders
2. **Filter Tabs** - Visibility, filtering, highlight, custom labels
3. **Pagination** - Load More display, item loading
4. **Lightbox Integration** - Open/close photo lightbox
5. **Instagram CTA** - Conditional display, link attributes
6. **Accent Color** - Custom and default accent colors
7. **Artist Portfolio Mode** - Single-artist context

### 4. PhotoLightbox Component Tests (36 tests)

**File:** `tests/components/gallery/PhotoLightbox.test.tsx`

**Coverage:**
- ✅ Fullscreen overlay rendering
- ✅ Image display (local + CachedImage for R2)
- ✅ Navigation arrows and keyboard (ArrowLeft/Right, Escape)
- ✅ Zoom controls (in/out, limits 100%-300%, reset on nav)
- ✅ Item counter display
- ✅ Body scroll lock/unlock
- ✅ Close behavior (button, backdrop, Escape)
- ✅ Artist profile card and sidebar content
- ✅ Featured work metadata (title, style, description, tags)
- ✅ CTAs (Book this Style, View Artist Profile)

**Test Groups:**
1. **Rendering** - Overlay, image, close button, arrows, counter
2. **Zoom Controls** - Zoom in/out, limits, percentage display
3. **Navigation** - Next/prev, wrap-around
4. **Keyboard Navigation** - ArrowRight, ArrowLeft, Escape
5. **Body Scroll Lock** - Lock on mount, restore on unmount
6. **Close Behavior** - Button, backdrop click, content click prevention
7. **Artist Profile** - Profile card, badge, View Profile link
8. **Sidebar Content** - Caption, featured work, tags, Book CTA
9. **Zoom Reset** - Reset on item change
10. **Cleanup** - Event listener removal

### 5. Store Tests (32 tests)

**File:** `tests/unit/store.test.ts`

**Coverage:**
- ✅ All nanostores atoms and maps
- ✅ localStorage integration
- ✅ State updates and subscribers
- ✅ Booking draft persistence
- ✅ Error handling for corrupted data

**Test Groups:**
1. **$activeSection** - Section tracking atom
2. **$currentBackground** - Background URL management
3. **$sectionBackgrounds** - Section background registry
4. **$imageRegistry** - Image URL registry
5. **$cacheStats** - Cache statistics
6. **$pageMode** - Page mode switching
7. **$artistAccent** - Color management
8. **$bookingDraft** - Booking form state with persistence
9. **localStorage Integration** - Persistence and recovery
10. **Multiple Subscribers** - Multi-listener support

## Test Environment Setup

### Configuration Files

**vitest.config.ts** - Vitest configuration with jsdom environment
**tests/setup.ts** - Global test setup with mocks (jest-dom matchers, browser API mocks)

### Mocked APIs

- `window.matchMedia` - Media query detection
- `window.scrollTo` - Window scrolling
- `requestAnimationFrame` / `cancelAnimationFrame` - Frame scheduling
- `IntersectionObserver` - Element visibility detection
- `ResizeObserver` - Element size detection
- `fetch` - HTTP requests

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test File
```bash
npm test -- FloatingDock
npm test -- ChatWidget
npm test -- store
npm test -- PhotoGallery
npm test -- PhotoLightbox
```

### Watch Mode
```bash
npm test -- --watch
```

### UI Dashboard
```bash
npm run test:ui
```

### Coverage Report
```bash
npm run test:coverage
```

## Coverage Goals

- **Target:** 80%+ code coverage
- **Priority:** Critical business logic (navigation, state management, chat)
- **Coverage Types:** Line coverage, Branch coverage, Function coverage

## Writing New Tests

### Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from '../Component';

describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<Component />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
```

### Best Practices

1. **Use Semantic Queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
2. **Test Behavior, Not Implementation** - Test what users see and do
3. **Async Operations** - Use `waitFor` for async state updates
4. **Clean Up** - Always clean up mocks and timers
5. **Accessibility First** - Ensure components are accessible
6. **User Interactions** - Use `userEvent` instead of `fireEvent`

## Debugging Tests

### View Test Output
```bash
npm test -- --reporter=verbose
```

### Debug Mode
```bash
npm test -- --inspect-brk
```

### View DOM
```typescript
import { screen, debug } from '@testing-library/react';

debug(screen.getByRole('button'));
```

## CI/CD Integration

Tests run automatically on:
- `npm run build` - Build verification
- GitHub Actions (if configured)

## Troubleshooting

### Common Issues

**Issue:** Tests timeout
- **Solution:** Increase timeout with `vi.setConfig({ testTimeout: 10000 })`

**Issue:** Mock not working
- **Solution:** Ensure mock is defined before component import

**Issue:** localStorage is null
- **Solution:** Use `localStorage.clear()` in `beforeEach`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure coverage remains above 80%
3. Test edge cases and error scenarios
4. Update this documentation if adding new test patterns
