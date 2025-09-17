import getUser from '@/lib/FireChat/api/getUser';
import useFireChatSender, {
    SendingFile,
} from '@/lib/FireChat/hooks/useFireChatSender';
import useListChannels from '@/lib/FireChat/hooks/useListChannels';
import useListMessages from '@/lib/FireChat/hooks/useListMessages';
import useScroll from '@/lib/FireChat/hooks/useScroll';
import useUser from '@/lib/FireChat/hooks/useUser';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    FcUser,
} from '@/lib/FireChat/settings';
import {
    Dispatch,
    ReactNode,
    RefObject,
    SetStateAction,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createContext } from 'react';

interface FireChatContextValue<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    channels: FcChannelParticipants<C, U, M, T>[];
    user?: U;
    selectedChannel?: FcChannelParticipants<C, U, M, T>;
    messages: M[];
    loadMoreMessages: () => void;
    selectChannel: (channelId?: string) => void;
    scrollAreaRef: RefObject<HTMLDivElement | null>;
    isBottom: boolean;
    scrollToBottom: (smooth?: boolean) => void;
    isLoading: boolean;
    isScrolling?: boolean;
    scrollDate?: string;
    sendTextMessage: (message: string, replyingMessage?: any) => Promise<void>;
    onSendingFiles: (files: File[]) => void;
    sendingFiles: SendingFile[];
    setSendingFiles: Dispatch<SetStateAction<SendingFile[]>>;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
    fileMessages: M[];
    imageMessages: M[];
    replyingMessage?: M;
    selectReplyingMessage?: (msgId?: string) => void;
}

const fireChatContext = createContext<
    FireChatContextValue<
        FcChannel<FcMessage<FcMessageContent>, FcMessageContent>,
        FcUser,
        FcMessage<FcMessageContent>,
        FcMessageContent
    >
>({
    channels: [],
    user: undefined,
    selectedChannel: undefined,
    messages: [],
    loadMoreMessages: () => {},
    selectChannel: () => {},
    scrollAreaRef: { current: null },
    isBottom: true,
    scrollToBottom: () => {},
    isLoading: true,
    isScrolling: false,
    scrollDate: undefined,
    sendTextMessage: async () => {},
    onSendingFiles: (files: File[]) => {},
    sendingFiles: [],
    setSendingFiles: () => {},
    files: [],
    setFiles: () => {},
    fileMessages: [],
    imageMessages: [],
    replyingMessage: undefined,
    selectReplyingMessage: () => {},
});

export const useFireChat = () => useContext(fireChatContext);

interface FireChatProviderProps {
    children: ReactNode;
    userId?: string;
}

export function FireChatProvider<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ children, userId }: FireChatProviderProps) {
    const { channels } = useListChannels<C, U, M, T>({
        userId,
    });
    const { user } = useUser<U>(userId);
    const [selectedChannel, setSelectedChannel] = useState<
        FcChannelParticipants<C, U, M, T> | undefined
    >(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingMessage, setReplyingMessage] = useState<M | undefined>(
        undefined
    );

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

    const { messages, fileMessages, imageMessages, loadMoreMessages, hasMore } =
        useListMessages<M, T>({
            channelId: selectedChannel?.channel[CHANNEL_ID_FIELD],
        });

    const {
        files,
        setFiles,
        sendTextMessage,
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
    } = useFireChatSender({
        channel: selectedChannel?.channel,
        user,
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

    useEffect(() => {
        setIsLoading(true);
        scrollToBottom(false, {
            afterScroll: () => {
                setIsLoading(false);
            },
        });
    }, [selectedChannel]);

    // 새로운 메시지가 도착했을 때 스크롤을 맨 아래로 내림
    useEffect(() => {
        if (isBottom) {
            scrollToBottom(false);
        }
    }, [messages, sendingFiles]);

    function selectChannel(channelId?: string) {
        setFiles([]);
        setSendingFiles([]);
        setReplyingMessage(undefined);
        setIsLoading(true);
        if (!channelId) {
            setSelectedChannel(undefined);
            setIsLoading(false);
            return;
        }
        const channel = channels.find((c) => c.channel.id === channelId);
        if (channel) {
            setSelectedChannel(channel);
        }
        setIsLoading(false);
    }

    function selectReplyingMessage(msgId?: string) {
        setReplyingMessage(messages.find((m) => m.id === msgId));
    }
    const contextValue = useMemo<FireChatContextValue<C, U, M, T>>(
        () => ({
            channels,
            user,
            selectedChannel,
            messages,
            loadMoreMessages,
            selectChannel,
            scrollAreaRef,
            isBottom,
            scrollToBottom,
            isLoading,
            isScrolling,
            scrollDate,
            sendTextMessage,
            onSendingFiles,
            sendingFiles,
            setSendingFiles,
            files,
            setFiles,
            fileMessages,
            imageMessages,
            replyingMessage,
            selectReplyingMessage,
        }),
        [
            channels,
            user,
            selectedChannel,
            messages,
            loadMoreMessages,
            selectChannel,
            scrollAreaRef,
            isBottom,
            scrollToBottom,
            isLoading,
            isScrolling,
            scrollDate,
            sendTextMessage,
            onSendingFiles,
            sendingFiles,
            setSendingFiles,
            files,
            setFiles,
            fileMessages,
            imageMessages,
            replyingMessage,
            selectReplyingMessage,
        ]
    );

    return (
        <fireChatContext.Provider value={contextValue}>
            {children}
        </fireChatContext.Provider>
    );
}
