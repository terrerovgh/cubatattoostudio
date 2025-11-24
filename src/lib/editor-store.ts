import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { EditorState, PageComponent } from '../types/editor';

interface EditorStore extends EditorState {
    // Actions
    setCurrentPage: (page: string) => void;
    setComponents: (components: PageComponent[]) => void;
    selectComponent: (id: string | null) => void;
    updateComponent: (id: string, updates: Partial<PageComponent>) => void;
    addComponent: (component: PageComponent, parentId?: string, index?: number) => void;
    deleteComponent: (id: string) => void;
    moveComponent: (id: string, newParentId: string | null, newIndex: number) => void;
    duplicateComponent: (id: string) => void;
    setViewportMode: (mode: 'mobile' | 'tablet' | 'desktop') => void;
    undo: () => void;
    redo: () => void;
    addToHistory: (action: string) => void;
    markDirty: () => void;
    markClean: () => void;
    setSaving: (saving: boolean) => void;
    reset: () => void;
}

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorStore>()(
    immer((set, get) => ({
        // Initial state
        currentPage: '',
        selectedComponentId: null,
        components: [],
        history: [],
        historyIndex: -1,
        isDirty: false,
        isSaving: false,
        viewportMode: 'desktop',

        // Actions
        setCurrentPage: (page) => set({ currentPage: page }),

        setComponents: (components) => set({ components }),

        selectComponent: (id) => set({ selectedComponentId: id }),

        updateComponent: (id, updates) => set((state) => {
            const updateRecursive = (components: PageComponent[]): boolean => {
                for (const component of components) {
                    if (component.id === id) {
                        Object.assign(component, updates);
                        return true;
                    }
                    if (component.children && updateRecursive(component.children)) {
                        return true;
                    }
                }
                return false;
            };

            updateRecursive(state.components);
            state.isDirty = true;
        }),

        addComponent: (component, parentId, index) => set((state) => {
            if (!parentId) {
                // Add to root
                if (index !== undefined) {
                    state.components.splice(index, 0, component);
                } else {
                    state.components.push(component);
                }
            } else {
                // Add to parent
                const addToParent = (components: PageComponent[]): boolean => {
                    for (const comp of components) {
                        if (comp.id === parentId) {
                            if (!comp.children) comp.children = [];
                            if (index !== undefined) {
                                comp.children.splice(index, 0, component);
                            } else {
                                comp.children.push(component);
                            }
                            return true;
                        }
                        if (comp.children && addToParent(comp.children)) {
                            return true;
                        }
                    }
                    return false;
                };

                addToParent(state.components);
            }
            state.isDirty = true;
        }),

        deleteComponent: (id) => set((state) => {
            const deleteRecursive = (components: PageComponent[]): boolean => {
                const index = components.findIndex(c => c.id === id);
                if (index !== -1) {
                    components.splice(index, 1);
                    return true;
                }
                for (const component of components) {
                    if (component.children && deleteRecursive(component.children)) {
                        return true;
                    }
                }
                return false;
            };

            deleteRecursive(state.components);
            if (state.selectedComponentId === id) {
                state.selectedComponentId = null;
            }
            state.isDirty = true;
        }),

        moveComponent: (id, newParentId, newIndex) => set((state) => {
            // First, find and remove the component
            let movedComponent: PageComponent | null = null;

            const findAndRemove = (components: PageComponent[]): boolean => {
                const index = components.findIndex(c => c.id === id);
                if (index !== -1) {
                    movedComponent = components[index];
                    components.splice(index, 1);
                    return true;
                }
                for (const component of components) {
                    if (component.children && findAndRemove(component.children)) {
                        return true;
                    }
                }
                return false;
            };

            findAndRemove(state.components);

            // Then, add it to the new location
            if (movedComponent) {
                if (!newParentId) {
                    state.components.splice(newIndex, 0, movedComponent);
                } else {
                    const addToParent = (components: PageComponent[]): boolean => {
                        for (const comp of components) {
                            if (comp.id === newParentId) {
                                if (!comp.children) comp.children = [];
                                comp.children.splice(newIndex, 0, movedComponent!);
                                return true;
                            }
                            if (comp.children && addToParent(comp.children)) {
                                return true;
                            }
                        }
                        return false;
                    };

                    addToParent(state.components);
                }
            }
            state.isDirty = true;
        }),

        duplicateComponent: (id) => set((state) => {
            const duplicateRecursive = (component: PageComponent): PageComponent => {
                return {
                    ...component,
                    id: crypto.randomUUID(),
                    children: component.children?.map(duplicateRecursive),
                };
            };

            const findAndDuplicate = (components: PageComponent[], parentComponents: PageComponent[]): boolean => {
                const index = components.findIndex(c => c.id === id);
                if (index !== -1) {
                    const duplicate = duplicateRecursive(components[index]);
                    parentComponents.splice(index + 1, 0, duplicate);
                    return true;
                }
                for (const component of components) {
                    if (component.children && findAndDuplicate(component.children, component.children)) {
                        return true;
                    }
                }
                return false;
            };

            findAndDuplicate(state.components, state.components);
            state.isDirty = true;
        }),

        setViewportMode: (mode) => set({ viewportMode: mode }),

        addToHistory: (action) => set((state) => {
            // Remove any history after current index
            state.history = state.history.slice(0, state.historyIndex + 1);

            // Add new entry
            state.history.push({
                components: JSON.parse(JSON.stringify(state.components)),
                timestamp: Date.now(),
                action,
            });

            // Limit history size
            if (state.history.length > MAX_HISTORY) {
                state.history.shift();
            } else {
                state.historyIndex++;
            }
        }),

        undo: () => set((state) => {
            if (state.historyIndex > 0) {
                state.historyIndex--;
                state.components = JSON.parse(JSON.stringify(state.history[state.historyIndex].components));
                state.isDirty = true;
            }
        }),

        redo: () => set((state) => {
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                state.components = JSON.parse(JSON.stringify(state.history[state.historyIndex].components));
                state.isDirty = true;
            }
        }),

        markDirty: () => set({ isDirty: true }),

        markClean: () => set({ isDirty: false }),

        setSaving: (saving) => set({ isSaving: saving }),

        reset: () => set({
            currentPage: '',
            selectedComponentId: null,
            components: [],
            history: [],
            historyIndex: -1,
            isDirty: false,
            isSaving: false,
            viewportMode: 'desktop',
        }),
    }))
);
