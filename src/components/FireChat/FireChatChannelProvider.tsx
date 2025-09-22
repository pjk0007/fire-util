import { useAuth } from '@/components/provider/AuthProvider';
import getChannelById from '@/lib/FireChat/api/getChannelById';
import getUsersById from '@/lib/FireChat/api/getUsersById';
import useFireChatSender, {
    SendingFile,
} from '@/lib/FireChat/hooks/useFireChatSender';
import useListMessages from '@/lib/FireChat/hooks/useListMessages';
import useScroll from '@/lib/FireChat/hooks/useScroll';
import {
    CHANNEL_ID_FIELD,
    CHANNEL_PARTICIPANTS_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
} from '@/lib/FireChat/settings';
import {
    Dispatch,
    ReactNode,
    RefObject,
    SetStateAction,
    useEffect,
    useState,
    createContext,
    useContext,
} from 'react';

interface FireChatChannelContextValue<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    channel: C | null;
    participants: U[];
    messages: M[];
    loadMoreMessages: () => Promise<void>;
    scrollAreaRef: RefObject<HTMLDivElement | null>;
    isBottom: boolean;
    scrollToBottom: (
        smooth?: boolean,
        options?: {
            afterScroll?: () => void;
            immediate?: boolean;
        }
    ) => void;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
    isLoading: boolean;
    isScrolling?: boolean;
    scrollDate?: string;
    // sendTextMessage: (message: string, replyingMessage?: any) => Promise<void>;
    onSendingFiles: (files: File[]) => void;
    sendingFiles: SendingFile[];
    setSendingFiles: Dispatch<SetStateAction<SendingFile[]>>;
    fileMessages: M[];
    imageMessages: M[];
    replyingMessage?: M;
    selectReplyingMessage?: (msgId?: string) => void;
    resetChannel?: () => void;
    reFetchChannelParticipants: () => void;
}

const FireChatChannelContext = createContext<
    FireChatChannelContextValue<
        FcChannel<FcMessage<FcMessageContent>, FcMessageContent>,
        FcUser,
        FcMessage<FcMessageContent>,
        FcMessageContent
    >
>({
    channel: null,
    participants: [],
    messages: [],
    loadMoreMessages: async () => {},
    scrollAreaRef: { current: null },
    isBottom: true,
    scrollToBottom: () => {},
    files: [],
    setFiles: () => {},
    isLoading: false,
    sendingFiles: [],
    setSendingFiles: () => {},
    onSendingFiles: () => {},
    fileMessages: [],
    imageMessages: [],
    isScrolling: false,
    scrollDate: undefined,
    // sendTextMessage: async () => {},
    replyingMessage: undefined,
    selectReplyingMessage: () => {},
    resetChannel: () => {},
    reFetchChannelParticipants: () => {},
});

export const useFireChatChannel = () => useContext(FireChatChannelContext);

interface FireChatProviderProps<U extends FcUser> {
    channelId?: string;
    resetChannel?: () => void;
    children: ReactNode;
}

export function FireChatChannelProvider<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId, children, resetChannel }: FireChatProviderProps<U>) {
    const [channel, setChannel] = useState<C | null>(null);
    const [participants, setParticipants] = useState<U[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [replyingMessage, setReplyingMessage] = useState<M | undefined>(
        undefined
    );

    const { user: me } = useAuth();

    const {
        isLoading: isMessagesLoading,
        messages,
        fileMessages,
        imageMessages,
        loadMoreMessages,
        hasMore,
    } = useListMessages<M, T>({
        channelId,
    });

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

    const {
        files,
        setFiles,
        // sendTextMessage,
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
    } = useFireChatSender({
        channel: channel,
        user: me,
    });

    useEffect(() => {
        if (!channelId) {
            setChannel(null);
            setParticipants([]);
            setFiles([]);
            setSendingFiles([]);
            setReplyingMessage(undefined);
            return;
        }
        setIsLoading(true);
        setSendingFiles([]);
        getChannelById({ channelId })
            .then((ch) => {
                setChannel(ch as C | null);
                return ch;
            })
            .then((ch) => {
                getUsersById({
                    ids: ch?.[CHANNEL_PARTICIPANTS_FIELD] || [],
                }).then((users) => {
                    setParticipants(users as U[]);
                });
            })
            .then(() => {
                scrollToBottom(false, {
                    afterScroll: () => {
                        setIsLoading(false);
                    },
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [channelId]);

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

    function reFetchChannelParticipants() {
        if (!channelId) {
            setParticipants([]);
            return;
        }
        getChannelById({ channelId })
            .then((ch) => {
                return ch?.[CHANNEL_PARTICIPANTS_FIELD] || [];
            })
            .then((ids) => {
                getUsersById({ ids }).then((users) => {
                    setParticipants(users as U[]);
                });
            });
    }

    function selectReplyingMessage(msgId?: string) {
        setReplyingMessage(messages.find((m) => m.id === msgId));
    }

    const contextValue: FireChatChannelContextValue<C, U, M, T> = {
        channel,
        participants,
        messages,
        fileMessages,
        imageMessages,
        loadMoreMessages,
        scrollAreaRef,
        isBottom,
        scrollToBottom,
        files,
        setFiles,
        isScrolling,
        scrollDate,
        isLoading: isLoading || isMessagesLoading,
        // sendTextMessage,
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
        replyingMessage,
        selectReplyingMessage,
        resetChannel,
        reFetchChannelParticipants,
    };

    console.log({ isLoading });

    return (
        <FireChatChannelContext.Provider value={contextValue}>
            {children}
        </FireChatChannelContext.Provider>
    );
}
