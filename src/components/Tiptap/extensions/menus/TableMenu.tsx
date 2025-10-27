import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Editor } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/react/menus';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    BetweenHorizontalStart,
    BetweenVerticalStart,
    Sheet,
    TableCellsMerge,
    TableCellsSplit,
} from 'lucide-react';

const tableMenuOptions = [
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.ADD_COLUMN_BEFORE,
        action: (editor: Editor) => {
            editor.chain().focus().addColumnBefore().run();
        },

        icon: <ArrowLeft />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.ADD_COLUMN_AFTER,
        action: (editor: Editor) => {
            editor.chain().focus().addColumnAfter().run();
        },

        icon: <ArrowRight />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.DELETE_COLUMN,
        action: (editor: Editor) => {
            editor.chain().focus().deleteColumn().run();
        },

        icon: <BetweenVerticalStart />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.ADD_ROW_BEFORE,
        action: (editor: Editor) => {
            editor.chain().focus().addRowBefore().run();
        },

        icon: <ArrowUp />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.ADD_ROW_AFTER,
        action: (editor: Editor) => {
            editor.chain().focus().addRowAfter().run();
        },

        icon: <ArrowDown />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.DELETE_ROW,
        action: (editor: Editor) => {
            editor.chain().focus().deleteRow().run();
        },

        icon: <BetweenHorizontalStart />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.MERGE_CELLS,
        action: (editor: Editor) => {
            editor.chain().focus().mergeCells().run();
        },

        icon: <TableCellsMerge />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.SPLIT_CELL,
        action: (editor: Editor) => {
            editor.chain().focus().splitCell().run();
        },

        icon: <TableCellsSplit />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.TOGGLE_HEADER_ROW,
        action: (editor: Editor) => {
            editor.chain().focus().toggleHeaderRow().run();
        },
        icon: <Sheet />,
    },
    {
        label: TIP_TAP_LOCALE.TABLE_MENU.TOGGLE_HEADER_COLUMN,
        action: (editor: Editor) => {
            editor.chain().focus().toggleHeaderColumn().run();
        },
        icon: <Sheet className="-rotate-90" />,
    },
];

export default function TableMenu({ editor }: { editor: Editor }) {
    return (
        <FloatingMenu
            editor={editor}
            pluginKey={'tableMenu'}
            shouldShow={() => {
                return editor.isActive('table');
            }}
            options={{
                strategy: 'absolute',
                placement: 'bottom',
                offset: 16,
            }}
            className="bg-background shadow flex border rounded-lg p-1"
        >
            {tableMenuOptions.map((option) => (
                <Tooltip key={option.label}>
                    <TooltipTrigger asChild>
                        <Button
                            key={option.label}
                            variant={'ghost'}
                            onClick={() => {
                                option.action(editor);
                            }}
                        >
                            {option.icon}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{option.label}</TooltipContent>
                </Tooltip>
            ))}
        </FloatingMenu>
    );
}
