import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { db } from '@/lib/firebase';
import sendMessage from '@/lib/FireChat/api/sendMessage';
import {
    CHANNEL_COLLECTION,
    CHANNEL_ID_FIELD,
    CHANNEL_LAST_MESSAGE_FIELD,
    FcMessage,
    FcMessageContent,
    FcMessageSystem,
    FcMessageText,
    MESSAGE_COLLECTION,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function useFireChatSender() {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { selectedChannel, messages, user } = useFireChat();

    async function updateLastMessage<
        M extends FcMessage<T>,
        T extends FcMessageContent
    >(msg: M) {
        if (!selectedChannel || messages.length === 0) return;
        await updateDoc(
            doc(
                db,
                CHANNEL_COLLECTION,
                selectedChannel.channel[CHANNEL_ID_FIELD]
            ),
            {
                [CHANNEL_LAST_MESSAGE_FIELD]: msg,
            }
        );
        // Update the last message in the channel document if needed
        // This part is optional and depends on your requirements
    }

    async function createDateMessage<
        M extends FcMessage<T>,
        T extends FcMessageSystem
    >() {
        if (!selectedChannel) return;
        const now = Timestamp.now();
        const msg = {
            [MESSAGE_ID_FIELD]: `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`,
            [MESSAGE_USER_ID_FIELD]: MESSAGE_TYPE_SYSTEM,
            [MESSAGE_CREATED_AT_FIELD]: now,
            [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_SYSTEM,
            [MESSAGE_CONTENTS_FIELD]: [
                {
                    [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_SYSTEM,
                    [MESSAGE_CONTENT_TEXT_FIELD]: now
                        .toDate()
                        .toLocaleDateString(),
                },
            ],
        } as M;
        if (messages.length === 0) {
            await sendMessage(selectedChannel.channel[CHANNEL_ID_FIELD], msg);
            return;
        }
        const lastMessage = messages[messages.length - 1];
        const lastMessageDate = lastMessage[MESSAGE_CREATED_AT_FIELD].toDate();

        if (
            lastMessageDate.getFullYear() !== now.toDate().getFullYear() ||
            lastMessageDate.getMonth() !== now.toDate().getMonth() ||
            lastMessageDate.getDate() !== now.toDate().getDate()
        ) {
            await sendMessage(selectedChannel.channel[CHANNEL_ID_FIELD], msg);
        }
    }

    async function sendTextMessage<M extends FcMessage<FcMessageText>>() {
        if (!message.trim() || !selectedChannel) return;
        setIsLoading(true);
        await createDateMessage();
        const now = Timestamp.now();
        const msg = {
            [MESSAGE_ID_FIELD]: `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`,
            [MESSAGE_USER_ID_FIELD]: user?.[USER_ID_FIELD] || '',
            [MESSAGE_CREATED_AT_FIELD]: now,
            [MESSAGE_TYPE_FIELD]: 'text',
            [MESSAGE_CONTENTS_FIELD]: [
                {
                    [MESSAGE_TYPE_FIELD]: 'text',
                    [MESSAGE_CONTENT_TEXT_FIELD]: message,
                },
            ],
        } as M;
        if (selectedChannel) {
            setMessage('');
            await sendMessage(selectedChannel.channel[CHANNEL_ID_FIELD], msg);
            await updateLastMessage(msg);

            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    return { message, setMessage, sendTextMessage, isLoading };
}
