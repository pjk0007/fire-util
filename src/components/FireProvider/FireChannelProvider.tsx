import { FireChatSidebarProvider } from '@/components/FireProvider/FireChatSidebarProvider';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import useFireChannelList from '@/lib/FireChannel/hook/useFireChannelList';

import {
    FcChannel,
    FcMessage,
    FcMessageContent,
} from '@/lib/FireChat/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { createContext } from 'react';

interface FireChatContextValue<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    channels: C[];
    selectedChannelId?: string;
    setSelectedChannelId: (channelId?: string) => void;
}

const FireChatContext = createContext<
    FireChatContextValue<
        FcChannel<FcMessage<FcMessageContent>, FcMessageContent>,
        FcMessage<FcMessageContent>,
        FcMessageContent
    >
>({
    channels: [],
    selectedChannelId: undefined,

    setSelectedChannelId: () => {},
});

export const useFireChannel = () => useContext(FireChatContext);

interface FireChatProviderProps {
    children: ReactNode;
    defaultChannelId?: string;
}

export function FireChannelProvider<
    C extends FcChannel<M, T>,
    M extends FcMessage<T>,
    T extends FcMessageContent
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
        <FireChatContext.Provider
            value={
                {
                    channels,
                    selectedChannelId,
                    setSelectedChannelId,
                } as FireChatContextValue<C, M, T>
            }
        >
            <FireChatSidebarProvider
                style={ {
                    '--firechat-header-height': 'calc(var(--spacing) * 16)',
                } as React.CSSProperties}
            >
                {children}
            </FireChatSidebarProvider>
        </FireChatContext.Provider>
    );
}
