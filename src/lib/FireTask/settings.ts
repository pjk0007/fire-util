// settings for FireTask
import { Timestamp } from 'firebase/firestore';

/**
 * Firestore collection and field names
 */
export const TASK_COLLECTION = 'feeds';

export const TASK_ID_FIELD = 'id';
export const TASK_CHANNEL_ID_FIELD = 'matchId';
export const TASK_CHANNEL_USER_FIELD = 'user';
export const TASK_TITLE_FIELD = 'title';
export const TASK_IMAGES_FIELD = 'images';
export const TASK_FILES_FIELD = 'files';
export const TASK_CONTENT_FIELD = 'content';
export const TASK_STATUS_FIELD = 'status';
export const TASK_COMMENTS_FIELD = 'comments';
export const TASK_LAST_SEEN_FIELD = 'lastSeen';
export const TASK_DUE_DATE_FIELD = 'dueDate';
export const TASK_CREATED_AT_FIELD = 'createdAt';
export const TASK_UPDATED_AT_FIELD = 'updatedAt';

// Task status values
export const TASK_STATUS_REQUEST = 'request';
export const TASK_STATUS_PROCEED = 'proceed';
export const TASK_STATUS_FEEDBACK = 'feedback';
export const TASK_STATUS_END = 'end';
export const TASK_STATUS_HOLD = 'hold';

// Task Comment field names
export const TASK_COMMENT_ID_FIELD = 'id';
export const TASK_COMMENT_USER_FIELD = 'user';
export const TASK_COMMENT_CONTENT_FIELD = 'content';
export const TASK_COMMENT_IMAGES_FIELD = 'images';
export const TASK_COMMENT_FILES_FIELD = 'files';
export const TASK_COMMENT_CREATED_AT_FIELD = 'createdAt';
export const TASK_COMMENT_UPDATED_AT_FIELD = 'updatedAt';

/**
 * Localization strings
 */
export const TASK_LOCALE = {
    TASK_LIST: '업무 리스트',
    ADD_TASK: '신규 업무 추가',
};

// types for Firestore documents
export interface FireTask<U> {
    [TASK_ID_FIELD]: string;
    [TASK_CHANNEL_ID_FIELD]: string;
    [TASK_CHANNEL_USER_FIELD]: U;
    [TASK_TITLE_FIELD]: string;
    [TASK_IMAGES_FIELD]: string[]; // Array of image URLs
    [TASK_FILES_FIELD]: { name: string; url: string; size: number }[]; // Array of file objects
    [TASK_CONTENT_FIELD]: string;
    [TASK_STATUS_FIELD]: string;
    [TASK_COMMENTS_FIELD]: { user: U; comment: string; createdAt: Timestamp }[]; // Array of comment objects
    [TASK_LAST_SEEN_FIELD]?: { [userId: string]: Timestamp }; // Map of userId to Timestamp
    [TASK_DUE_DATE_FIELD]?: Timestamp; // Due date as Timestamp
    [TASK_CREATED_AT_FIELD]: Timestamp; // Creation time as Timestamp
    [TASK_UPDATED_AT_FIELD]: Timestamp; // Last update time as Timestamp
}

export interface FireTaskComment<U> {
    [TASK_COMMENT_ID_FIELD]: string;
    [TASK_COMMENT_USER_FIELD]: U;
    [TASK_COMMENT_CONTENT_FIELD]: string;
    [TASK_COMMENT_IMAGES_FIELD]: string[]; // Array of image URLs
    [TASK_COMMENT_FILES_FIELD]: { name: string; url: string; size: number }[]; // Array of file objects
    [TASK_COMMENT_CREATED_AT_FIELD]: Timestamp; // Creation time as Timestamp
    [TASK_COMMENT_UPDATED_AT_FIELD]?: Timestamp; // Last update time as Timestamp
}
