import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Editor } from '@tiptap/react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';

const textAlignOptions = [
    {
        label: <AlignLeft />,
        align: 'left',
        title: TIP_TAP_LOCALE.ALIGN.LEFT,
        shortcut: {
            macos: '⌘⇧L',
            windows: 'Ctrl+Shift+L',
        },
    },
    {
        label: <AlignCenter />,
        align: 'center',
        title: TIP_TAP_LOCALE.ALIGN.CENTER,
        shortcut: {
            macos: '⌘⇧E',
            windows: 'Ctrl+Shift+E',
        },
    },
    {
        label: <AlignRight />,
        align: 'right',
        title: TIP_TAP_LOCALE.ALIGN.RIGHT,
        shortcut: {
            macos: '⌘⇧R',
            windows: 'Ctrl+Shift+R',
        },
    },
    {
        label: <AlignJustify />,
        align: 'justify',
        title: TIP_TAP_LOCALE.ALIGN.JUSTIFY,
        shortcut: {
            macos: '⌘⇧J',
            windows: 'Ctrl+Shift+J',
        },
    },
];

export default function SelectionMenuAlign({ editor }: { editor: Editor }) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="flex">
                {textAlignOptions.map((option) => (
                    <Tooltip key={option.align}>
                        <TooltipTrigger asChild>
                            <Button
                                key={option.align}
                                variant="ghost"
                                className="w-8 h-8 p-0 text-xs"
                                onClick={() => {
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign(option.align)
                                        .run();
                                }}
                            >
                                {option.label}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {option.title} <Kbd>{option.shortcut.macos}</Kbd>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        );
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            asChild
                            variant="ghost"
                            className="w-8 h-8 text-xs ml-1 p-2"
                        >
                            <AlignCenter />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        {TIP_TAP_LOCALE.ALIGN.TITLE}
                    </TooltipContent>
                </Tooltip>
            </PopoverTrigger>

            <PopoverContent className="flex p-1 w-fit">
                {textAlignOptions.map((option) => (
                    <Tooltip key={option.align}>
                        <TooltipTrigger asChild>
                            <Button
                                key={option.align}
                                variant="ghost"
                                className="w-8 h-8 p-0 text-xs"
                                onClick={() => {
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign(option.align)
                                        .run();
                                }}
                            >
                                {option.label}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {option.title} <Kbd>{option.shortcut.macos}</Kbd>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </PopoverContent>
        </Popover>
    );
}
