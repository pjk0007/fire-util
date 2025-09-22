import { useFireChatChannel } from '@/components/provider/FireChatChannelProvider';
import FireChatMessage from '@/components/FireChat/FireChatMessage/FireChatMessage';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import FireChatSending from '@/components/FireChat/FireChatMessage/FireChatSending';
import { useAuth } from '@/components/provider/AuthProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CHANNEL_ID_FIELD,
    FcMessage,
    FcMessageSystem,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { formatDateString } from '@/lib/FireChat/utils/timeformat';
import { ArrowDown } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
import useListMessages from '@/lib/FireChat/hooks/useListMessages';
import useScroll from '@/lib/FireChat/hooks/useScroll';

export default function FireChatChannelRoomBody() {
    const { user: me } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const {
        scrollAreaRef,
        isBottom,
        scrollToBottom,
        isTop,
        getScrollState,
        restoreScrollState,
        isScrolling,
        scrollDate,
    } = useScroll();
    const { channel, participants, sendingFiles, setReplyingMessage } =
        useFireChatChannel();

    const { messages, hasMore, loadMoreMessages } = useListMessages({
        channelId: channel?.[CHANNEL_ID_FIELD],
    });

    useEffect(() => {
        if (hasMore && isTop && !isLoading) {
            const scrollState = getScrollState();
            setIsLoading(true);
            loadMoreMessages()
                .then(() => {
                    setTimeout(() => {
                        restoreScrollState(scrollState);
                    }, 1);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [hasMore, isTop]);

    // 새로운 메시지가 도착했을 때 스크롤을 맨 아래로 내림
    useEffect(() => {
        if (isBottom) {
            scrollToBottom(false);
        }
    }, [messages, sendingFiles]);

    if (!channel) {
        return null;
    }

    return (
        <div className="flex-1 overflow-hidden relative bg-white">
            {isLoading && (
                <div className="absolute w-full h-full z-10 bg-white flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            )}
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="flex flex-col max-w-full gap-2 py-6 px-3 md:px-5 box-border">
                    {messages.map((msg, index) => {
                        const beforeDate =
                            index > 0
                                ? messages[index - 1]?.[
                                      MESSAGE_CREATED_AT_FIELD
                                  ]
                                : null;
                        const currentDate = msg?.[MESSAGE_CREATED_AT_FIELD];
                        if (
                            beforeDate &&
                            currentDate &&
                            beforeDate.toDate().toDateString() !==
                                currentDate.toDate().toDateString()
                        ) {
                            return (
                                <Fragment key={msg[MESSAGE_ID_FIELD]}>
                                    <FireChatMessageSystem
                                        message={
                                            {
                                                [MESSAGE_ID_FIELD]: `date-separator-${msg[MESSAGE_ID_FIELD]}`,
                                                [MESSAGE_CREATED_AT_FIELD]:
                                                    currentDate,
                                                [MESSAGE_TYPE_FIELD]:
                                                    MESSAGE_TYPE_SYSTEM,
                                                [MESSAGE_USER_ID_FIELD]:
                                                    'system',
                                                [MESSAGE_CONTENTS_FIELD]: [
                                                    {
                                                        [MESSAGE_CONTENT_TEXT_FIELD]:
                                                            formatDateString(
                                                                currentDate
                                                            ),
                                                        [MESSAGE_TYPE_FIELD]:
                                                            MESSAGE_TYPE_SYSTEM,
                                                    },
                                                ],
                                            } as FcMessage<FcMessageSystem>
                                        }
                                    />
                                    <FireChatMessage
                                        key={index}
                                        message={msg}
                                        participants={participants || []}
                                        me={me}
                                        setReplyingMessage={setReplyingMessage}
                                    />
                                </Fragment>
                            );
                        }
                        return (
                            <FireChatMessage
                                key={index}
                                message={msg}
                                beforeMessage={
                                    index > 0 ? messages[index - 1] : undefined
                                }
                                participants={participants || []}
                                me={me}
                                setReplyingMessage={setReplyingMessage}
                            />
                        );
                    })}
                    {sendingFiles
                        .filter(
                            (sf) => sf.channelId === channel?.[CHANNEL_ID_FIELD]
                        )
                        .map((sf, idx) => (
                            <FireChatSending
                                key={`sending-${idx}`}
                                sendingFile={sf}
                            />
                        ))}
                </div>
                {!isBottom && isScrolling && (
                    <Button
                        variant={'outline'}
                        className="w-10 h-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full opacity-50"
                        onClick={() => scrollToBottom(true)}
                    >
                        <ArrowDown />
                    </Button>
                )}
                <div
                    className={
                        `text-xs absolute top-8 left-1/2 transform -translate-x-1/2 rounded-[12px] bg-foreground/60 px-[12px] py-[8px] text-white transition-all duration-300 pointer-events-none` +
                        (scrollDate && isScrolling
                            ? ' opacity-100 scale-100'
                            : ' opacity-0 scale-95')
                    }
                    style={{ zIndex: 30 }}
                >
                    {scrollDate}
                </div>
            </ScrollArea>
        </div>
    );
}
