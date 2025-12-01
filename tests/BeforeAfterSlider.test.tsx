import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import BeforeAfterSlider from '../src/components/ui/BeforeAfterSlider';

describe('BeforeAfterSlider', () => {
    const defaultProps = {
        beforeImage: 'before.jpg',
        afterImage: 'after.jpg',
    };

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders correctly', () => {
        render(<BeforeAfterSlider {...defaultProps} />);
        expect(screen.getByAltText('Before')).toBeDefined();
        expect(screen.getByAltText('After')).toBeDefined();
    });

    it('starts dragging when handle is touched', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        const { container } = render(<BeforeAfterSlider {...defaultProps} />);

        // Find the interactive touch area (it has the group class)
        // We can look for the element with cursor-ew-resize and touch-none inside the handle
        const handleArea = container.querySelector('.cursor-ew-resize.touch-none');
        expect(handleArea).toBeDefined();

        if (handleArea) {
            fireEvent.mouseDown(handleArea);
            
            // Check if window listeners are added
            expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
            expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
        }
    });

    it('starts dragging when handle is touched (touch event)', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        const { container } = render(<BeforeAfterSlider {...defaultProps} />);

        const handleArea = container.querySelector('.cursor-ew-resize.touch-none');
        
        if (handleArea) {
            fireEvent.touchStart(handleArea);
            
            // Check if window listeners are added
            // Note: passive: false is used for touchmove
            expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
        }
    });
});
