import { Button } from '@/components/ui/button';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandShortcut,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import {
    ChevronDown,
    Code,
    CodeXml,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    ListTodo,
    Quote,
    Type,
} from 'lucide-react';
import { Editor, useEditorState } from '@tiptap/react';
import useDropdownPosition from '@/components/Tiptap/hooks/useDropdownPosition';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import Nodes from '@/components/Tiptap/config/nodes';
import useOs from '@/hooks/use-os';

function getNodeLabel(
    isBulletList: boolean,
    isOrderedList: boolean,
    isTaskList: boolean,
    isCodeBlock: boolean,
    isBlockquote: boolean,
    nodeType: string,
    nodeLevel: number
) {
    if (isBulletList) return TIP_TAP_LOCALE.NODE_LABEL.BULLET_LIST;
    if (isOrderedList) return TIP_TAP_LOCALE.NODE_LABEL.ORDERED_LIST;
    if (isTaskList) return TIP_TAP_LOCALE.NODE_LABEL.TASK_LIST;
    if (isCodeBlock) return TIP_TAP_LOCALE.NODE_LABEL.CODE_BLOCK;
    if (isBlockquote) return TIP_TAP_LOCALE.NODE_LABEL.BLOCKQUOTE;
    if (nodeType === 'heading') {
        if (nodeLevel === 1) return TIP_TAP_LOCALE.NODE_LABEL.HEADING1;
        if (nodeLevel === 2) return TIP_TAP_LOCALE.NODE_LABEL.HEADING2;
        if (nodeLevel === 3) return TIP_TAP_LOCALE.NODE_LABEL.HEADING3;
    }
    return TIP_TAP_LOCALE.NODE_LABEL.PARAGRAPH;
}

export default function SelectionMenuNode({ editor }: { editor: Editor }) {
    const os = useOs();
    const {
        isBulletList,
        isOrderedList,
        isTaskList,
        isCodeBlock,
        isBlockquote,
        nodeType,
        nodeLevel,
    } = useEditorState({
        editor,
        selector: (ctx) => ({
            isBulletList: ctx.editor.isActive('bulletList'),
            isOrderedList: ctx.editor.isActive('orderedList'),
            isTaskList: ctx.editor.isActive('taskList'),
            isCodeBlock: ctx.editor.isActive('codeBlock'),
            isBlockquote: ctx.editor.isActive('blockquote'),
            nodeType: ctx.editor.state.selection.$head.parent.type.name,
            nodeLevel: ctx.editor.state.selection.$head.parent.attrs.level,
        }),
    });
    const { open, setOpen, position, buttonRef, commandRef } =
        useDropdownPosition();

    editor.on('selectionUpdate', () => {
        setOpen(false);
    });

    return (
        <div className={cn('relative')}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        ref={buttonRef}
                        variant={'ghost'}
                        className={cn('h-8 px-2 text-xs')}
                        onClick={() => setOpen(!open)}
                    >
                        {getNodeLabel(
                            isBulletList,
                            isOrderedList,
                            isTaskList,
                            isCodeBlock,
                            isBlockquote,
                            nodeType,
                            nodeLevel
                        )}
                        <ChevronDown className="w-3 h-3" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{TIP_TAP_LOCALE.CONVERSION}</TooltipContent>
            </Tooltip>

            {open && (
                <Command
                    ref={commandRef}
                    className="fixed z-50 w-60 border max-h-80 h-fit rounded-md bg-background shadow-lg"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    }}
                >
                    <CommandList className="max-h-96">
                        <CommandGroup heading={TIP_TAP_LOCALE.CONVERSION}>
                            {Nodes.filter((n) => !n.onlyCommand).map((node) => (
                                <CommandItem
                                    key={node.label}
                                    className={cn(
                                        'text-xs font-[500] flex items-center gap-2'
                                    )}
                                    onSelect={() => {
                                        node.onSelect(editor);
                                        setOpen(false);
                                    }}
                                >
                                    {node.icon}
                                    {node.label}
                                    {os && node.shortcut && (
                                        <CommandShortcut>
                                            {node.shortcut[os]}
                                        </CommandShortcut>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            )}

            {/* 클릭 외부 영역 감지용 오버레이 */}
            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    );
}
