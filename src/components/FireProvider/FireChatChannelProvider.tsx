import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import useFireChatSender, {
    SendingFile,
} from '@/lib/FireChat/hooks/useFireChatSender';
import {
    FireMessage,
    FireMessageContent,
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
    M extends FireMessage<T>,
    T extends FireMessageContent
> {
    onSendingFiles: (files: File[]) => void;
    sendingFiles: SendingFile[];
    setSendingFiles: Dispatch<SetStateAction<SendingFile[]>>;
    replyingMessage?: M;
    setReplyingMessage?: Dispatch<SetStateAction<M | undefined>>;
}

const FireChatChannelContext = createContext<
    FireChatChannelContextValue<FireMessage<FireMessageContent>, FireMessageContent>
>({
    sendingFiles: [],
    setSendingFiles: () => {},
    onSendingFiles: () => {},
    replyingMessage: undefined,
    setReplyingMessage: () => {},
});

export const useFireChatChannel = () => useContext(FireChatChannelContext);

interface FireChatProviderProps {
    children: ReactNode;
}

export function FireChatChannelProvider({ children }: FireChatProviderProps) {
    const { selectedChannelId: channelId } = useFireChannel();

    const [replyingMessage, setReplyingMessage] = useState<
        FireMessage<FireMessageContent> | undefined
    >(undefined);

    const { onSendingFiles, sendingFiles, setSendingFiles } =
        useFireChatSender(channelId);

    useEffect(() => {
        if (!channelId) {
            setSendingFiles([]);
            setReplyingMessage(undefined);
            return;
        }
        setSendingFiles([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId]);

    return (
        <FireChatChannelContext.Provider
            value={{
                onSendingFiles,
                sendingFiles,
                setSendingFiles,
                replyingMessage,
                setReplyingMessage,
            }}
        >
            {children}
        </FireChatChannelContext.Provider>
    );
}
