import Colors from '@/components/Tiptap/config/colors';
import useDropdownPosition from '@/components/Tiptap/hooks/useDropdownPosition';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandGroup,
    CommandList,
} from '@/components/ui/command';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Editor, useEditorState } from '@tiptap/react';
import { ChevronDown } from 'lucide-react';

export default function SelectionMenuColor({ editor }: { editor: Editor }) {
    const { color, backgroundColor } = useEditorState({
        editor,
        selector: (ctx) => ({
            color: ctx.editor.getAttributes('textStyle').color,
            backgroundColor: ctx.editor.getAttributes('highlight').color,
        }),
    });

    console.log(color, backgroundColor);

    const { open, setOpen, position, buttonRef, commandRef } =
        useDropdownPosition();

    editor.on('selectionUpdate', () => {
        setOpen(false);
    });
    return (
        <div className="relative">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        ref={buttonRef}
                        variant={'ghost'}
                        className={cn('h-8 text-md')}
                        onClick={() => setOpen(!open)}
                    >
                        <div
                            className="border w-6 h-6 rounded-sm flex items-center justify-center"
                            style={{
                                color: color || 'inherit',
                                backgroundColor: backgroundColor || 'inherit',
                                borderColor: Colors.find(
                                    (c) => c.backgroundColor === backgroundColor
                                )?.borderColor,
                            }}
                        >
                            A
                        </div>
                        <ChevronDown className="w-3 h-3" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{TIP_TAP_LOCALE.COLOR.TITLE}</TooltipContent>
            </Tooltip>

            {open && (
                <Command
                    ref={commandRef}
                    className="fixed z-50 w-52 border max-h-80 h-fit rounded-md bg-background shadow-lg"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    }}
                >
                    <CommandList>
                        <CommandGroup
                            heading={`${TIP_TAP_LOCALE.COLOR.TEXT} ${TIP_TAP_LOCALE.COLOR.COLOR}`}
                        >
                            <div className="grid grid-cols-5 gap-2 px-2 py-1">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div
                                            className={cn(
                                                'border border-foreground font-medium hover:border-2 h-7 w-7 flex justify-center items-center rounded-sm cursor-pointer',
                                                {
                                                    'border-2': !color,
                                                }
                                            )}
                                            onClick={() => {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .unsetColor()
                                                    .run();
                                            }}
                                        >
                                            A
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {TIP_TAP_LOCALE.COLOR.DEFAULT}{' '}
                                        {TIP_TAP_LOCALE.COLOR.TEXT}
                                    </TooltipContent>
                                </Tooltip>

                                {Colors.map((c) => (
                                    <Tooltip key={c.label}>
                                        <TooltipTrigger>
                                            <div
                                                key={c.label}
                                                className={cn(
                                                    'border font-medium hover:border-2 h-7 w-7 flex justify-center items-center rounded-sm cursor-pointer',
                                                    {
                                                        'border-2':
                                                            color === c.color,
                                                    }
                                                )}
                                                onClick={() => {
                                                    editor
                                                        .chain()
                                                        .focus()
                                                        .setColor(c.color)
                                                        .run();
                                                }}
                                                style={{
                                                    borderColor: c.borderColor,
                                                    color: c.color,
                                                    backgroundColor:
                                                        'transparent',
                                                }}
                                            >
                                                A
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {c.label}{' '}
                                            {TIP_TAP_LOCALE.COLOR.TEXT}
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </CommandGroup>
                        <CommandGroup
                            heading={`${TIP_TAP_LOCALE.COLOR.BACKGROUND} ${TIP_TAP_LOCALE.COLOR.COLOR}`}
                        >
                            <div className="grid grid-cols-5 gap-2 px-2 py-1">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div
                                            className={cn(
                                                'border border-foreground font-medium hover:border-2 h-7 w-7 flex justify-center items-center rounded-sm cursor-pointer',
                                                {
                                                    'border-2':
                                                        !backgroundColor,
                                                }
                                            )}
                                            onClick={() => {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .unsetHighlight()
                                                    .run();
                                            }}
                                        ></div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {TIP_TAP_LOCALE.COLOR.DEFAULT}{' '}
                                        {TIP_TAP_LOCALE.COLOR.BACKGROUND}
                                    </TooltipContent>
                                </Tooltip>
                                {Colors.map((c) => (
                                    <Tooltip key={c.label}>
                                        <TooltipTrigger>
                                            <div
                                                key={c.label}
                                                className={cn(
                                                    'border font-medium hover:border-2 h-7 w-7 flex justify-center items-center rounded-sm cursor-pointer',
                                                    {
                                                        'border-2':
                                                            backgroundColor ===
                                                            c.backgroundColor,
                                                    }
                                                )}
                                                onClick={() => {
                                                    editor
                                                        .chain()
                                                        .focus()
                                                        .setHighlight({
                                                            color: c.backgroundColor,
                                                        })
                                                        .run();
                                                }}
                                                style={{
                                                    borderColor: c.borderColor,
                                                    backgroundColor:
                                                        c.backgroundColor,
                                                }}
                                            ></div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {c.label}{' '}
                                            {TIP_TAP_LOCALE.COLOR.BACKGROUND}
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                        </CommandGroup>
                    </CommandList>
                </Command>
            )}
        </div>
    );
}
