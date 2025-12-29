import { useFireChat } from "@/components/FireProvider/FireChatProvider";
import { useFireAuth } from "@/components/FireProvider/FireAuthProvider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_FIELD,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_USER_ID_FIELD,
    MESSAGE_ID_FIELD,
    FIRE_CHAT_LOCALE,
    NOTIFICATION_TITLE,
} from "@/lib/FireChat/settings";
import { FireChannel } from "@/lib/FireChannel/settings";
import { CHANNEL_ID_FIELD, CHANNEL_PARTICIPANTS_FIELD, CHANNEL_LAST_SEEN_FIELD } from "@/lib/FireChannel/settings";
import { FireUser, USER_ID_FIELD } from "@/lib/FireAuth/settings";
import { ArrowDown } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import useListMessages from "@/lib/FireChat/hooks/useListMessages";
import useScroll from "@/lib/FireChat/hooks/useScroll";
import usePushNotification from "@/lib/FireChat/hooks/usePushNotification";
import useUserSetting from "@/lib/FireAuth/hooks/useUserSetting";
import { getScrollState, restoreScrollPosition, scrollToBottom } from "@/lib/FireChat/utils/scroll";
import FireChatRoomBodyMessageList from "@/components/FireChat/FireChatRoom/FireChatRoomBody/FireChatRoomBodyMessageList";
import { useFireChannel } from "@/components/FireProvider/FireChannelProvider";
import useFireChannelInfo from "@/lib/FireChannel/hook/useFireChannelInfo";
import useMessageUnreadCount from "@/lib/FireChat/hooks/useMessageUnreadCount";

export default function FireChatRoomBody<
    C extends FireChannel<M, T>,
    U extends FireUser,
    M extends FireMessage<T>,
    T extends FireMessageContent
>() {
    const { user: me } = useFireAuth();
    const { fireNotificationWithTimeout, requestPermission } = usePushNotification();
    const { userSetting } = useUserSetting();

    const { selectedChannelId } = useFireChannel();
    const { channel, participants } = useFireChannelInfo<C, M, T, U>({
        channelId: selectedChannelId,
    });

    const { scrollAreaRef, isScrolling, scrollDate, isTop, isBottom } = useScroll();
    const ref = scrollAreaRef?.current?.querySelector('[data-slot="scroll-area-viewport"]') ?? null;

    const { sendingFiles, setReplyingMessage } = useFireChat();

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

    const allMessages = useMemo(() => [...beforeMessages, ...messages], [beforeMessages, messages]);

    const { getUnreadCountForMessage } = useMessageUnreadCount({
        messages: allMessages,
        participants: channel?.[CHANNEL_PARTICIPANTS_FIELD] ?? [],
        lastSeen: channel?.[CHANNEL_LAST_SEEN_FIELD],
    });

    useEffect(() => {
        if (isLoading) return;
        if (hasMore && isTop) {
            const scrollState = getScrollState(ref);
            loadBeforeMessages().then(() => {
                setTimeout(() => {
                    restoreScrollPosition(ref, scrollState.scrollHeight, scrollState.scrollTop);
                }, 1);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, isTop]);

    // 알림 권한 요청
    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    // 새로운 메시지가 도착했을 때 스크롤을 맨 아래로 내림
    useEffect(() => {
        if (isBottom) {
            setTimeout(() => {
                scrollToBottom(ref, false);
            }, 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, sendingFiles]);

    // 마지막으로 알림을 보낸 메시지 ID 추적
    const lastNotifiedMessageIdRef = useRef<string | null>(null);

    // 새로운 메시지 도착 시 푸시 알림
    useEffect(() => {
        const newMessage = messages.at(-1);
        if (!newMessage || !userSetting?.chatAlarm) return;

        const messageId = newMessage[MESSAGE_ID_FIELD];

        // 이미 알림을 보낸 메시지면 스킵
        if (lastNotifiedMessageIdRef.current === messageId) return;

        // 내가 보낸 메시지는 알림 안함
        if (newMessage[MESSAGE_USER_ID_FIELD] === me?.[USER_ID_FIELD]) {
            lastNotifiedMessageIdRef.current = messageId;
            return;
        }

        // 창이 포커스 상태면 알림 안함
        if (document.hasFocus()) {
            lastNotifiedMessageIdRef.current = messageId;
            return;
        }

        const type = newMessage[MESSAGE_TYPE_FIELD];
        let payload: NotificationOptions = { silent: true };

        if (type === MESSAGE_TYPE_IMAGE) {
            payload = { body: `(${FIRE_CHAT_LOCALE.IMAGE})`, silent: true };
        } else if (type === MESSAGE_TYPE_FILE) {
            payload = { body: `(${FIRE_CHAT_LOCALE.FILE})`, silent: true };
        } else {
            const contents = newMessage.contents as { text?: string }[];
            const text = contents?.[0]?.[MESSAGE_CONTENT_TEXT_FIELD] ?? "";
            payload = { body: text.replace(/<[^>]*>/g, ""), silent: true };
        }

        fireNotificationWithTimeout(NOTIFICATION_TITLE, 5000, payload);
        lastNotifiedMessageIdRef.current = messageId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages.at(-1)?.[MESSAGE_ID_FIELD]]);

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
                    <FireChatRoomBodyMessageList
                        beforeMessages={beforeMessages}
                        messages={messages}
                        // newMessages={newMessages}
                        participants={participants}
                        me={me}
                        setReplyingMessage={setReplyingMessage}
                        channelId={channel?.[CHANNEL_ID_FIELD] || ""}
                        sendingFiles={sendingFiles}
                        getUnreadCountForMessage={getUnreadCountForMessage}
                    />
                </div>
                {!isBottom && isScrolling && (
                    <Button
                        variant={"outline"}
                        className="w-10 h-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full opacity-50"
                        onClick={() => scrollToBottom(ref, true)}
                    >
                        <ArrowDown />
                    </Button>
                )}
                <div
                    className={
                        `text-xs absolute top-8 left-1/2 transform -translate-x-1/2 rounded-[12px] bg-foreground/60 px-[12px] py-[8px] text-white transition-all duration-300 pointer-events-none` +
                        (scrollDate && isScrolling ? " opacity-100 scale-100" : " opacity-0 scale-95")
                    }
                    style={{ zIndex: 30 }}
                >
                    {scrollDate}
                </div>
            </ScrollArea>
        </div>
    );
}
