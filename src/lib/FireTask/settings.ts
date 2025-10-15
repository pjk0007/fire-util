// settings for FireTask
import { Timestamp } from 'firebase/firestore';

/**
 * Firestore collection and field names
 */
export const TASK_COLLECTION = 'feeds';

export const TASK_ID_FIELD = 'id';
export const TASK_CHANNEL_ID_FIELD = 'matchId';
export const TASK_USER_FIELD = 'user';
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
    NO_TASKS: '업무가 없습니다.',
    NO_DUE_DATE: '마감일 없음',
    NO_TITLE: '업무 이름을 입력하세요',
    EMPTY: '비어 있음',

    SIDEBAR: {
        MAXIMIZE: '확장',
        MINIMIZE: '축소',
        CLOSE: '닫기',
        NEW_WINDOW: '새 창 열기',
    },

    CARD: {
        CHANGE_STATUS: '상태 변경',
        EDIT: '편집',
        CREATED_AT: '요청일',
        DUE_DATE: '마감일',
        CONTENT_PLACEHOLDER: '요청할 업무의 상세 내용을 입력하세요',
        DELETE: '삭제',
    },

    SHEET: {
        COMMENTS: '댓글',
        FILES: '파일',
        ADD_FILE: '파일 첨부하기',
        ADD_COMMENT_PLACEHOLDER: '댓글을 입력하세요',
    },

    STATUS: {
        [TASK_STATUS_REQUEST]: '요청',
        [TASK_STATUS_PROCEED]: '진행',
        [TASK_STATUS_FEEDBACK]: '피드백',
        [TASK_STATUS_END]: '완료',
        [TASK_STATUS_HOLD]: '보류',
    },
};

export const TASK_STATUS_OPTIONS: {
    value: TaskStatus;
    label: string;
    color: string;
}[] = [
    {
        value: TASK_STATUS_REQUEST,
        label: TASK_LOCALE.STATUS[TASK_STATUS_REQUEST],
        color: 'oklch(90.5% 0.182 98.111)',
    },
    {
        value: TASK_STATUS_PROCEED,
        label: TASK_LOCALE.STATUS[TASK_STATUS_PROCEED],
        color: 'oklch(70.7% 0.165 254.624)',
    },
    {
        value: TASK_STATUS_FEEDBACK,
        label: TASK_LOCALE.STATUS[TASK_STATUS_FEEDBACK],
        color: 'oklch(62.7% 0.265 303.9)',
    },
    {
        value: TASK_STATUS_END,
        label: TASK_LOCALE.STATUS[TASK_STATUS_END],
        color: 'oklch(77.7% 0.152 181.912)',
    },
    {
        value: TASK_STATUS_HOLD,
        label: TASK_LOCALE.STATUS[TASK_STATUS_HOLD],
        color: 'oklch(70.8% 0 0)',
    },
];

export type TaskStatus =
    | typeof TASK_STATUS_REQUEST
    | typeof TASK_STATUS_PROCEED
    | typeof TASK_STATUS_FEEDBACK
    | typeof TASK_STATUS_END
    | typeof TASK_STATUS_HOLD;

// types for Firestore documents
export interface FireTask<U> {
    [TASK_ID_FIELD]: string;
    [TASK_CHANNEL_ID_FIELD]: string;
    [TASK_USER_FIELD]: U;
    [TASK_TITLE_FIELD]: string;
    [TASK_IMAGES_FIELD]: string[]; // Array of image URLs
    [TASK_FILES_FIELD]: { name: string; url: string; size: number }[]; // Array of file objects
    [TASK_CONTENT_FIELD]: string;
    [TASK_STATUS_FIELD]: TaskStatus;
    [TASK_COMMENTS_FIELD]: FireTaskComment<U>[]; // Array of comments
    [TASK_LAST_SEEN_FIELD]?: { [userId: string]: Timestamp }; // Map of userId to Timestamp
    [TASK_DUE_DATE_FIELD]?: Timestamp | null; // Due date as Timestamp
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
