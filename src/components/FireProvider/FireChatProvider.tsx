import { useAuth } from '@/components/provider/AuthProvider';
import getChannelsByUserId from '@/lib/FireChat/api/getChannelsByUserId';

import { USER_ID_FIELD } from '@/lib/FireChat/settings';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

interface FireChatContextValue {
    channelIds: string[];
    selectedChannelId?: string;
    setSelectedChannelId: (channelId?: string) => void;
}

const FireChatContext = createContext<FireChatContextValue>({
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
    const userId = user?.[USER_ID_FIELD];

    useEffect(() => {
        getChannelsByUserId(userId).then((chs) => {
            setChannelIds(chs);
        });
    }, [userId]);

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
