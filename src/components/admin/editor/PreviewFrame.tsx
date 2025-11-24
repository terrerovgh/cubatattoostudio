import React, { useEffect, useRef, useState } from 'react';
import type { PageComponent } from '../../../types/editor';

interface PreviewFrameProps {
    components: PageComponent[];
    selectedId: string | null;
    viewportMode: 'mobile' | 'tablet' | 'desktop';
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ components, selectedId, viewportMode }) => {
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const viewportSizes = {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1440, height: 900 },
    };

    const currentViewport = viewportSizes[viewportMode];

    // Calculate scale to fit viewport in container
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;

                const scaleX = (containerWidth - 40) / currentViewport.width;
                const scaleY = (containerHeight - 40) / currentViewport.height;

                setScale(Math.min(scaleX, scaleY, 1));
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [viewportMode, currentViewport]);

    const renderComponent = (component: PageComponent): React.ReactNode => {
        const isSelected = component.id === selectedId;
        const commonStyles: React.CSSProperties = {
            ...component.styles,
            outline: isSelected ? '2px solid white' : 'none',
            outlineOffset: isSelected ? '2px' : '0',
            position: 'relative',
        };

        switch (component.type) {
            case 'text':
                return (
                    <div key={component.id} style={commonStyles}>
                        <p style={{ fontSize: component.props.fontSize, color: component.props.color }}>
                            {component.props.text || 'Text'}
                        </p>
                    </div>
                );

            case 'heading':
                const HeadingTag = `h${component.props.level || 1}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                return (
                    <div key={component.id} style={commonStyles}>
                        <HeadingTag style={{ fontSize: component.props.fontSize, color: component.props.color }}>
                            {component.props.text || 'Heading'}
                        </HeadingTag>
                    </div>
                );

            case 'image':
                return (
                    <div key={component.id} style={commonStyles}>
                        {component.props.src ? (
                            <img
                                src={component.props.src}
                                alt={component.props.alt || ''}
                                style={{
                                    width: component.props.width || '100%',
                                    height: component.props.height || 'auto',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: component.props.width || '100%',
                                    height: component.props.height || '200px',
                                    background: '#262626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#71717a',
                                }}
                            >
                                Image Placeholder
                            </div>
                        )}
                    </div>
                );

            case 'video':
                return (
                    <div key={component.id} style={commonStyles}>
                        {component.props.src ? (
                            <video
                                src={component.props.src}
                                controls={component.props.controls !== false}
                                autoPlay={component.props.autoplay === true}
                                loop={component.props.loop === true}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    background: '#262626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#71717a',
                                }}
                            >
                                Video Placeholder
                            </div>
                        )}
                    </div>
                );

            case 'button':
                return (
                    <div key={component.id} style={commonStyles}>
                        <button
                            style={{
                                padding: '12px 24px',
                                background: component.props.variant === 'secondary' ? 'transparent' : '#ffffff',
                                color: component.props.variant === 'secondary' ? '#ffffff' : '#000000',
                                border: component.props.variant === 'secondary' ? '1px solid #ffffff' : 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            {component.props.text || 'Button'}
                        </button>
                    </div>
                );

            case 'container':
            case 'card':
                return (
                    <div
                        key={component.id}
                        style={{
                            ...commonStyles,
                            padding: component.props.padding || '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: component.props.gap || '16px',
                        }}
                    >
                        {component.children?.map((child) => renderComponent(child))}
                    </div>
                );

            case 'grid':
                return (
                    <div
                        key={component.id}
                        style={{
                            ...commonStyles,
                            display: 'grid',
                            gridTemplateColumns: `repeat(${component.props.columns || 3}, 1fr)`,
                            gap: component.props.gap || '20px',
                        }}
                    >
                        {component.children?.map((child) => renderComponent(child))}
                    </div>
                );

            case 'flex':
                return (
                    <div
                        key={component.id}
                        style={{
                            ...commonStyles,
                            display: 'flex',
                            flexDirection: component.props.direction || 'row',
                            gap: component.props.gap || '16px',
                            alignItems: component.props.align || 'center',
                            justifyContent: component.props.justify || 'flex-start',
                        }}
                    >
                        {component.children?.map((child) => renderComponent(child))}
                    </div>
                );

            case 'hero':
                return (
                    <div
                        key={component.id}
                        style={{
                            ...commonStyles,
                            height: component.props.height || '500px',
                            background: component.props.background || '#0a0a0a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {component.children?.map((child) => renderComponent(child))}
                    </div>
                );

            case 'gallery':
                return (
                    <div
                        key={component.id}
                        style={{
                            ...commonStyles,
                            display: 'grid',
                            gridTemplateColumns: `repeat(${component.props.columns || 3}, 1fr)`,
                            gap: component.props.gap || '16px',
                        }}
                    >
                        {component.children?.map((child) => renderComponent(child))}
                    </div>
                );

            default:
                return (
                    <div key={component.id} style={commonStyles}>
                        <div style={{ padding: '20px', background: '#171717', borderRadius: '8px' }}>
                            {component.type} Component
                        </div>
                    </div>
                );
        }
    };

    return (
        <div ref={containerRef} className="h-full w-full flex items-center justify-center p-4 bg-zinc-950">
            <div
                style={{
                    width: currentViewport.width,
                    height: currentViewport.height,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                    backgroundColor: '#0a0a0a',
                    overflow: 'auto',
                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
                className="relative"
            >
                {components.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-500">No components to preview</p>
                    </div>
                ) : (
                    <div className="p-4">
                        {components.map((component) => renderComponent(component))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewFrame;
