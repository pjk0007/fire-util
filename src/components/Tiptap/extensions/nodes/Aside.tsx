import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { NodeViewContent, NodeViewProps } from '@tiptap/react';
import React, { useState } from 'react';
import {
    Info,
    AlertTriangle,
    AlertCircle,
    Lightbulb,
    Flame,
    PencilLine,
} from 'lucide-react';
import Colors from '@/components/Tiptap/config/colors';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        aside: {
            setAside: (attributes?: { type?: string }) => ReturnType;
            toggleAside: (attributes?: { type?: string }) => ReturnType;
            unsetAside: () => ReturnType;
        };
    }
}

// Map color names to Colors array indices
const COLOR_MAP = {
    gray: 0,
    brown: 1,
    orange: 2,
    yellow: 3,
    green: 4,
    blue: 5,
    purple: 6,
    pink: 7,
    red: 8,
} as const;

// Callout types with corresponding icons and colors from colors.ts
const CALLOUT_TYPES = {
    default: {
        icon: PencilLine,
        color: {
            label: 'default',
            color: 'var(--foreground)',
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
        },
    },
    info: {
        icon: Info,
        color: Colors[COLOR_MAP.gray],
    },
    warning: {
        icon: AlertTriangle,
        color: Colors[COLOR_MAP.yellow],
    },
    danger: {
        icon: AlertCircle,
        color: Colors[COLOR_MAP.red],
    },
    success: {
        icon: Lightbulb,
        color: Colors[COLOR_MAP.green],
    },
    tip: {
        icon: Flame,
        color: Colors[COLOR_MAP.purple],
    },
} as const;

type CalloutType = keyof typeof CALLOUT_TYPES;

function AsideNodeView({ node, updateAttributes, editor }: NodeViewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const calloutType = (node.attrs.type as CalloutType) || 'info';
    const config = CALLOUT_TYPES[calloutType];
    const Icon = config.icon;

    const handleTypeChange = (newType: CalloutType) => {
        updateAttributes({ type: newType });
        setIsOpen(false);
    };

    return (
        <NodeViewWrapper className="relative my-4 group">
            <div
                className="relative p-4 rounded-lg border"
                style={{
                    backgroundColor: config.color.backgroundColor,
                    borderColor: config.color.borderColor,
                }}
            >
                {/* Icon Selector - only visible when editable */}
                {editor.isEditable && (
                    <div className="absolute top-2 right-2 z-10">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                            contentEditable={false}
                        >
                            <Icon
                                className="w-5 h-5"
                                style={{ color: config.color.color }}
                            />
                        </button>

                        {/* Type selector dropdown */}
                        {isOpen && (
                            <div
                                className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[160px]"
                                contentEditable={false}
                            >
                                {(
                                    Object.keys(CALLOUT_TYPES) as CalloutType[]
                                ).map((type) => {
                                    const typeConfig = CALLOUT_TYPES[type];
                                    const TypeIcon = typeConfig.icon;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() =>
                                                handleTypeChange(type)
                                            }
                                            className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                                                type === calloutType
                                                    ? 'bg-gray-100 dark:bg-gray-700'
                                                    : ''
                                            }`}
                                        >
                                            <TypeIcon
                                                className="w-4 h-4"
                                                style={{
                                                    color: typeConfig.color
                                                        .color,
                                                }}
                                            />
                                            <span className="capitalize text-sm">
                                                {type}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <NodeViewContent className="outline-none [&>*]:my-0 [&>p]:leading-relaxed" />
            </div>

            {/* Click outside to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsOpen(false)}
                    contentEditable={false}
                />
            )}
        </NodeViewWrapper>
    );
}

export const AsideExtension = Node.create({
    name: 'aside',

    group: 'block',

    content: 'block+',

    defining: true,

    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: (element) =>
                    element.getAttribute('data-type') || 'info',
                renderHTML: (attributes) => {
                    return {
                        'data-type': attributes.type,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'aside[data-type]',
            },
            {
                tag: 'aside',
                getAttrs: () => ({ type: 'info' }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'aside',
            mergeAttributes(HTMLAttributes, {
                class: 'callout-block',
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(AsideNodeView);
    },

    addCommands() {
        return {
            setAside:
                (attributes?: { type?: string }) =>
                ({ commands }: { commands: any }) => {
                    return commands.wrapIn(this.name, attributes);
                },
            toggleAside:
                (attributes?: { type?: string }) =>
                ({ commands }: { commands: any }) => {
                    return commands.toggleWrap(this.name, attributes);
                },
            unsetAside:
                () =>
                ({ commands }: { commands: any }) => {
                    return commands.lift(this.name);
                },
        };
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Shift-c': () =>
                this.editor.chain().focus().toggleAside({ type: 'info' }).run(),
        };
    },
});

export default AsideExtension;
