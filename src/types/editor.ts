// Type definitions for the visual content editor

export interface PageComponent {
    id: string;
    type: ComponentType;
    props: Record<string, any>;
    children?: PageComponent[];
    styles?: Record<string, any>;
    animationIds?: string[];
}

export type ComponentType =
    | 'container'
    | 'text'
    | 'heading'
    | 'image'
    | 'video'
    | 'button'
    | 'gallery'
    | 'hero'
    | 'card'
    | 'grid'
    | 'flex';

export interface Animation {
    id: string;
    name: string;
    type: 'gsap' | 'framer' | 'css';
    properties: AnimationProperties;
    triggerType?: 'scroll' | 'viewport' | 'click' | 'load' | 'hover';
    triggerConfig?: TriggerConfig;
    targetSelector?: string;
    isActive: boolean;
}

export interface AnimationProperties {
    duration?: number;
    delay?: number;
    easing?: string;
    from?: Record<string, any>;
    to?: Record<string, any>;
    stagger?: number;
    repeat?: number;
    yoyo?: boolean;
}

export interface TriggerConfig {
    start?: string;
    end?: string;
    scrub?: boolean;
    pin?: boolean;
    threshold?: number;
}

export interface PageContent {
    section: string;
    content: Record<string, any>;
    components: PageComponent[];
    layoutConfig: LayoutConfig;
    metadata: PageMetadata;
    version: number;
}

export interface LayoutConfig {
    maxWidth?: string;
    padding?: string;
    gap?: string;
    columns?: number;
    responsive?: ResponsiveConfig;
}

export interface ResponsiveConfig {
    mobile?: Partial<LayoutConfig>;
    tablet?: Partial<LayoutConfig>;
    desktop?: Partial<LayoutConfig>;
}

export interface PageMetadata {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
}

export interface EditorState {
    currentPage: string;
    selectedComponentId: string | null;
    components: PageComponent[];
    history: HistoryEntry[];
    historyIndex: number;
    isDirty: boolean;
    isSaving: boolean;
    viewportMode: 'mobile' | 'tablet' | 'desktop';
}

export interface HistoryEntry {
    components: PageComponent[];
    timestamp: number;
    action: string;
}

export interface ComponentProperty {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'color' | 'select' | 'image' | 'video' | 'toggle' | 'slider';
    value: any;
    options?: Array<{ label: string; value: any }>;
    min?: number;
    max?: number;
    step?: number;
}

export interface ArtistExtended {
    id: string;
    name: string;
    slug: string;
    specialty: string;
    bio?: string;
    bioRichText?: any; // TipTap JSON
    avatarUrl?: string;
    portfolioUrl?: string;
    instagram?: string;
    personalGallery: GalleryImage[];
    portfolioConfig: PortfolioConfig;
    socialLinks: SocialLinks;
    themeSettings: ThemeSettings;
    displayOrder: number;
    isActive: boolean;
}

export interface GalleryImage {
    id: string;
    url: string;
    caption?: string;
    order: number;
    metadata?: ImageMetadata;
}

export interface ImageMetadata {
    width?: number;
    height?: number;
    alt?: string;
    credit?: string;
}

export interface PortfolioConfig {
    layout?: 'grid' | 'masonry' | 'carousel';
    columns?: number;
    showBio?: boolean;
    showGallery?: boolean;
    showFeaturedWorks?: boolean;
    customSections?: CustomSection[];
}

export interface CustomSection {
    id: string;
    title: string;
    content: string;
    order: number;
}

export interface SocialLinks {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    twitter?: string;
    portfolio?: string;
    other?: Record<string, string>;
}

export interface ThemeSettings {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    spacing?: 'compact' | 'normal' | 'relaxed';
}

export interface WorkExtended {
    id: string;
    title?: string;
    description?: string;
    imageUrl: string;
    videoUrl?: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    artists: WorkArtist[];
    serviceId?: string;
    tags: string[];
    featured: boolean;
    published: boolean;
    metadata: WorkMetadata;
    animationConfig?: Animation;
    displayConfig: DisplayConfig;
}

export interface WorkArtist {
    artistId: string;
    artistName: string;
    artistSlug: string;
    role: 'primary' | 'collaboration' | 'guest';
}

export interface WorkMetadata {
    sessionDuration?: string;
    bodyPlacement?: string;
    styleTags?: string[];
    colorPalette?: string[];
    size?: 'small' | 'medium' | 'large';
    dateCompleted?: string;
    location?: string;
}

export interface DisplayConfig {
    showTitle?: boolean;
    showDescription?: boolean;
    showArtists?: boolean;
    layout?: 'standard' | 'featured' | 'minimal';
    aspectRatio?: string;
}
