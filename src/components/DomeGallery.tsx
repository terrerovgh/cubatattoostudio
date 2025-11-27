import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

type ImageItem = string | { src: string; alt?: string };

type DomeGalleryProps = {
    images?: ImageItem[];
    fit?: number;
    fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
    minRadius?: number;
    maxRadius?: number;
    padFactor?: number;
    overlayBlurColor?: string;
    maxVerticalRotationDeg?: number;
    dragSensitivity?: number;
    enlargeTransitionMs?: number;
    segments?: number;
    dragDampening?: number;
    openedImageWidth?: string;
    openedImageHeight?: string;
    imageBorderRadius?: string;
    openedImageBorderRadius?: string;
    grayscale?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
};

type ItemDef = {
    src: string;
    alt: string;
    x: number;
    y: number;
    sizeX: number;
    sizeY: number;
};

const DEFAULT_IMAGES: ImageItem[] = [
    {
        src: '/tattoo/tattoo3.png',
        alt: 'Uploaded Image'
    },
    {
        src: '/tattoo/tattoo16.png',
        alt: 'Abstract art'
    },
    {
        src: '/tattoo/tattoo15.png',
        alt: 'Modern sculpture'
    },
    {
        src: '/tattoo/tattoo10.png',
        alt: 'Digital artwork'
    },
    {
        src: '/tattoo/tattoo4.png',
        alt: 'Contemporary art'
    },
    {
        src: '/tattoo/tattoo6.png',
        alt: 'Geometric pattern'
    },
    {
        src: '/tattoo/tattoo8.png',
        alt: 'Textured surface'
    },
    {
        src: '/tattoo/tattoo12.png',
        alt: 'Social media image'
    }
];

const DEFAULTS = {
    maxVerticalRotationDeg: 5,
    dragSensitivity: 20,
    enlargeTransitionMs: 300,
    segments: 35
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
};
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
    const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool: ImageItem[], seg: number): ItemDef[] {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
        const ys = c % 2 === 0 ? evenYs : oddYs;
        return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (pool.length === 0) {
        return coords.map(c => ({ ...c, src: '', alt: '' }));
    }
    if (pool.length > totalSlots) {
        console.warn(
            `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
        );
    }

    const normalizedImages = pool.map(image => {
        if (typeof image === 'string') {
            return { src: image, alt: '' };
        }
        return { src: image.src || '', alt: image.alt || '' };
    });

    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

    for (let i = 1; i < usedImages.length; i++) {
        if (usedImages[i].src === usedImages[i - 1].src) {
            for (let j = i + 1; j < usedImages.length; j++) {
                if (usedImages[j].src !== usedImages[i].src) {
                    const tmp = usedImages[i];
                    usedImages[i] = usedImages[j];
                    usedImages[j] = tmp;
                    break;
                }
            }
        }
    }

    return coords.map((c, i) => ({
        ...c,
        src: usedImages[i].src,
        alt: usedImages[i].alt
    }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
}

export default function DomeGallery({
    images: rawImages = DEFAULT_IMAGES,
    fit = 0.5,
    fitBasis = 'auto',
    minRadius = 600,
    maxRadius = Infinity,
    padFactor = 0.25,
    overlayBlurColor = '#060010',
    maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
    dragSensitivity = DEFAULTS.dragSensitivity,
    segments = DEFAULTS.segments,
    dragDampening = 2,
    imageBorderRadius = '30px',
    grayscale = false,
    autoRotate = true,
    autoRotateSpeed = 0.02
}: DomeGalleryProps) {
    // Filter out empty images and use defaults if no valid images provided
    const images = useMemo(() => {
        const validImages = (rawImages || []).filter(img => {
            if (typeof img === 'string') {
                return img.trim().length > 0;
            }
            return img && img.src && img.src.trim().length > 0;
        });
        return validImages.length > 0 ? validImages : DEFAULT_IMAGES;
    }, [rawImages]);
    const rootRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const sphereRef = useRef<HTMLDivElement>(null);

    const rotationRef = useRef({ x: 0, y: 0 });
    const startRotRef = useRef({ x: 0, y: 0 });
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const draggingRef = useRef(false);
    const inertiaRAF = useRef<number | null>(null);
    const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>('mouse');

    const scrollLockedRef = useRef(false);
    const lockScroll = useCallback(() => {
        if (scrollLockedRef.current) return;
        scrollLockedRef.current = true;
        document.body.classList.add('dg-scroll-lock');
    }, []);
    const unlockScroll = useCallback(() => {
        if (!scrollLockedRef.current) return;
        scrollLockedRef.current = false;
        document.body.classList.remove('dg-scroll-lock');
    }, []);

    const items = useMemo(() => buildItems(images, segments), [images, segments]);

    const applyTransform = (xDeg: number, yDeg: number) => {
        const el = sphereRef.current;
        if (el) {
            el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
        }
    };

    const lockedRadiusRef = useRef<number | null>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const ro = new ResizeObserver(entries => {
            const cr = entries[0].contentRect;
            const w = Math.max(1, cr.width),
                h = Math.max(1, cr.height);
            const minDim = Math.min(w, h),
                aspect = w / h;
            let basis: number;
            switch (fitBasis) {
                case 'min':
                    basis = minDim;
                    break;
                case 'max':
                    basis = Math.max(w, h);
                    break;
                case 'width':
                    basis = w;
                    break;
                case 'height':
                    basis = h;
                    break;
                default:
                    basis = aspect >= 1.3 ? w : minDim;
            }
            let radius = basis * fit;
            const heightGuard = h * 1.35;
            radius = Math.min(radius, heightGuard);
            radius = clamp(radius, minRadius, maxRadius);
            lockedRadiusRef.current = Math.round(radius);

            const viewerPad = Math.max(8, Math.round(minDim * padFactor));
            root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
            root.style.setProperty('--viewer-pad', `${viewerPad}px`);
            root.style.setProperty('--overlay-blur-color', overlayBlurColor);
            root.style.setProperty('--tile-radius', imageBorderRadius);
            root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
            applyTransform(rotationRef.current.x, rotationRef.current.y);
        });
        ro.observe(root);
        return () => ro.disconnect();
    }, [
        fit,
        fitBasis,
        minRadius,
        maxRadius,
        padFactor,
        overlayBlurColor,
        grayscale,
        imageBorderRadius
    ]);

    useEffect(() => {
        applyTransform(rotationRef.current.x, rotationRef.current.y);
    }, []);

    useEffect(() => {
        if (!autoRotate) return;
        let animationFrameId: number;

        const animate = () => {
            if (!draggingRef.current && !inertiaRAF.current) {
                rotationRef.current.y += autoRotateSpeed;
                applyTransform(rotationRef.current.x, rotationRef.current.y);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [autoRotate, autoRotateSpeed]);

    const stopInertia = useCallback(() => {
        if (inertiaRAF.current) {
            cancelAnimationFrame(inertiaRAF.current);
            inertiaRAF.current = null;
        }
    }, []);

    const startInertia = useCallback(
        (vx: number, vy: number) => {
            const MAX_V = 1.4;
            let vX = clamp(vx, -MAX_V, MAX_V) * 80;
            let vY = clamp(vy, -MAX_V, MAX_V) * 80;
            let frames = 0;
            const d = clamp(dragDampening ?? 0.6, 0, 1);
            const frictionMul = 0.94 + 0.055 * d;
            const stopThreshold = 0.015 - 0.01 * d;
            const maxFrames = Math.round(90 + 270 * d);
            const step = () => {
                vX *= frictionMul;
                vY *= frictionMul;
                if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
                    inertiaRAF.current = null;
                    return;
                }
                if (++frames > maxFrames) {
                    inertiaRAF.current = null;
                    return;
                }
                const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
                const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
                rotationRef.current = { x: nextX, y: nextY };
                applyTransform(nextX, nextY);
                inertiaRAF.current = requestAnimationFrame(step);
            };
            stopInertia();
            inertiaRAF.current = requestAnimationFrame(step);
        },
        [dragDampening, maxVerticalRotationDeg, stopInertia]
    );

    useGesture(
        {
            onDragStart: ({ event }) => {
                stopInertia();

                const evt = event as PointerEvent;
                pointerTypeRef.current = (evt.pointerType as any) || 'mouse';
                if (pointerTypeRef.current === 'touch') evt.preventDefault();
                if (pointerTypeRef.current === 'touch') lockScroll();
                draggingRef.current = true;
                startRotRef.current = { ...rotationRef.current };
                startPosRef.current = { x: evt.clientX, y: evt.clientY };
            },
            onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0], movement }) => {
                if (!draggingRef.current || !startPosRef.current) return;

                const evt = event as PointerEvent;
                if (pointerTypeRef.current === 'touch') evt.preventDefault();

                const dxTotal = evt.clientX - startPosRef.current.x;
                const dyTotal = evt.clientY - startPosRef.current.y;

                const nextX = clamp(
                    startRotRef.current.x - dyTotal / dragSensitivity,
                    -maxVerticalRotationDeg,
                    maxVerticalRotationDeg
                );
                const nextY = startRotRef.current.y + dxTotal / dragSensitivity;

                const cur = rotationRef.current;
                if (cur.x !== nextX || cur.y !== nextY) {
                    rotationRef.current = { x: nextX, y: nextY };
                    applyTransform(nextX, nextY);
                }

                if (last) {
                    draggingRef.current = false;
                    let isTap = false;

                    if (startPosRef.current) {
                        const dx = evt.clientX - startPosRef.current.x;
                        const dy = evt.clientY - startPosRef.current.y;
                        const dist2 = dx * dx + dy * dy;
                        const TAP_THRESH_PX = pointerTypeRef.current === 'touch' ? 10 : 6;
                        if (dist2 <= TAP_THRESH_PX * TAP_THRESH_PX) {
                            isTap = true;
                        }
                    }

                    const [vMagX, vMagY] = velArr;
                    const [dirX, dirY] = dirArr;
                    let vx = vMagX * dirX;
                    let vy = vMagY * dirY;

                    if (!isTap && Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
                        const [mx, my] = movement;
                        vx = (mx / dragSensitivity) * 0.02;
                        vy = (my / dragSensitivity) * 0.02;
                    }

                    if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) {
                        startInertia(vx, vy);
                    }
                    startPosRef.current = null;

                    if (pointerTypeRef.current === 'touch') unlockScroll();
                }
            }
        },
        { target: mainRef, eventOptions: { passive: false } }
    );

    useEffect(() => {
        return () => {
            document.body.classList.remove('dg-scroll-lock');
        };
    }, []);

    const cssStyles = `
    .sphere-root {
      --radius: 520px;
      --viewer-pad: 72px;
      --circ: calc(var(--radius) * 3.14);
      --rot-y: calc((360deg / var(--segments-x)) / 2);
      --rot-x: calc((360deg / var(--segments-y)) / 2);
      --item-width: calc(var(--circ) / var(--segments-x));
      --item-height: calc(var(--circ) / var(--segments-y));
    }

    .sphere-root * { box-sizing: border-box; }
    .sphere, .sphere-item, .item__image { transform-style: preserve-3d; }

    .stage {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      position: absolute;
      inset: 0;
      margin: auto;
      perspective: calc(var(--radius) * 2);
      perspective-origin: 50% 50%;
    }

    .sphere {
      transform: translateZ(calc(var(--radius) * -1));
      will-change: transform;
      position: absolute;
    }

    .sphere-item {
      width: calc(var(--item-width) * var(--item-size-x));
      height: calc(var(--item-height) * var(--item-size-y));
      position: absolute;
      top: -999px;
      bottom: -999px;
      left: -999px;
      right: -999px;
      margin: auto;
      transform-origin: 50% 50%;
      backface-visibility: hidden;
      transition: transform 300ms;
      transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg))) 
                 rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg))) 
                 translateZ(var(--radius));
    }

    @media (max-aspect-ratio: 1/1) {
      .viewer-frame {
        height: auto !important;
        width: 100% !important;
      }
    }

    .item__image {
      position: absolute;
      inset: 10px;
      border-radius: var(--tile-radius, 12px);
      overflow: hidden;
      cursor: grab;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: transform 300ms;
      pointer-events: auto;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    .item__image:active {
        cursor: grabbing;
    }
  `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
            <div
                ref={rootRef}
                className="sphere-root relative w-full h-full"
                style={
                    {
                        ['--segments-x' as any]: segments,
                        ['--segments-y' as any]: segments,
                        ['--overlay-blur-color' as any]: overlayBlurColor,
                        ['--tile-radius' as any]: imageBorderRadius,
                        ['--image-filter' as any]: grayscale ? 'grayscale(1)' : 'none'
                    } as React.CSSProperties
                }
            >
                <main
                    ref={mainRef}
                    className="absolute inset-0 grid place-items-center overflow-hidden select-none bg-transparent"
                    style={{
                        touchAction: 'none',
                        WebkitUserSelect: 'none'
                    }}
                >
                    <div className="stage">
                        <div ref={sphereRef} className="sphere">
                            {items.map((it, i) => (
                                <div
                                    key={`${it.x},${it.y},${i}`}
                                    className="sphere-item absolute m-auto"
                                    data-src={it.src}
                                    data-alt={it.alt}
                                    data-offset-x={it.x}
                                    data-offset-y={it.y}
                                    data-size-x={it.sizeX}
                                    data-size-y={it.sizeY}
                                    style={
                                        {
                                            ['--offset-x' as any]: it.x,
                                            ['--offset-y' as any]: it.y,
                                            ['--item-size-x' as any]: it.sizeX,
                                            ['--item-size-y' as any]: it.sizeY,
                                            top: '-999px',
                                            bottom: '-999px',
                                            left: '-999px',
                                            right: '-999px'
                                        } as React.CSSProperties
                                    }
                                >
                                    <div
                                        className="item__image absolute block overflow-hidden cursor-grab bg-gray-200 transition-transform duration-300"
                                        role="button"
                                        tabIndex={0}
                                        aria-label={it.alt || 'Image'}
                                        style={{
                                            inset: '10px',
                                            borderRadius: `var(--tile-radius, ${imageBorderRadius})`,
                                            backfaceVisibility: 'hidden'
                                        }}
                                    >
                                        <img
                                            src={it.src}
                                            draggable={false}
                                            alt={it.alt}
                                            className="w-full h-full object-cover pointer-events-none"
                                            style={{
                                                backfaceVisibility: 'hidden',
                                                filter: `var(--image-filter, ${grayscale ? 'grayscale(1)' : 'none'})`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="absolute inset-0 m-auto z-[3] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, ${overlayBlurColor}) 100%)`
                        }}
                    />

                    <div
                        className="absolute inset-0 m-auto z-[3] pointer-events-none"
                        style={{
                            WebkitMaskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
                            maskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
                            backdropFilter: 'blur(3px)'
                        }}
                    />

                    <div
                        className="absolute left-0 right-0 top-0 h-[120px] z-[5] pointer-events-none rotate-180"
                        style={{
                            background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`
                        }}
                    />
                    <div
                        className="absolute left-0 right-0 bottom-0 h-[120px] z-[5] pointer-events-none"
                        style={{
                            background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`
                        }}
                    />
                </main>
            </div>
        </>
    );
}
