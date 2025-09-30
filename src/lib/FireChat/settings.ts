/**
 * Firestore collection and field names
 */

import { Timestamp } from 'firebase/firestore';

// Message collection and field names
export const MESSAGE_COLLECTION = 'chats';

export const MESSAGE_ID_FIELD = 'id';
export const MESSAGE_USER_ID_FIELD = 'userId';
export const MESSAGE_REPLY_FIELD = 'reply';
export const MESSAGE_TYPE_FIELD = 'type';
export const MESSAGE_CONTENTS_FIELD = 'contents';
export const MESSAGE_CREATED_AT_FIELD = 'time';
export const MESSAGE_REACTIONS_FIELD = 'reactions';

// Message types
export const MESSAGE_TYPE_TEXT = 'text';
export const MESSAGE_TYPE_IMAGE = 'images';
export const MESSAGE_TYPE_FILE = 'file';
export const MESSAGE_TYPE_SYSTEM = 'info';

// Content field names
export const MESSAGE_CONTENT_TEXT_FIELD = 'text';
export const MESSAGE_CONTENT_URL_FIELD = 'url';
export const MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD = 'thumbnailUrl';
export const MESSAGE_CONTENT_FILE_NAME_FIELD = 'name';
export const MESSAGE_CONTENT_FILE_SIZE_FIELD = 'size';

/**
 * Other constants
 */
export const MESSAGE_UNIT = 48;
export const FILE_UNIT = 13;
export const LARGE_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const EMOJI_LIST = ['👍', '✅', '❤️', '👀'];

/**
 * Localization strings
 */
export const FIRECHAT_LOCALE = {
    NO_MESSAGES: '메시지가 없습니다.',
    IMAGE: '사진',
    FILE: '파일',
    UNKNOWN: '(알 수 없음)',
    NO_CHANNEL_SELECTED: '채팅방이 선택되지 않았습니다.',
    ME: '나',
    HOST: '방장',
    REPLYING_TO: (name: string) => `${name}에게 답장`,
    REPLY: '답장',
    COPY: '복사',
    COPIED: '복사됨',
    NO_IMAGES: '이미지가 없습니다.',
    NO_FILES: '파일이 없습니다.',
    UNDO: '실행 취소',
    CANCEL: '취소',

    SIDEBAR: {
        PARTICIPANTS: '멤버',
        NO_PARTICIPANTS: '멤버가 없습니다.',
        INVITE_PARTICIPANTS: '신규 멤버 초대하기',

        MORE: '전체보기',

        INVITE_PARTICIPANTS_DESCRIPTION:
            '초대할 사용자의 이름 또는 이메일을 입력하세요.',
        SEARCH_USER_PLACEHOLDER: '이름 또는 이메일로 찾기',
        SEARCH_BUTTON: '검색',
        NO_USERS_FOUND: '사용자를 찾을 수 없습니다.',
        INVITE_BUTTON: '초대',
        USER_INVITED: '사용자를 초대했습니다.',

        REMOVE_PARTICIPANT: (name: string) =>
            `${name}님을 채팅방에서 내보내시겠습니까?`,
        PARTICIPANT_REMOVED: (name: string) =>
            `${name}님을 채팅방에서 내보냈습니다.`,
        REMOVE_USER_CONFIRMATION_TITLE: '사용자 내보내기',
        REMOVE_USER_BUTTON: '내보내기',
        REMOVE_USER_SUCCESS: '사용자를 채팅방에서 내보냈습니다.',
    },
    MESSAGE: {
        DOWNLOAD_ALL_IMAGE: '모든 사진 전체 저장',
        DOWNLOAD_ONE_IMAGE: '이 사진만 저장',
        SIZE: '용량',
        CLICK_TO_REMOVE: '클릭하여 삭제',
        CLICK_TO_ADD: '클릭하여 추가',
    },
    FOOTER: {
        INPUT_PLACEHOLDER: '메시지 입력',
        REPLY_MESSAGE: '답장 쓰기',
        SEND: '전송',
        UPLOAD_FILES: '파일 전송',

        REMOVE_FILE: '파일 삭제',
        DRAG_DROP_TO_UPLOAD: '여기에 파일을 끌어다 놓으세요',
    },
};

export type FcMessageType =
    | typeof MESSAGE_TYPE_TEXT
    | typeof MESSAGE_TYPE_IMAGE
    | typeof MESSAGE_TYPE_FILE
    | typeof MESSAGE_TYPE_SYSTEM;

export interface FcMessageText {
    [MESSAGE_TYPE_FIELD]: typeof MESSAGE_TYPE_TEXT;
    [MESSAGE_CONTENT_TEXT_FIELD]: string;
}

export interface FcMessageImage {
    [MESSAGE_TYPE_FIELD]: typeof MESSAGE_TYPE_IMAGE;
    [MESSAGE_CONTENT_URL_FIELD]: string;
    [MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD]?: string;
}

export interface FcMessageFile {
    [MESSAGE_TYPE_FIELD]: typeof MESSAGE_TYPE_FILE;
    [MESSAGE_CONTENT_URL_FIELD]: string;
    [MESSAGE_CONTENT_FILE_NAME_FIELD]?: string;
    [MESSAGE_CONTENT_FILE_SIZE_FIELD]?: number;
}

export interface FcMessageSystem {
    [MESSAGE_TYPE_FIELD]: typeof MESSAGE_TYPE_SYSTEM;
    [MESSAGE_CONTENT_TEXT_FIELD]: string;
}

export type FcMessageContent =
    | FcMessageText
    | FcMessageImage
    | FcMessageFile
    | FcMessageSystem;

export interface FcMessage<T extends FcMessageContent> {
    [MESSAGE_ID_FIELD]: string;
    [MESSAGE_USER_ID_FIELD]: string;
    [MESSAGE_REPLY_FIELD]?: FcMessage<T> | null;
    [MESSAGE_TYPE_FIELD]: FcMessageType;
    [MESSAGE_CONTENTS_FIELD]: T[];
    [MESSAGE_CREATED_AT_FIELD]: Timestamp;
    [MESSAGE_REACTIONS_FIELD]?: { [emoji: string]: string[] }; // emoji to userIds
}
