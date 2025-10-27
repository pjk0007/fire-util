import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupButton } from '@/components/ui/input-group';
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
import { Link } from 'lucide-react';

export default function SelectionMenuLink({ editor }: { editor: Editor }) {
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
                            <Link />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{TIP_TAP_LOCALE.LINK.TITLE}</TooltipContent>
                </Tooltip>
            </PopoverTrigger>

            <PopoverContent className="flex p-1 w-fit">
                <Input
                className='bg-accent focus-visible:ring-0 w-80'
                    placeholder="https://example.com"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const url = (e.target as HTMLInputElement).value;
                            editor
                                .chain()
                                .focus()
                                .extendMarkRange('link')
                                .setLink({ href: url })
                                .run();
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
