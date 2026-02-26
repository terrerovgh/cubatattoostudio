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
src/
├── __tests__/
│   └── store.test.ts                 # Nanostores tests
├── components/
│   ├── __tests__/
│   │   └── FloatingDock.test.tsx     # Floating dock navigation tests
│   └── chat/
│       └── __tests__/
│           └── ChatWidget.test.tsx   # Chat widget tests
└── tests/
    └── setup.ts                       # Test environment setup
```

## Test Suites

### 1. FloatingDock Component Tests (`60+ tests`)

**File:** `src/components/__tests__/FloatingDock.test.tsx`

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

### 2. ChatWidget Component Tests (`40+ tests`)

**File:** `src/components/chat/__tests__/ChatWidget.test.tsx`

**Coverage:**
- ✅ Loading and displaying messages
- ✅ Sending messages with error handling
- ✅ Connection status indication
- ✅ Message grouping by date
- ✅ Accessibility and keyboard navigation
- ✅ Error recovery with retry
- ✅ Resource cleanup

**Test Groups:**
1. **Rendering** - Verify chat UI elements
2. **Loading Messages** - Test fetch, display, and error handling
3. **Sending Messages** - Test send functionality and input clearing
4. **Connection Status** - Test connection indicators and typing indicators
5. **Accessibility** - Test ARIA labels and keyboard navigation
6. **Message Grouping** - Test date-based grouping
7. **Error Recovery** - Test error display and retry
8. **Cleanup** - Test resource cleanup

### 3. Store Tests (`50+ tests`)

**File:** `src/__tests__/store.test.ts`

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
**src/tests/setup.ts** - Global test setup with mocks

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
