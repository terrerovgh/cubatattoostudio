import type { Animation, AnimationProperties } from '../types/editor';

/**
 * Animation presets for common effects
 */
export const ANIMATION_PRESETS: Record<string, AnimationProperties> = {
    fadeIn: {
        duration: 0.6,
        from: { opacity: 0 },
        to: { opacity: 1 },
        easing: 'power2.out',
    },
    fadeInUp: {
        duration: 0.8,
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0 },
        easing: 'power3.out',
    },
    fadeInDown: {
        duration: 0.8,
        from: { opacity: 0, y: -30 },
        to: { opacity: 1, y: 0 },
        easing: 'power3.out',
    },
    fadeInLeft: {
        duration: 0.8,
        from: { opacity: 0, x: -30 },
        to: { opacity: 1, x: 0 },
        easing: 'power3.out',
    },
    fadeInRight: {
        duration: 0.8,
        from: { opacity: 0, x: 30 },
        to: { opacity: 1, x: 0 },
        easing: 'power3.out',
    },
    scaleIn: {
        duration: 0.6,
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
        easing: 'back.out(1.7)',
    },
    slideInLeft: {
        duration: 0.8,
        from: { x: -100 },
        to: { x: 0 },
        easing: 'power3.out',
    },
    slideInRight: {
        duration: 0.8,
        from: { x: 100 },
        to: { x: 0 },
        easing: 'power3.out',
    },
    rotateIn: {
        duration: 0.8,
        from: { opacity: 0, rotation: -180 },
        to: { opacity: 1, rotation: 0 },
        easing: 'power2.out',
    },
    elastic: {
        duration: 1.2,
        from: { scale: 0 },
        to: { scale: 1 },
        easing: 'elastic.out(1, 0.3)',
    },
    bounce: {
        duration: 1,
        from: { y: -100 },
        to: { y: 0 },
        easing: 'bounce.out',
    },
};

/**
 * GSAP easing options
 */
export const GSAP_EASINGS = [
    'none',
    'power1.in', 'power1.out', 'power1.inOut',
    'power2.in', 'power2.out', 'power2.inOut',
    'power3.in', 'power3.out', 'power3.inOut',
    'power4.in', 'power4.out', 'power4.inOut',
    'back.in(1.7)', 'back.out(1.7)', 'back.inOut(1.7)',
    'elastic.in(1, 0.3)', 'elastic.out(1, 0.3)', 'elastic.inOut(1, 0.3)',
    'bounce.in', 'bounce.out', 'bounce.inOut',
    'circ.in', 'circ.out', 'circ.inOut',
    'expo.in', 'expo.out', 'expo.inOut',
    'sine.in', 'sine.out', 'sine.inOut',
];

/**
 * Build GSAP scroll animation configuration
 */
export function buildScrollAnimation(config: {
    element: string;
    animation: AnimationProperties;
    start?: string;
    end?: string;
    scrub?: boolean;
    pin?: boolean;
}) {
    return {
        scrollTrigger: {
            trigger: config.element,
            start: config.start || 'top 80%',
            end: config.end || 'bottom 20%',
            scrub: config.scrub !== undefined ? config.scrub : false,
            pin: config.pin !== undefined ? config.pin : false,
        },
        ...config.animation.to,
        duration: config.animation.duration || 1,
        ease: config.animation.easing || 'power2.out',
    };
}

/**
 * Build GSAP viewport animation configuration
 */
export function buildViewportAnimation(config: {
    element: string;
    animation: AnimationProperties;
    threshold?: number;
}) {
    return {
        scrollTrigger: {
            trigger: config.element,
            start: 'top bottom',
            toggleActions: 'play none none reverse',
            once: false,
        },
        from: config.animation.from || {},
        to: config.animation.to || {},
        duration: config.animation.duration || 0.8,
        ease: config.animation.easing || 'power3.out',
        stagger: config.animation.stagger,
    };
}

/**
 * Build Framer Motion variants
 */
export function buildFramerVariants(animation: AnimationProperties) {
    return {
        hidden: animation.from || { opacity: 0 },
        visible: {
            ...(animation.to || { opacity: 1 }),
            transition: {
                duration: animation.duration || 0.6,
                ease: convertEasingToFramer(animation.easing || 'easeOut'),
                delay: animation.delay || 0,
                repeat: animation.repeat || 0,
                repeatType: animation.yoyo ? 'reverse' : 'loop',
            },
        },
    };
}

/**
 * Convert GSAP easing to Framer Motion easing
 */
function convertEasingToFramer(gsapEasing: string): any {
    const easingMap: Record<string, any> = {
        'none': 'linear',
        'power1.out': 'easeOut',
        'power2.out': 'easeOut',
        'power3.out': 'easeOut',
        'power1.in': 'easeIn',
        'power2.in': 'easeIn',
        'power3.in': 'easeIn',
        'power1.inOut': 'easeInOut',
        'power2.inOut': 'easeInOut',
        'power3.inOut': 'easeInOut',
        'back.out(1.7)': 'backOut',
        'back.in(1.7)': 'backIn',
        'back.inOut(1.7)': 'backInOut',
    };

    return easingMap[gsapEasing] || 'easeOut';
}

/**
 * Generate animation code for preview
 */
export function generateAnimationCode(animation: Animation): string {
    if (animation.type === 'gsap') {
        return generateGSAPCode(animation);
    } else if (animation.type === 'framer') {
        return generateFramerCode(animation);
    } else {
        return generateCSSCode(animation);
    }
}

function generateGSAPCode(animation: Animation): string {
    const { properties, triggerType, triggerConfig } = animation;

    if (triggerType === 'scroll') {
        return `gsap.to('${animation.targetSelector}', {
  ...${JSON.stringify(properties.to, null, 2)},
  scrollTrigger: {
    trigger: '${animation.targetSelector}',
    start: '${triggerConfig?.start || 'top 80%'}',
    end: '${triggerConfig?.end || 'bottom 20%'}',
    scrub: ${triggerConfig?.scrub || false},
  }
});`;
    }

    return `gsap.from('${animation.targetSelector}', ${JSON.stringify(properties, null, 2)});`;
}

function generateFramerCode(animation: Animation): string {
    const variants = buildFramerVariants(animation.properties);
    return `<motion.div
  variants={${JSON.stringify(variants, null, 2)}}
  initial="hidden"
  animate="visible"
>
  {/* Your content */}
</motion.div>`;
}

function generateCSSCode(animation: Animation): string {
    return `/* Add this to your CSS */
@keyframes ${animation.name} {
  from {
    ${Object.entries(animation.properties.from || {}).map(([k, v]) => `${k}: ${v};`).join('\n    ')}
  }
  to {
    ${Object.entries(animation.properties.to || {}).map(([k, v]) => `${k}: ${v};`).join('\n    ')}
  }
}

${animation.targetSelector} {
  animation: ${animation.name} ${animation.properties.duration || 1}s ${animation.properties.easing || 'ease'};
}`;
}

/**
 * Validate animation configuration
 */
export function validateAnimation(animation: Partial<Animation>): string[] {
    const errors: string[] = [];

    if (!animation.name) {
        errors.push('Animation name is required');
    }

    if (!animation.type) {
        errors.push('Animation type is required');
    }

    if (!animation.properties) {
        errors.push('Animation properties are required');
    }

    if (animation.type === 'gsap' && !animation.targetSelector) {
        errors.push('Target selector is required for GSAP animations');
    }

    return errors;
}
