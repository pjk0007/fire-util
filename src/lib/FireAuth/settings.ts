// User collection and field names
export const USER_COLLECTION = 'users';

export const USER_ID_FIELD = 'id';
export const USER_NAME_FIELD = 'name';
export const USER_AVATAR_FIELD = 'profileImg';

export const USER_AVATAR_FALLBACK_URL = '/default-avatar.png';

export const USER_EMAIL_FIELD = 'email';
export const USER_SIGNED_UP_AT_FIELD = 'signUpAt';
export const USER_LAST_ACTIVE_AT_FIELD = 'lastVisitedAt';

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

export interface FireUser {
    [USER_ID_FIELD]: string;
    [USER_NAME_FIELD]: string;
    [USER_AVATAR_FIELD]?: string;
    [USER_EMAIL_FIELD]?: string;
    [USER_SIGNED_UP_AT_FIELD]: Date;
    [USER_LAST_ACTIVE_AT_FIELD]?: Date;
}

// User setting path and fields
export const USER_SETTING_DOC_PATH = (userId: string) =>
    `users/${userId}/metadata/setting`;

export const USER_SETTING_CHAT_ALARM_FIELD = 'chatAlarm';

export interface IUserSetting {
    [USER_SETTING_CHAT_ALARM_FIELD]: boolean;
}
