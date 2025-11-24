import React from 'react';
import { useEditorStore } from '../../../lib/editor-store';
import { findComponentById } from '../../../lib/editor-utils';
import { HexColorPicker } from 'react-colorful';

const PropertiesPanel: React.FC = () => {
    const { components, selectedComponentId, updateComponent } = useEditorStore();

    if (!selectedComponentId) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-sm text-zinc-500">Select a component to edit its properties</p>
            </div>
        );
    }

    const component = findComponentById(components, selectedComponentId);

    if (!component) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-sm text-zinc-500">Component not found</p>
            </div>
        );
    }

    const handlePropChange = (key: string, value: any) => {
        updateComponent(component.id, {
            props: {
                ...component.props,
                [key]: value,
            },
        });
    };

    const handleStyleChange = (key: string, value: any) => {
        updateComponent(component.id, {
            styles: {
                ...component.styles,
                [key]: value,
            },
        });
    };

    const renderPropInput = (key: string, value: any) => {
        const isColor = key.toLowerCase().includes('color') || key.toLowerCase().includes('background');
        const isNumber = typeof value === 'number';
        const isBoolean = typeof value === 'boolean';
        const isLongText = key.toLowerCase().includes('description') || key.toLowerCase().includes('bio');

        if (isBoolean) {
            return (
                <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handlePropChange(key, e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                    </label>
                </div>
            );
        }

        if (isColor) {
            return (
                <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="space-y-2">
                        <HexColorPicker color={value || '#ffffff'} onChange={(color) => handlePropChange(key, color)} />
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => handlePropChange(key, e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                            placeholder="#ffffff"
                        />
                    </div>
                </div>
            );
        }

        if (isLongText) {
            return (
                <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <textarea
                        value={value || ''}
                        onChange={(e) => handlePropChange(key, e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                    />
                </div>
            );
        }

        if (isNumber) {
            return (
                <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handlePropChange(key, parseFloat(e.target.value))}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                    />
                </div>
            );
        }

        return (
            <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handlePropChange(key, e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                />
            </div>
        );
    };

    const propKeys = Object.keys(component.props || {});
    const styleKeys = Object.keys(component.styles || {});

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-white capitalize">{component.type} Properties</h3>
                <p className="text-xs text-zinc-500 mt-1">ID: {component.id.slice(0, 8)}...</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Props Section */}
                {propKeys.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Content</h4>
                        {propKeys.map((key) => renderPropInput(key, component.props[key]))}
                    </div>
                )}

                {/* Add New Property */}
                <div className="border-t border-zinc-800 pt-4">
                    <button
                        onClick={() => {
                            const propName = prompt('Property name:');
                            if (propName) {
                                handlePropChange(propName, '');
                            }
                        }}
                        className="w-full text-sm text-zinc-400 hover:text-white py-2 border border-dashed border-zinc-800 rounded-lg hover:border-zinc-600"
                    >
                        + Add Property
                    </button>
                </div>

                {/* Styles Section */}
                <div className="border-t border-zinc-800 pt-4 space-y-4">
                    <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Styles</h4>

                    {/* Common style inputs */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Padding</label>
                            <input
                                type="text"
                                value={component.styles?.padding || ''}
                                onChange={(e) => handleStyleChange('padding', e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                placeholder="e.g., 20px or 1rem"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Margin</label>
                            <input
                                type="text"
                                value={component.styles?.margin || ''}
                                onChange={(e) => handleStyleChange('margin', e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                placeholder="e.g., 10px or 0.5rem"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Background</label>
                            <input
                                type="text"
                                value={component.styles?.background || ''}
                                onChange={(e) => handleStyleChange('background', e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                placeholder="e.g., #171717"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-400">Border Radius</label>
                            <input
                                type="text"
                                value={component.styles?.borderRadius || ''}
                                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                placeholder="e.g., 8px"
                            />
                        </div>
                    </div>

                    {styleKeys.length > 0 && (
                        <div className="space-y-4">
                            {styleKeys.filter(k => !['padding', 'margin', 'background', 'borderRadius'].includes(k)).map((key) => (
                                <div key={key} className="space-y-2">
                                    <label className="block text-sm font-medium text-zinc-400 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    <input
                                        type="text"
                                        value={component.styles?.[key] || ''}
                                        onChange={(e) => handleStyleChange(key, e.target.value)}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Animation Section */}
                <div className="border-t border-zinc-800 pt-4">
                    <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4">Animation</h4>
                    <p className="text-xs text-zinc-500">Animation configuration coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default PropertiesPanel;
