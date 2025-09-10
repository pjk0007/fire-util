import getUser from '@/lib/FireChat/api/getUser';
import useListChannels from '@/lib/FireChat/hooks/useListChannels';
import useListMessages from '@/lib/FireChat/hooks/useListMessages';
import useUser from '@/lib/FireChat/hooks/useUser';
import {
    CHANNEL_ID_FIELD,
    FcChannel,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    FcUser,
} from '@/lib/FireChat/settings';
import { ReactNode, useContext, useEffect, useState } from 'react';
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
    selectedChannelMessages: M[];
    handleSetSelectedChannel: (channelId?: string) => void;
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
    selectedChannelMessages: [],
    handleSetSelectedChannel: () => {},
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
    const { messages } = useListMessages<M, T>({
        channelId: selectedChannel?.channel[CHANNEL_ID_FIELD],
    });

    function handleSetSelectedChannel(channelId?: string) {
        if (!channelId) {
            setSelectedChannel(undefined);
            return;
        }
        const channel = channels.find((c) => c.channel.id === channelId);
        if (channel) {
            setSelectedChannel(channel);
        }
    }

    return (
        <fireChatContext.Provider
            value={{
                channels,
                user,
                selectedChannel,
                selectedChannelMessages: messages,
                handleSetSelectedChannel,
            }}
        >
            {children}
        </fireChatContext.Provider>
    );
}
