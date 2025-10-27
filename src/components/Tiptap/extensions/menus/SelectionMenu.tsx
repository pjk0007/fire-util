import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import SelectionMenuColor from '@/components/Tiptap/extensions/menus/SelectionMenuColor';
import SelectionMenuNode from '@/components/Tiptap/extensions/menus/SelectionMenuNode';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import useOs from '@/hooks/use-os';
import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
    Bold,
    CodeXml,
    Italic,
    Strikethrough,
    Subscript,
    Superscript,
    Underline,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import SelectionMenuAlign from '@/components/Tiptap/extensions/menus/SelectionMenuAlign';
import SelectionMenuLink from '@/components/Tiptap/extensions/menus/SelectionMenuLink';

function MarkTypes(
    editor: Editor,
    mark: {
        isBold: boolean;
        isItalic: boolean;
        isStrikethrough: boolean;
        isUnderline: boolean;
        isCode: boolean;
        isSubscript: boolean;
        isSuperscript: boolean;
    }
) {
    return [
        {
            label: TIP_TAP_LOCALE.MARK.bold,
            type: 'bold',
            icon: <Bold />,
            onSelect: () => {
                editor.chain().focus().toggleBold().run();
            },
            isActive: mark.isBold,
            className: 'font-bold',
            shortcut: {
                macos: '⌘B',
                windows: 'Ctrl+B',
            },
        },
        {
            label: TIP_TAP_LOCALE.MARK.italic,
            type: 'italic',
            icon: <Italic />,
            onSelect: () => {
                editor.chain().focus().toggleItalic().run();
            },
            isActive: mark.isItalic,
            className: 'italic',
            shortcut: {
                macos: '⌘I',
                windows: 'Ctrl+I',
            },
        },
        {
            label: TIP_TAP_LOCALE.MARK.underline,
            type: 'underline',
            icon: <Underline />,
            onSelect: () => {
                editor.chain().focus().toggleUnderline().run();
            },
            isActive: mark.isUnderline,
            className: 'underline',
            shortcut: {
                macos: '⌘U',
                windows: 'Ctrl+U',
            },
        },
        {
            label: TIP_TAP_LOCALE.MARK.strike,
            type: 'strike',
            icon: <Strikethrough />,
            onSelect: () => {
                editor.chain().focus().toggleStrike().run();
            },
            isActive: mark.isStrikethrough,
            className: 'line-through',
            shortcut: {
                macos: '⌘⇧S',
                windows: 'Ctrl+Shift+S',
            },
        },
        {
            label: TIP_TAP_LOCALE.MARK.code,
            type: 'code',
            icon: <CodeXml />,
            onSelect: () => {
                editor.chain().focus().toggleCode().run();
            },
            isActive: mark.isCode,
            shortcut: {
                macos: '⌘E',
                windows: 'Ctrl+E',
            },
        },
        {
            label: TIP_TAP_LOCALE.MARK.subscript,
            type: 'subscript',
            icon: <Subscript />,
            onSelect: () => {
                editor.chain().focus().toggleSubscript().run();
            },
            isActive: mark.isSubscript,
            shortcut: {
                macos: '⌘,',
                windows: 'Ctrl+,',
            },
        },
        {
            label: TIP_TAP_LOCALE.MARK.superscript,
            type: 'superscript',
            icon: <Superscript />,
            onSelect: () => {
                editor.chain().focus().toggleSuperscript().run();
            },
            isActive: mark.isSuperscript,
            shortcut: {
                macos: '⌘.',
                windows: 'Ctrl+.',
            },
        },
    ];
}

export default function SelectionMenu({ editor }: { editor: Editor }) {
    const os = useOs();
    const mark = useEditorState({
        editor,
        selector: (ctx) => ({
            isBold: ctx.editor.isActive('bold'),
            isItalic: ctx.editor.isActive('italic'),
            isUnderline: ctx.editor.isActive('underline'),
            isStrikethrough: ctx.editor.isActive('strike'),
            isCode: ctx.editor.isActive('code'),
            isSubscript: ctx.editor.isActive('subscript'),
            isSuperscript: ctx.editor.isActive('superscript'),
        }),
    });

    return (
        <BubbleMenu
            editor={editor}
            className="bg-background border rounded-lg px-1 py-0.5 flex shadow-xl"
        >
            <SelectionMenuNode editor={editor} />
            <div className="h-6 my-auto">
                <Separator orientation="vertical" className="mx-1" />
            </div>

            {MarkTypes(editor, mark).map((mark) => (
                <Tooltip key={mark.type}>
                    <TooltipTrigger asChild>
                        <Button
                            variant={'ghost'}
                            onClick={mark.onSelect}
                            className={cn(
                                'w-8 h-8 p-0 text-xs',
                                mark.className,
                                {
                                    'text-primary bg-accent': mark.isActive,
                                }
                            )}
                        >
                            {mark.icon}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {mark.label}{' '}
                        {os === 'macos' ? (
                            <Kbd>{mark.shortcut.macos}</Kbd>
                        ) : (
                            <Kbd>{mark.shortcut.windows}</Kbd>
                        )}
                    </TooltipContent>
                </Tooltip>
            ))}

            <div className="h-6 my-auto">
                <Separator orientation="vertical" className="mx-1" />
            </div>
            <SelectionMenuLink editor={editor} />
            <SelectionMenuColor editor={editor} />
            <div className="h-6 my-auto">
                <Separator orientation="vertical" className="mx-1" />
            </div>
            <SelectionMenuAlign editor={editor} />
        </BubbleMenu>
    );
}
