import { FireChatSidebarProvider } from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import useFireChannelList from '@/lib/FireChannel/hook/useFireChannelList';

import {
    FireMessage,
    FireMessageContent,
} from '@/lib/FireChat/settings';
import { FireChannel } from '@/lib/FireChannel/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

interface FireChannelContextValue<
    C extends FireChannel<M, T>,
    M extends FireMessage<T>,
    T extends FireMessageContent
> {
    channels: C[];
    selectedChannelId?: string;
    setSelectedChannelId: (channelId?: string) => void;
}

const FireChannelContext = createContext<
    FireChannelContextValue<
        FireChannel<FireMessage<FireMessageContent>, FireMessageContent>,
        FireMessage<FireMessageContent>,
        FireMessageContent
    >
>({
    channels: [],
    selectedChannelId: undefined,

    setSelectedChannelId: () => {},
});

// export const useFireChannel = () => useContext(FireChannelContext);
export function useFireChannel<
    C extends FireChannel<M, T>,
    M extends FireMessage<T>,
    T extends FireMessageContent
>() {
    return useContext(
        FireChannelContext
    ) as FireChannelContextValue<C, M, T>;
}

interface FireChatProviderProps {
    children: ReactNode;
    defaultChannelId?: string;
}

export function FireChannelProvider<
    C extends FireChannel<M, T>,
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ children, defaultChannelId }: FireChatProviderProps) {
    const { user } = useFireAuth();
    const [selectedChannelId, setSelectedChannelId] = useState<
        string | undefined
    >(undefined);
    const userId = user?.[USER_ID_FIELD];
    const { channels } = useFireChannelList(userId);

    useEffect(() => {
        if (defaultChannelId) {
            setSelectedChannelId(defaultChannelId);
        }
    }, [defaultChannelId]);

    return (
        <FireChannelContext.Provider
            value={
                {
                    channels,
                    selectedChannelId,
                    setSelectedChannelId,
                } as FireChannelContextValue<C, M, T>
            }
        >
            <FireChatSidebarProvider
                style={ {
                    '--firechat-header-height': 'calc(var(--spacing) * 16)',
                } as React.CSSProperties}
            >
                {children}
            </FireChatSidebarProvider>
        </FireChannelContext.Provider>
    );
}
