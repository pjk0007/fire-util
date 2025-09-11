import getUser from '@/lib/FireChat/api/getUser';
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
    ReactNode,
    RefObject,
    useContext,
    useEffect,
    useLayoutEffect,
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
    selectChannel: (channelId?: string) => void;
    scrollAreaRef: RefObject<HTMLDivElement | null>;
    isBottom: boolean;
    scrollToBottom: (smooth?: boolean) => void;
    isLoading: boolean;
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
    selectChannel: () => {},
    scrollAreaRef: { current: null },
    isBottom: true,
    scrollToBottom: () => {},
    isLoading: true,
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

    const { scrollAreaRef, isBottom, scrollToBottom } = useScroll();
    const { messages } = useListMessages<M, T>({
        channelId: selectedChannel?.channel[CHANNEL_ID_FIELD],
        onNewMessage: () => {
            if (!isBottom) return;
            scrollToBottom(true);
        },
    });

    useEffect(() => {
        setIsLoading(true);
        scrollToBottom(false, {
            afterScroll: () => {
                setIsLoading(false);
            },
        });
    }, [selectedChannel]);

    function selectChannel(channelId?: string) {
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

    return (
        <fireChatContext.Provider
            value={{
                channels,
                user,
                selectedChannel,
                messages,
                selectChannel,
                scrollAreaRef,
                isBottom,
                scrollToBottom,
                isLoading,
            }}
        >
            {children}
        </fireChatContext.Provider>
    );
}
