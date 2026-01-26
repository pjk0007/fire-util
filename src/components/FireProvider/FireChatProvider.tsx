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
    useCallback,
    createContext,
    useContext,
} from 'react';
import { AnnotationViewDialog } from '@/components/FireChat/Annotation';

interface AnnotationDialogState {
    isOpen: boolean;
    imageUrl: string | null;
}

interface FireChatContextValue<
    M extends FireMessage<T>,
    T extends FireMessageContent
> {
    onSendingFiles: (files: File[]) => void;
    sendingFiles: SendingFile[];
    setSendingFiles: Dispatch<SetStateAction<SendingFile[]>>;
    replyingMessage?: M;
    setReplyingMessage?: Dispatch<SetStateAction<M | undefined>>;
    // 어노테이션 다이얼로그
    annotationDialog: AnnotationDialogState;
    openAnnotationDialog: (imageUrl: string) => void;
    closeAnnotationDialog: () => void;
    sendAnnotatedImage: (blob: Blob) => void;
}

const FireChatContext = createContext<
    FireChatContextValue<FireMessage<FireMessageContent>, FireMessageContent>
>({
    sendingFiles: [],
    setSendingFiles: () => {},
    onSendingFiles: () => {},
    replyingMessage: undefined,
    setReplyingMessage: () => {},
    annotationDialog: { isOpen: false, imageUrl: null },
    openAnnotationDialog: () => {},
    closeAnnotationDialog: () => {},
    sendAnnotatedImage: () => {},
});

export const useFireChat = () => useContext(FireChatContext);

interface FireChatProviderProps {
    children: ReactNode;
}

export function FireChatProvider({ children }: FireChatProviderProps) {
    const { selectedChannelId: channelId } = useFireChannel();

    const [replyingMessage, setReplyingMessage] = useState<
        FireMessage<FireMessageContent> | undefined
    >(undefined);

    const { onSendingFiles, sendingFiles, setSendingFiles } =
        useFireChatSender(channelId);

    // 어노테이션 다이얼로그 상태
    const [annotationDialog, setAnnotationDialog] = useState<AnnotationDialogState>({
        isOpen: false,
        imageUrl: null,
    });

    const openAnnotationDialog = useCallback((imageUrl: string) => {
        setAnnotationDialog({ isOpen: true, imageUrl });
    }, []);

    const closeAnnotationDialog = useCallback(() => {
        setAnnotationDialog({ isOpen: false, imageUrl: null });
    }, []);

    const sendAnnotatedImage = useCallback((blob: Blob) => {
        const file = new File([blob], `annotated-${Date.now()}.png`, { type: 'image/png' });
        onSendingFiles([file]);
        closeAnnotationDialog();
    }, [onSendingFiles, closeAnnotationDialog]);

    useEffect(() => {
        if (!channelId) {
            setSendingFiles([]);
            setReplyingMessage(undefined);
            return;
        }
        setSendingFiles([]);

        return () => {
            setSendingFiles([]);
            setReplyingMessage(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId]);

    return (
        <FireChatContext.Provider
            value={{
                onSendingFiles,
                sendingFiles,
                setSendingFiles,
                replyingMessage,
                setReplyingMessage,
                annotationDialog,
                openAnnotationDialog,
                closeAnnotationDialog,
                sendAnnotatedImage,
            }}
        >
            {children}
            {annotationDialog.imageUrl && (
                <AnnotationViewDialog
                    images={[annotationDialog.imageUrl]}
                    defaultIdx={0}
                    open={annotationDialog.isOpen}
                    onOpenChange={(open) => {
                        if (!open) closeAnnotationDialog();
                    }}
                    onComplete={sendAnnotatedImage}
                />
            )}
        </FireChatContext.Provider>
    );
}
