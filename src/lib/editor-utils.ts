import type { PageComponent } from '../types/editor';

/**
 * Generate a unique ID for components
 */
export function generateComponentId(): string {
    return crypto.randomUUID();
}

/**
 * Find a component by ID in the component tree
 */
export function findComponentById(
    components: PageComponent[],
    id: string
): PageComponent | null {
    for (const component of components) {
        if (component.id === id) {
            return component;
        }
        if (component.children) {
            const found = findComponentById(component.children, id);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Find the parent of a component
 */
export function findParentComponent(
    components: PageComponent[],
    childId: string,
    parent: PageComponent | null = null
): PageComponent | null {
    for (const component of components) {
        if (component.id === childId) {
            return parent;
        }
        if (component.children) {
            const found = findParentComponent(component.children, childId, component);
            if (found !== null) return found;
        }
    }
    return null;
}

/**
 * Get the path to a component (for breadcrumbs)
 */
export function getComponentPath(
    components: PageComponent[],
    id: string,
    path: PageComponent[] = []
): PageComponent[] {
    for (const component of components) {
        if (component.id === id) {
            return [...path, component];
        }
        if (component.children) {
            const found = getComponentPath(component.children, id, [...path, component]);
            if (found.length > 0) return found;
        }
    }
    return [];
}

/**
 * Serialize components to JSON string
 */
export function serializeComponents(components: PageComponent[]): string {
    return JSON.stringify(components, null, 2);
}

/**
 * Deserialize components from JSON string
 */
export function deserializeComponents(json: string): PageComponent[] {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.error('Failed to deserialize components:', error);
        return [];
    }
}

/**
 * Validate component structure
 */
export function validateComponent(component: PageComponent): boolean {
    if (!component.id || !component.type) {
        return false;
    }
    if (component.children) {
        return component.children.every(validateComponent);
    }
    return true;
}

/**
 * Sanitize HTML content
 */
export function sanitizeContent(content: string): string {
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
}

/**
 * Deep clone a component
 */
export function cloneComponent(component: PageComponent): PageComponent {
    return {
        ...component,
        id: generateComponentId(),
        children: component.children?.map(cloneComponent),
    };
}

/**
 * Get component display name
 */
export function getComponentDisplayName(component: PageComponent): string {
    if (component.props?.name) {
        return component.props.name as string;
    }
    if (component.props?.text && typeof component.props.text === 'string') {
        const text = component.props.text;
        return text.length > 30 ? text.slice(0, 30) + '...' : text;
    }
    return component.type.charAt(0).toUpperCase() + component.type.slice(1);
}

/**
 * Count total components in tree
 */
export function countComponents(components: PageComponent[]): number {
    return components.reduce((count, component) => {
        return count + 1 + (component.children ? countComponents(component.children) : 0);
    }, 0);
}

/**
 * Flatten component tree to array
 */
export function flattenComponents(components: PageComponent[]): PageComponent[] {
    const flattened: PageComponent[] = [];

    const flatten = (comps: PageComponent[]) => {
        for (const comp of comps) {
            flattened.push(comp);
            if (comp.children) {
                flatten(comp.children);
            }
        }
    };

    flatten(components);
    return flattened;
}

/**
 * Check if a component can accept children
 */
export function canHaveChildren(type: string): boolean {
    const containerTypes = ['container', 'grid', 'flex', 'card', 'hero', 'gallery'];
    return containerTypes.includes(type);
}

/**
 * Get default props for a component type
 */
export function getDefaultProps(type: string): Record<string, any> {
    const defaults: Record<string, Record<string, any>> = {
        text: { text: 'Edit this text', fontSize: '16px', color: '#ffffff' },
        heading: { text: 'Heading', level: 1, fontSize: '32px', color: '#ffffff' },
        image: { src: '', alt: '', width: '100%', height: 'auto' },
        video: { src: '', controls: true, autoplay: false, loop: false },
        button: { text: 'Button', href: '#', variant: 'primary' },
        container: { padding: '20px', gap: '16px' },
        grid: { columns: 3, gap: '20px' },
        flex: { direction: 'row', gap: '16px', align: 'center' },
        card: { padding: '24px', background: '#171717', borderRadius: '12px' },
        hero: { height: '500px', background: '#0a0a0a' },
        gallery: { columns: 3, gap: '16px' },
    };

    return defaults[type] || {};
}
