import { useAuth } from '@/components/provider/AuthProvider';
import useListChannels from '@/lib/FireChat/hooks/useListChannels';

import {
    FcChannel,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    FcUser,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { ReactNode, useContext, useState } from 'react';
import { createContext } from 'react';

interface FireChatContextValue<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    channels: FcChannelParticipants<C, U, M, T>[];
    // user?: U;
    selectedChannelParticipants?: FcChannelParticipants<C, U, M, T>;
    // messages: M[];
    // loadMoreMessages: () => void;
    selectChannel: (channelId?: string) => void;
    // scrollAreaRef: RefObject<HTMLDivElement | null>;
    // isBottom: boolean;
    // scrollToBottom: (
    //     smooth?: boolean,
    //     options?: {
    //         afterScroll?: () => void;
    //         immediate?: boolean;
    //     }
    // ) => void;
    // isLoading: boolean;
    // isScrolling?: boolean;
    // scrollDate?: string;
    // sendTextMessage: (message: string, replyingMessage?: any) => Promise<void>;
    // onSendingFiles: (files: File[]) => void;
    // sendingFiles: SendingFile[];
    // setSendingFiles: Dispatch<SetStateAction<SendingFile[]>>;
    // files: File[];
    // setFiles: Dispatch<SetStateAction<File[]>>;
    // fileMessages: M[];
    // imageMessages: M[];
    // replyingMessage?: M;
    // selectReplyingMessage?: (msgId?: string) => void;
}

const FireChatContext = createContext<
    FireChatContextValue<
        FcChannel<FcMessage<FcMessageContent>, FcMessageContent>,
        FcUser,
        FcMessage<FcMessageContent>,
        FcMessageContent
    >
>({
    channels: [],
    // user: undefined,
    selectedChannelParticipants: undefined,
    // messages: [],
    // loadMoreMessages: () => {},
    selectChannel: () => {},
    // scrollAreaRef: { current: null },
    // isBottom: true,
    // scrollToBottom: () => {},
    // isLoading: true,
    // isScrolling: false,
    // scrollDate: undefined,
    // sendTextMessage: async () => {},
    // onSendingFiles: (files: File[]) => {},
    // sendingFiles: [],
    // setSendingFiles: () => {},
    // files: [],
    // setFiles: () => {},
    // fileMessages: [],
    // imageMessages: [],
    // replyingMessage: undefined,
    // selectReplyingMessage: () => {},
});

export const useFireChat = () => useContext(FireChatContext);

interface FireChatProviderProps {
    children: ReactNode;
}

export function FireChatProvider<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ children }: FireChatProviderProps) {
    const { user } = useAuth();
    const { channels } = useListChannels<C, U, M, T>({
        userId: user?.[USER_ID_FIELD] || '',
    });
    const [selectedChannelParticipants, setSelectedChannel] = useState<
        FcChannelParticipants<C, U, M, T> | undefined
    >(undefined);
    // const [isLoading, setIsLoading] = useState(true);
    // const [replyingMessage, setReplyingMessage] = useState<M | undefined>(
    //     undefined
    // );

    // const {
    //     scrollAreaRef,
    //     isBottom,
    //     scrollToBottom,
    //     isTop,
    //     getScrollState,
    //     restoreScrollState,
    //     isScrolling,
    //     scrollDate,
    // } = useScroll();

    // const { messages, fileMessages, imageMessages, loadMoreMessages, hasMore } =
    //     useListMessages<M, T>({
    //         channelId: selectedChannelParticipants?.channel[CHANNEL_ID_FIELD],
    //     });

    // const {
    //     files,
    //     setFiles,
    //     sendTextMessage,
    //     onSendingFiles,
    //     sendingFiles,
    //     setSendingFiles,
    // } = useFireChatSender({
    //     channel: selectedChannelParticipants?.channel,
    //     user,
    // });

    // useEffect(() => {
    //     if (hasMore && isTop && !isLoading) {
    //         const scrollState = getScrollState();
    //         setIsLoading(true);
    //         loadMoreMessages()
    //             .then(() => {
    //                 setTimeout(() => {
    //                     restoreScrollState(scrollState);
    //                 }, 1);
    //             })
    //             .finally(() => {
    //                 setIsLoading(false);
    //             });
    //     }
    // }, [hasMore, isTop]);

    // useEffect(() => {
    //     setIsLoading(true);
    //     scrollToBottom(false, {
    //         afterScroll: () => {
    //             setIsLoading(false);
    //         },
    //     });
    // }, [selectedChannelParticipants]);

    // // 새로운 메시지가 도착했을 때 스크롤을 맨 아래로 내림
    // useEffect(() => {
    //     if (isBottom) {
    //         scrollToBottom(false);
    //     }
    // }, [messages, sendingFiles]);

    // useEffect(() => {
    //     if (!userId) setSelectedChannel(undefined);
    // }, [userId]);

    function selectChannel(channelId?: string) {
        if (!channelId) {
            setSelectedChannel(undefined);
            return;
        }
        const channel = channels.find((c) => c.channel.id === channelId);
        if (channel) {
            setSelectedChannel(channel);
        }
    }

    // function selectReplyingMessage(msgId?: string) {
    //     setReplyingMessage(messages.find((m) => m.id === msgId));
    // }

    return (
        <FireChatContext.Provider
            value={{
                channels,
                // user,
                selectedChannelParticipants,
                selectChannel,
            }}
        >
            {children}
        </FireChatContext.Provider>
    );
}
