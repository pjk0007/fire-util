import { db } from '@/lib/firebase';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_COLLECTION,
    MESSAGE_ID_FIELD,
    MESSAGE_REACTIONS_FIELD,
} from '@/components/FireChat/settings';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import { doc, updateDoc } from 'firebase/firestore';

export default async function handleEmojiReactionClick<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({
    userId,
    channelId,
    message,
    emoji,
}: {
    userId?: string;
    channelId: string;
    message: M;
    emoji: string;
}) {
    if (!userId) return;
    if (!message[MESSAGE_REACTIONS_FIELD]) {
        message[MESSAGE_REACTIONS_FIELD] = {};
    }
    const reactions = message[MESSAGE_REACTIONS_FIELD] || {};
    const users = reactions[emoji] || [];
    const userIndex = users.indexOf(userId);
    if (userIndex === -1) {
        // add reaction
        users.push(userId);
    } else {
        // remove reaction
        users.splice(userIndex, 1);
    }
    if (users.length === 0) {
        delete reactions[emoji];
    } else {
        reactions[emoji] = users;
    }
    const messageRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        MESSAGE_COLLECTION,
        message[MESSAGE_ID_FIELD]
    );
    await updateDoc(messageRef, {
        [MESSAGE_REACTIONS_FIELD]: reactions,
    });
}
