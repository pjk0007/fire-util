import { Editor } from '@tiptap/react';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { INodeItem } from '@/components/Tiptap/config/nodes';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandShortcut,
} from '@/components/ui/command';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';

interface NodeListRef {
    onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

interface NodeListProps {
    items: INodeItem[];
    ref: React.Ref<NodeListRef>;
    editor: Editor;
    range: { from: number; to: number };
}

export default function NodeList(props: NodeListProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.editor.chain().focus().deleteRange(props.range).run();
            item.onSelect(props.editor);
        }
    };

    const upHandler = () => {
        setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
        );
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const hoverHandler = (index: number) => {
        setSelectedIndex(index);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(props.ref, (): NodeListRef => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    const basicItems = props.items.filter((item) => item.group === 'basic');
    const mediaItems = props.items.filter((item) => item.group === 'media');

    return (
        <Command className="border shadow-lg bg-popover rounded-md w-60">
            <CommandList className="max-h-[360px]">
                <CommandEmpty className="text-muted-foreground text-center py-2 text-sm">
                    {TIP_TAP_LOCALE.NO_RESULTS_FOUND}
                </CommandEmpty>
                {basicItems.length > 0 && (
                    <CommandGroup heading={TIP_TAP_LOCALE.CONVERSION}>
                        {basicItems.map((node, index) => (
                            <CommandItem
                                key={node.label}
                                className="text-xs font-[500] flex items-center gap-2"
                                onSelect={() => selectItem(index)}
                                onMouseEnter={() => hoverHandler(index)}
                                style={{
                                    backgroundColor:
                                        index === selectedIndex
                                            ? 'var(--color-accent)'
                                            : 'transparent',
                                }}
                            >
                                {node.icon}
                                {node.label}
                                {node.prefix && (
                                    <CommandShortcut>
                                        {node.prefix}
                                    </CommandShortcut>
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
                {mediaItems.length > 0 && (
                    <CommandGroup heading={TIP_TAP_LOCALE.MEDIA}>
                        {mediaItems.map((node, index) => (
                            <CommandItem
                                key={node.label}
                                className="text-xs font-[500] flex items-center gap-2"
                                onSelect={() =>
                                    selectItem(index + basicItems.length)
                                }
                                onMouseEnter={() =>
                                    hoverHandler(index + basicItems.length)
                                }
                                style={{
                                    backgroundColor:
                                        index + basicItems.length ===
                                        selectedIndex
                                            ? 'var(--color-accent)'
                                            : 'transparent',
                                }}
                            >
                                {node.icon}
                                {node.label}
                                {node.prefix && (
                                    <CommandShortcut>
                                        {node.prefix}
                                    </CommandShortcut>
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </Command>
    );
}
