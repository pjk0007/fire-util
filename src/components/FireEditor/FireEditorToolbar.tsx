import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import useSelectionToolbar from '@/lib/FireEditor/hooks/useSelectionToolbar';
import { FireDoc } from '@/lib/FireEditor/settings';
import { Link } from 'lucide-react';
import React from 'react';

type Props = {
    editableRef: React.RefObject<HTMLElement | null>;
    docState?: FireDoc;
};

export default function FireEditorToolbar({ editableRef, docState }: Props) {
    const { selectionRect, isSelecting } = useSelectionToolbar(
        editableRef,
        docState
    );

    // if (!selectionRect) return null;
    if (!isSelecting || !selectionRect) return null;

    const style: React.CSSProperties = {
        top: selectionRect.top + window.scrollY,
        left: selectionRect.left + window.scrollX,
        transform: 'translateX(-25%) translateY(-220%)',
    };

    return (
        <div
            style={style}
            role="toolbar"
            // aria-hidden={!isSelecting}
            className="absolute bg-background p-1 rounded-lg shadow-md flex z-50 border"
        >
            <Button
                size={'icon-sm'}
                variant={'ghost'}
                onMouseDown={(e) => {
                    e.preventDefault();
                    document.execCommand('bold');
                }}
                className="font-bold"
            >
                B
            </Button>
            <Button
                size={'icon-sm'}
                variant={'ghost'}
                onMouseDown={(e) => {
                    e.preventDefault();
                    document.execCommand('italic');
                }}
                className="italic"
            >
                I
            </Button>
            <Button
                size={'icon-sm'}
                variant={'ghost'}
                onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('underline');
                }}
                className="underline"
            >
                U
            </Button>
            <Popover>
                <PopoverTrigger>
                    <Button
                        size={'icon-sm'}
                        variant={'ghost'}
                        onClick={(e) => {
                            e.preventDefault();
                            console.log('link');
                        }}
                    >
                        <Link />
                    </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="start">
                    <input type="url" placeholder="Enter link URL" />
                </PopoverContent>
            </Popover>
        </div>
    );
}
