import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
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
import { FIRE_CHAT_LOCALE } from '@/components/FireChat/settings';
import { cn } from '@/lib/utils';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';

export default function FireChatRoomFooterTemplate({
    setMessage,
    disabled = false,
}: {
    setMessage: (message: string) => void;
    disabled?: boolean;
}) {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    if (isMobile) return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild disabled={disabled}>
                        <Button
                            variant={'ghost'}
                            className={cn('rounded-lg')}
                            size={'icon'}
                            disabled={disabled}
                        >
                            <PencilLine className="text-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="right" className="w-fit p-0 border-none">
                        <ButtonGroup className="w-fit">
                            <Button
                                variant="outline"
                                className="text-sm font-medium py-2 px-3"
                                onClick={() => {
                                    setMessage(
                                        FIRE_CHAT_LOCALE.FOOTER
                                            .TEMPLATE_CONTENT.START(Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(new Date()))
                                    );
                                    setIsOpen(false);
                                }}
                            >
                                {
                                    FIRE_CHAT_LOCALE.FOOTER
                                        .TEMPLATE_LIST.START
                                }
                            </Button>
                            <Button
                                variant="outline"
                                className="text-sm font-medium py-2 px-3"
                                onClick={() => {
                                    setMessage(
                                        FIRE_CHAT_LOCALE.FOOTER
                                            .TEMPLATE_CONTENT.IN_PROGRESS(Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(new Date()))
                                    );
                                    setIsOpen(false);
                                }}
                            >
                                {
                                    FIRE_CHAT_LOCALE.FOOTER
                                        .TEMPLATE_LIST.IN_PROGRESS
                                }
                            </Button>
                            <Button
                                variant="outline"
                                className="text-sm font-medium py-2 px-3"
                                onClick={() => {
                                    setMessage(
                                        FIRE_CHAT_LOCALE.FOOTER
                                            .TEMPLATE_CONTENT.END(Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' }).format(new Date()))
                                    );
                                    setIsOpen(false);
                                }}
                            >
                                {
                                    FIRE_CHAT_LOCALE.FOOTER
                                        .TEMPLATE_LIST.END
                                }
                            </Button>
                        </ButtonGroup>
                    </PopoverContent>
                </Popover>
            </TooltipTrigger>
            <TooltipContent>
                {FIRE_CHAT_LOCALE.FOOTER.TEMPLATE}
            </TooltipContent>
        </Tooltip>
    );
}
