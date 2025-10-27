import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import { Button } from '@/components/ui/button';
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
import { Editor } from '@tiptap/react';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';

const textAlignOptions = [
    { label: <AlignLeft />, align: 'left', title: TIP_TAP_LOCALE.ALIGN.LEFT },
    {
        label: <AlignCenter />,
        align: 'center',
        title: TIP_TAP_LOCALE.ALIGN.CENTER,
    },
    {
        label: <AlignRight />,
        align: 'right',
        title: TIP_TAP_LOCALE.ALIGN.RIGHT,
    },
    {
        label: <AlignJustify />,
        align: 'justify',
        title: TIP_TAP_LOCALE.ALIGN.JUSTIFY,
    },
];

export default function SelectionMenuAlign({ editor }: { editor: Editor }) {
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
                        <TooltipContent>{option.title}</TooltipContent>
                    </Tooltip>
                ))}
            </PopoverContent>
        </Popover>
    );
}
