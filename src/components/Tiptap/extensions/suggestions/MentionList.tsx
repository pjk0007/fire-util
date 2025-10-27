import React, { useEffect, useImperativeHandle, useState } from 'react';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';

export default function MentionList(props: {
    items: string[];
    command: ({ id }: { id: string }) => void;
    ref: React.Ref<any>;
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];

        if (item) {
            props.command({ id: item });
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

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    const hoverHandler = (index: number) => {
        setSelectedIndex(index);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(props.ref, () => ({
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

    return (
        <Command className="border shadow-lg bg-popover rounded-md w-60">
            <CommandList className='max-h-96'>
                <CommandEmpty className="text-muted-foreground text-center py-2 text-sm">
                    {TIP_TAP_LOCALE.NO_RESULTS_FOUND}
                </CommandEmpty>
                {props.items.length > 0 && (
                    <CommandGroup>
                        {props.items.map((item, index) => (
                            <CommandItem
                                key={item}
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
                                {item}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </Command>
    );
}
