import { useFireChatChannel } from '@/components/FireProvider/FireChatChannelProvider';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
} from '@/lib/FireChat/settings';
import { FcUser } from '@/lib/FireAuth/settings';
import { ArrowDown } from 'lucide-react';
import { useEffect } from 'react';
import useListMessages from '@/lib/FireChat/hooks/useListMessages';
import useScroll from '@/lib/FireChat/hooks/useScroll';
import {
    getScrollState,
    restoreScrollPosition,
    scrollToBottom,
} from '@/lib/FireChat/utils/scroll';
import FireChatChannelRoomBodyMessageList from '@/components/FireChat/FireChatChannelRoom/FireChatChannelRoomBody/FireChatChannelRoomBodyMessageList';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';

export default function FireChatChannelRoomBody<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>() {
    const { user: me } = useFireAuth();

    const { selectedChannelId } = useFireChannel();
    const { channel, participants } = useFireChannelInfo<C, M, T, U>({
        channelId: selectedChannelId,
    });

    const { scrollAreaRef, isScrolling, scrollDate, isTop, isBottom } =
        useScroll();
    const ref =
        scrollAreaRef?.current?.querySelector(
            '[data-slot="scroll-area-viewport"]'
        ) ?? null;

    const { sendingFiles, setReplyingMessage } = useFireChatChannel();

    const {
        beforeMessages,
        messages,
        // newMessages,
        hasMore,
        loadBeforeMessages,
        isLoading,
    } = useListMessages({
        channelId: channel?.[CHANNEL_ID_FIELD],
    });

    useEffect(() => {
        if (isLoading) return;
        if (hasMore && isTop) {
            const scrollState = getScrollState(ref);
            loadBeforeMessages().then(() => {
                setTimeout(() => {
                    restoreScrollPosition(
                        ref,
                        scrollState.scrollHeight,
                        scrollState.scrollTop
                    );
                }, 1);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, isTop]);

    // 새로운 메시지가 도착했을 때 스크롤을 맨 아래로 내림
    useEffect(() => {
        if (isBottom) {
            setTimeout(() => {
                scrollToBottom(ref, false);
            }, 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, sendingFiles]);

    if (!channel) {
        return null;
    }

    return (
        <div className="flex-1 overflow-hidden relative bg-muted/40">
            {/* {isLoading && (
                <div className="absolute w-full h-full z-10 bg-white flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            )} */}
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="flex flex-col max-w-full gap-2 py-6 px-3 md:px-5 box-border">
                    <FireChatChannelRoomBodyMessageList
                        beforeMessages={beforeMessages}
                        messages={messages}
                        // newMessages={newMessages}
                        participants={participants}
                        me={me}
                        setReplyingMessage={setReplyingMessage}
                        channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                        sendingFiles={sendingFiles}
                    />
                </div>
                {!isBottom && isScrolling && (
                    <Button
                        variant={'outline'}
                        className="w-10 h-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full opacity-50"
                        onClick={() => scrollToBottom(ref, true)}
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
