
// Channel collection and field names

import { FcMessage, FcMessageContent } from '@/lib/FireChat/settings';
import { Timestamp } from 'firebase/firestore';

export const CHANNEL_COLLECTION = 'matches';

export const CHANNEL_ID_FIELD = 'id';
export const CHANNEL_HOST_ID_FIELD = 'host';
export const CHANNEL_NAME_FIELD = 'name';
export const CHANNEL_PARTICIPANTS_FIELD = 'users';
export const CHANNEL_LAST_MESSAGE_FIELD = 'lastChat';
export const CHANNEL_LAST_SEEN_FIELD = 'lastSeen';

/**
 * TypeScript interfaces for Firestore documents
 */
/**
 * Generic interfaces for Firestore documents
 * C: Channel type
 * U: User type
 * M: Message type
 * T: Message content type
 */

export interface FcChannel<M extends FcMessage<T>, T extends FcMessageContent> {
    [CHANNEL_ID_FIELD]: string;
    [CHANNEL_HOST_ID_FIELD]: string;
    [CHANNEL_NAME_FIELD]: string;
    [CHANNEL_PARTICIPANTS_FIELD]: string[];
    [CHANNEL_LAST_MESSAGE_FIELD]: M | undefined;
    [CHANNEL_LAST_SEEN_FIELD]?: { [userId: string]: Timestamp; };
}

