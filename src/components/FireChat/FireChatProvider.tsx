import { useAuth } from '@/components/provider/AuthProvider';
import useFireChatUnreadCount from '@/lib/FireChat/hooks/useFireChatUnreadCount';
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
    selectedChannelParticipants?: FcChannelParticipants<C, U, M, T>;
    selectChannel: (channelId?: string) => void;
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
    selectedChannelParticipants: undefined,
    selectChannel: () => {},
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

    return (
        <FireChatContext.Provider
            value={{
                channels,
                selectedChannelParticipants,
                selectChannel,
            }}
        >
            {children}
        </FireChatContext.Provider>
    );
}
