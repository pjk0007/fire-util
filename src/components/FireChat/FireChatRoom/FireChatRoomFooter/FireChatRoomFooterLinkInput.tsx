import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
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
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import sendMessage from '@/lib/FireChat/api/sendMessage';
import {
    FIRE_CHAT_LOCALE,
    FireMessage,
    FireMessageText,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_TEXT,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { ArrowUp, Link } from 'lucide-react';
import { useState } from 'react';

export default function FireChatRoomFooterLinkInput() {
    const isMobile = useIsMobile();
    const { user } = useFireAuth();
    const { selectedChannelId } = useFireChannel();
    const [link, setLink] = useState('');

    if (isMobile) return null;

    return (
        <Tooltip>
            <TooltipTrigger>
                <Popover
                    onOpenChange={(open) => {
                        if (!open) setLink('');
                    }}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant={'ghost'}
                            className={cn('rounded-lg')}
                            size={'icon'}
                            asChild
                        >
                            <Label className="cursor-pointer">
                                <Link className="text-foreground" />
                            </Label>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2 flex flex-col gap-1" asChild>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const trimmedLink = link.trim();
                                if (!trimmedLink) return;

                                if (selectedChannelId && user) {
                                    const message: FireMessage<FireMessageText> =
                                        {
                                            [MESSAGE_ID_FIELD]: `message-${Date.now()}`,
                                            [MESSAGE_USER_ID_FIELD]:
                                                user[USER_ID_FIELD],
                                            [MESSAGE_TYPE_FIELD]:
                                                MESSAGE_TYPE_TEXT,
                                            [MESSAGE_CONTENTS_FIELD]: [
                                                {
                                                    [MESSAGE_CONTENT_TEXT_FIELD]: `<a href="${trimmedLink}" target="_blank" style="color: blue; text-decoration: underline;">${trimmedLink}</a>`,
                                                    [MESSAGE_TYPE_FIELD]:
                                                        MESSAGE_TYPE_TEXT,
                                                },
                                            ],
                                            [MESSAGE_CREATED_AT_FIELD]:
                                                Timestamp.now(),
                                        };
                                    sendMessage(selectedChannelId, message);
                                }
                                setLink('');
                            }}
                        >
                            <div className="text-sm pl-2">
                                {FIRE_CHAT_LOCALE.FOOTER.ATTATCH_LINK}
                            </div>
                            <InputGroup>
                                <InputGroupInput
                                    name="link"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        type="submit"
                                        disabled={!link || link.trim() === ''}
                                    >
                                        <ArrowUp />
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </form>
                    </PopoverContent>
                </Popover>
            </TooltipTrigger>
            <TooltipContent>
                {FIRE_CHAT_LOCALE.FOOTER.ATTATCH_LINK}
            </TooltipContent>
        </Tooltip>
    );
}
