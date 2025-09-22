import { useAuth } from '@/components/provider/AuthProvider';
import getChannelsByUserId from '@/lib/FireChat/api/getChannelsByUserId';
import useListChannels from '@/lib/FireChat/hooks/useListChannels';

import {
    FcChannel,
    FcChannelParticipants,
    FcMessage,
    FcMessageContent,
    FcUser,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

interface FireChatContextValue<
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    channelIds: string[];
    selectedChannelId?: string;
    setSelectedChannelId: (channelId?: string) => void;
}

const FireChatContext = createContext<
    FireChatContextValue<FcMessage<FcMessageContent>, FcMessageContent>
>({
    channelIds: [],
    selectedChannelId: undefined,

    setSelectedChannelId: () => {},
});

export const useFireChat = () => useContext(FireChatContext);

interface FireChatProviderProps {
    children: ReactNode;
}

export function FireChatProvider({ children }: FireChatProviderProps) {
    const { user } = useAuth();
    const [channelIds, setChannelIds] = useState<string[]>([]);
    const [selectedChannelId, setSelectedChannelId] = useState<
        string | undefined
    >(undefined);

    useEffect(() => {
        getChannelsByUserId(user?.[USER_ID_FIELD]).then((chs) => {
            setChannelIds(chs);
        });
    }, [user?.[USER_ID_FIELD]]);

    return (
        <FireChatContext.Provider
            value={{
                channelIds,
                selectedChannelId,
                setSelectedChannelId,
            }}
        >
            {children}
        </FireChatContext.Provider>
    );
}
