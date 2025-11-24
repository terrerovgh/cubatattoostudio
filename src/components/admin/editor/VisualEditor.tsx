import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Save, Undo, Redo, Monitor, Tablet, Smartphone, Eye, Loader2 } from 'lucide-react';
import { useEditorStore } from '../../../lib/editor-store';
import { getSiteContent, updateSiteContent } from '../../../lib/supabase-helpers';
import type { PageComponent } from '../../../types/editor';
import ComponentTree from './ComponentTree';
import PropertiesPanel from './PropertiesPanel';
import PreviewFrame from './PreviewFrame';

interface VisualEditorProps {
    pageId: string;
    section: string;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ pageId, section }) => {
    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(true);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        components,
        selectedComponentId,
        isDirty,
        isSaving,
        viewportMode,
        historyIndex,
        history,
        setCurrentPage,
        setComponents,
        setViewportMode,
        undo,
        redo,
        markClean,
        setSaving,
        addToHistory,
    } = useEditorStore();

    // Load content on mount
    useEffect(() => {
        loadContent();
    }, [section]);

    // Auto-save when dirty
    useEffect(() => {
        if (isDirty && !isSaving) {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }

            autoSaveTimerRef.current = setTimeout(() => {
                handleSave(true);
            }, 3000); // Auto-save after 3 seconds of inactivity
        }

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [isDirty, isSaving]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyboard = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [undo, redo]);

    const loadContent = async () => {
        setLoading(true);
        try {
            const data = await getSiteContent(section);
            if (data && data.content) {
                const loadedComponents = data.content.components || [];
                setComponents(loadedComponents);
                setCurrentPage(section);
                addToHistory('Initial load');
            } else {
                setComponents([]);
                setCurrentPage(section);
                addToHistory('Initial load');
            }
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = useCallback(async (isAutoSave = false) => {
        setSaving(true);
        try {
            await updateSiteContent(section, {
                components,
                version: 1,
                updatedAt: new Date().toISOString(),
            });

            markClean();

            if (!isAutoSave) {
                // Show success toast (would be better with a toast library)
                console.log('Saved successfully');
            }
        } catch (error) {
            console.error('Error saving content:', error);
        } finally {
            setSaving(false);
        }
    }, [components, section, setSaving, markClean]);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-zinc-950">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-6 py-3">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold text-white">
                        {section.charAt(0).toUpperCase() + section.slice(1)} Editor
                    </h1>
                    {isDirty && !isSaving && (
                        <span className="text-sm text-zinc-500">• Unsaved changes</span>
                    )}
                    {isSaving && (
                        <span className="flex items-center gap-2 text-sm text-zinc-500">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Saving...
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Viewport Toggle */}
                    <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
                        <button
                            onClick={() => setViewportMode('desktop')}
                            className={`rounded p-2 ${viewportMode === 'desktop'
                                    ? 'bg-zinc-800 text-white'
                                    : 'text-zinc-500 hover:text-white'
                                }`}
                            title="Desktop view"
                        >
                            <Monitor className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewportMode('tablet')}
                            className={`rounded p-2 ${viewportMode === 'tablet'
                                    ? 'bg-zinc-800 text-white'
                                    : 'text-zinc-500 hover:text-white'
                                }`}
                            title="Tablet view"
                        >
                            <Tablet className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewportMode('mobile')}
                            className={`rounded p-2 ${viewportMode === 'mobile'
                                    ? 'bg-zinc-800 text-white'
                                    : 'text-zinc-500 hover:text-white'
                                }`}
                            title="Mobile view"
                        >
                            <Smartphone className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Preview Toggle */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-400 hover:text-white"
                        title="Toggle preview"
                    >
                        <Eye className="h-4 w-4" />
                    </button>

                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
                        <button
                            onClick={undo}
                            disabled={!canUndo}
                            className="rounded p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                            title="Undo (Cmd+Z)"
                        >
                            <Undo className="h-4 w-4" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={!canRedo}
                            className="rounded p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                            title="Redo (Cmd+Y)"
                        >
                            <Redo className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving || !isDirty}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Component Tree */}
                <div className="w-64 border-r border-zinc-800 bg-zinc-900 overflow-y-auto">
                    <ComponentTree />
                </div>

                {/* Center - Preview */}
                {showPreview && (
                    <div className="flex-1 overflow-hidden bg-zinc-950">
                        <PreviewFrame
                            components={components}
                            selectedId={selectedComponentId}
                            viewportMode={viewportMode}
                        />
                    </div>
                )}

                {/* Right Panel - Properties */}
                <div className="w-80 border-l border-zinc-800 bg-zinc-900 overflow-y-auto">
                    <PropertiesPanel />
                </div>
            </div>
        </div>
    );
};

export default VisualEditor;
