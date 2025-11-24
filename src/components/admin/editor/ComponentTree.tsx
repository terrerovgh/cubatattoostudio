import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { useEditorStore } from '../../../lib/editor-store';
import { getComponentDisplayName, canHaveChildren, getDefaultProps, generateComponentId } from '../../../lib/editor-utils';
import type { PageComponent, ComponentType } from '../../../types/editor';

const COMPONENT_ICONS: Record<ComponentType, string> = {
    container: '📦',
    text: '📝',
    heading: '📰',
    image: '🖼️',
    video: '🎥',
    button: '🔘',
    gallery: '🌆',
    hero: '🦸',
    card: '🃏',
    grid: '⬜',
    flex: '🔲',
};

const ComponentTree: React.FC = () => {
    const {
        components,
        selectedComponentId,
        selectComponent,
        addComponent,
        deleteComponent,
        duplicateComponent,
    } = useEditorStore();

    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(components.map(c => c.id)));
    const [showAddMenu, setShowAddMenu] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const handleAddComponent = (type: ComponentType, parentId?: string) => {
        const newComponent: PageComponent = {
            id: generateComponentId(),
            type,
            props: getDefaultProps(type),
            children: canHaveChildren(type) ? [] : undefined,
        };

        addComponent(newComponent, parentId);
        setShowAddMenu(null);
    };

    const renderComponent = (component: PageComponent, depth = 0) => {
        const isExpanded = expandedIds.has(component.id);
        const isSelected = selectedComponentId === component.id;
        const hasChildren = component.children && component.children.length > 0;
        const canAddChildren = canHaveChildren(component.type);

        return (
            <div key={component.id}>
                <div
                    className={`group flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-zinc-800/50 ${isSelected ? 'bg-zinc-800 border-l-2 border-white' : ''
                        }`}
                    style={{ paddingLeft: `${depth * 16 + 8}px` }}
                    onClick={() => selectComponent(component.id)}
                >
                    {hasChildren || canAddChildren ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(component.id);
                            }}
                            className="flex items-center justify-center w-4 h-4 text-zinc-500 hover:text-white"
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                            ) : (
                                <ChevronRight className="h-3 w-3" />
                            )}
                        </button>
                    ) : (
                        <div className="w-4" />
                    )}

                    <span className="text-sm">{COMPONENT_ICONS[component.type]}</span>

                    <span className="flex-1 text-sm text-zinc-300 truncate">
                        {getComponentDisplayName(component)}
                    </span>

                    {/* Actions (visible on hover) */}
                    <div className="hidden group-hover:flex items-center gap-1">
                        {canAddChildren && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAddMenu(component.id);
                                }}
                                className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white"
                                title="Add child"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                duplicateComponent(component.id);
                            }}
                            className="p-1 rounded hover:bg-zinc-700 text-zinc-400 hover:text-white"
                            title="Duplicate"
                        >
                            <Copy className="h-3 w-3" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this component?')) {
                                    deleteComponent(component.id);
                                }
                            }}
                            className="p-1 rounded hover:bg-red-600 text-zinc-400 hover:text-white"
                            title="Delete"
                        >
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* Children */}
                {isExpanded && component.children && (
                    <div>
                        {component.children.map((child) => renderComponent(child, depth + 1))}
                    </div>
                )}

                {/* Add Component Menu */}
                {showAddMenu === component.id && (
                    <div className="absolute mt-1 ml-8 w-48 rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-lg z-10">
                        <div className="text-xs font-medium text-zinc-400 mb-2">Add Component</div>
                        <div className="grid grid-cols-2 gap-1">
                            {Object.keys(COMPONENT_ICONS).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleAddComponent(type as ComponentType, component.id)}
                                    className="flex items-center gap-2 p-2 rounded text-left text-sm hover:bg-zinc-800 text-zinc-300"
                                >
                                    <span>{COMPONENT_ICONS[type as ComponentType]}</span>
                                    <span className="capitalize">{type}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowAddMenu(null)}
                            className="mt-2 w-full text-xs text-zinc-500 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-white">Components</h3>
                <button
                    onClick={() => setShowAddMenu('root')}
                    className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    title="Add root component"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 relative">
                {components.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <p className="text-sm text-zinc-500 mb-4">No components yet</p>
                        <button
                            onClick={() => setShowAddMenu('root')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-sm text-white hover:bg-zinc-700"
                        >
                            <Plus className="h-4 w-4" />
                            Add Component
                        </button>
                    </div>
                ) : (
                    components.map((component) => renderComponent(component))
                )}

                {/* Root Add Menu */}
                {showAddMenu === 'root' && (
                    <div className="absolute top-4 left-4 w-48 rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-lg z-10">
                        <div className="text-xs font-medium text-zinc-400 mb-2">Add Component</div>
                        <div className="grid grid-cols-2 gap-1">
                            {Object.keys(COMPONENT_ICONS).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleAddComponent(type as ComponentType)}
                                    className="flex items-center gap-2 p-2 rounded text-left text-sm hover:bg-zinc-800 text-zinc-300"
                                >
                                    <span>{COMPONENT_ICONS[type as ComponentType]}</span>
                                    <span className="capitalize text-xs">{type}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowAddMenu(null)}
                            className="mt-2 w-full text-xs text-zinc-500 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentTree;
