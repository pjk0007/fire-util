import { Editor, useEditorState } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import type { ImageAlignment } from '../nodes/ImageWithAlign';

const imageAlignOptions: {
    icon: React.ReactNode;
    align: ImageAlignment;
    title: string;
}[] = [
    {
        icon: <AlignLeft className="h-4 w-4" />,
        align: 'left',
        title: TIP_TAP_LOCALE.ALIGN.LEFT,
    },
    {
        icon: <AlignCenter className="h-4 w-4" />,
        align: 'center',
        title: TIP_TAP_LOCALE.ALIGN.CENTER,
    },
    {
        icon: <AlignRight className="h-4 w-4" />,
        align: 'right',
        title: TIP_TAP_LOCALE.ALIGN.RIGHT,
    },
];

export default function ImageMenu({ editor }: { editor: Editor }) {
    const currentAlign = useEditorState({
        editor,
        selector: (ctx) => {
            const attrs = ctx.editor.getAttributes('image');
            return (attrs.textAlign as ImageAlignment) || 'center';
        },
    });

    const handleAlign = (align: ImageAlignment) => {
        editor.chain().focus().updateAttributes('image', { textAlign: align }).run();
    };

    return (
        <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => editor.isActive('image')}
            options={{ placement: 'top' }}
            className="bg-background border rounded-lg px-1 py-0.5 flex shadow-xl"
        >
            {imageAlignOptions.map((option) => (
                <Tooltip key={option.align}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn('w-8 h-8 p-0', {
                                'text-primary bg-accent': currentAlign === option.align,
                            })}
                            onClick={() => handleAlign(option.align)}
                        >
                            {option.icon}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{option.title}</TooltipContent>
                </Tooltip>
            ))}
        </BubbleMenu>
    );
}
