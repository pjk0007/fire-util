import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { useAuth } from '@/components/provider/AuthProvider';
import useFireChatChannelInfo from '@/lib/FireChat/hooks/useFireChatChannelInfo';
import useFireChatSender, {
    SendingFile,
} from '@/lib/FireChat/hooks/useFireChatSender';
import useUsers from '@/lib/FireChat/hooks/useUsers';
import {
    CHANNEL_ID_FIELD,
    CHANNEL_PARTICIPANTS_FIELD,
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
    M extends FcMessage<T>,
    T extends FcMessageContent
> {
    onSendingFiles: (files: File[]) => void;
    sendingFiles: SendingFile[];
    setSendingFiles: Dispatch<SetStateAction<SendingFile[]>>;
    replyingMessage?: M;
    setReplyingMessage?: Dispatch<SetStateAction<M | undefined>>;
}

const FireChatChannelContext = createContext<
    FireChatChannelContextValue<FcMessage<FcMessageContent>, FcMessageContent>
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
        FcMessage<FcMessageContent> | undefined
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
