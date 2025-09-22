import { useAuth } from '@/components/provider/AuthProvider';
import useFireChatChannelInfo from '@/lib/FireChat/hooks/useFireChatChannelInfo';
import useFireChatSender, {
    SendingFile,
} from '@/lib/FireChat/hooks/useFireChatSender';
import {
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import {
    Dispatch,
    ReactNode,
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
    channel?: C;
    participants: U[];
    onSendingFiles: (files: File[]) => void;
    sendingFiles: SendingFile[];
    setSendingFiles: Dispatch<SetStateAction<SendingFile[]>>;
    replyingMessage?: FcMessage<FcMessageContent>;
    setReplyingMessage?: (message?: FcMessage<FcMessageContent>) => void;
    resetChannel?: () => void;
}

const FireChatChannelContext = createContext<
    FireChatChannelContextValue<
        FcChannel<FcMessage<FcMessageContent>, FcMessageContent>,
        FcUser,
        FcMessage<FcMessageContent>,
        FcMessageContent
    >
>({
    channel: undefined,
    participants: [],
    sendingFiles: [],
    setSendingFiles: () => {},
    onSendingFiles: () => {},
    replyingMessage: undefined,
    setReplyingMessage: () => {},
    resetChannel: () => {},
});

export const useFireChatChannel = () => useContext(FireChatChannelContext);

interface FireChatProviderProps {
    channelId?: string;
    resetChannel?: () => void;
    children: ReactNode;
}

export function FireChatChannelProvider<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ channelId, children, resetChannel }: FireChatProviderProps) {
    const { user } = useAuth();
    const { channel, participants } = useFireChatChannelInfo<C, M, T, U>({
        channelId,
        userId: user?.[USER_ID_FIELD],
    });
    const [replyingMessage, setReplyingMessage] = useState<
        FcMessage<FcMessageContent> | undefined
    >(undefined);

    console.log('render FireChatChannelProvider', { channelId, channel });

    const { onSendingFiles, sendingFiles, setSendingFiles } = useFireChatSender<
        C,
        M,
        T
    >({
        channel,
    });

    useEffect(() => {
        if (!channelId) {
            setSendingFiles([]);
            setReplyingMessage(undefined);
            return;
        }
        setSendingFiles([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId]);

    const contextValue: FireChatChannelContextValue<C, U, M, T> = {
        channel,
        participants,
        onSendingFiles,
        sendingFiles,
        setSendingFiles,
        replyingMessage,
        setReplyingMessage,
        resetChannel,
    };

    return (
        <FireChatChannelContext.Provider value={contextValue}>
            {children}
        </FireChatChannelContext.Provider>
    );
}
