import { Timestamp } from 'firebase/firestore';

// Firestore collection and field names
export const POST_COLLECTION = 'posts';

export const POST_ID_FIELD = 'id';
export const POST_TYPE_FIELD = 'type';
export const POST_TITLE_FIELD = 'title';
export const POST_CONTENT_FIELD = 'content';
export const POST_CREATED_AT_FIELD = 'time';
export const POST_UPDATED_AT_FIELD = 'updatedAt';
export const POST_USER_FIELD = 'user';
export const POST_SHOW_TYPE_FIELD = 'showType';
export const POST_VIEWS_FIELD = 'viewCount';
export const POST_IS_SECRET_FIELD = 'isSecret';
export const POST_IS_PINNED_FIELD = 'isPinned';

export const POST_TYPE_NOTICE = 'notice';
export const POST_TYPE_FAQ = 'faq';

/**
 * Localization strings
 */
export const FIRE_POST_LOCALE = {
    POST_TITLE: '공지사항 & FAQ',
    TAB_NOTICE: '공지사항',
    TAB_FAQ: 'FAQ',
    EMPTY_NOTICE: '등록된 공지사항이 없습니다.',
    EMPTY_FAQ: '등록된 FAQ가 없습니다.',
    POST_SECRET: '비밀글입니다.',
    VIEW: '조회수',
    MORE_POST: '공지사항 더보기',
    PAGINATION: (total: number, currentPage: number, totalPages: number) =>
        `총 ${total}개 (${currentPage} / ${totalPages} 페이지)`,
};

/**
 * TypeScript interfaces and types
 */
export type PostType = 'notice' | 'faq';
export type PostShowType = 'all' | 'client' | 'partner';

export interface FirePost<U> {
    [POST_ID_FIELD]: string;
    [POST_TYPE_FIELD]: PostType;
    [POST_TITLE_FIELD]: string;
    [POST_CONTENT_FIELD]: string;
    [POST_CREATED_AT_FIELD]: Timestamp;
    [POST_UPDATED_AT_FIELD]: Timestamp;
    [POST_USER_FIELD]: U;
    [POST_SHOW_TYPE_FIELD]: PostShowType;
    [POST_VIEWS_FIELD]: number;
    [POST_IS_SECRET_FIELD]?: boolean;
    [POST_IS_PINNED_FIELD]?: boolean;
}
