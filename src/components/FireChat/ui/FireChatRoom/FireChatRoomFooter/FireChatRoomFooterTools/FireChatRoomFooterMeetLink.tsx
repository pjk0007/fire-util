import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { FIRE_CHAT_LOCALE } from '@/components/FireChat/settings';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';
import Link from 'next/link';

export default function FireChatRoomFooterMeetLink({
    disabled = false,
}: {
    disabled?: boolean;
}) {
    const isMobile = useIsMobile();
    if (isMobile) return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={'ghost'}
                    className={cn('rounded-lg')}
                    size={'icon'}
                    disabled={disabled}
                    asChild
                >
                    <Link
                        href={'https://meet.google.com/'}
                        target="_blank"
                        className={cn("cursor-pointer", disabled && "pointer-events-none opacity-50")}
                    >
                        <Video className="text-foreground" />
                    </Link>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {FIRE_CHAT_LOCALE.FOOTER.MEET_LINK}
            </TooltipContent>
        </Tooltip>
    );
}
