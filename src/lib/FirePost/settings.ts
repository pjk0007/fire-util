import { Timestamp } from 'firebase/firestore';
import { Content } from '@tiptap/react';

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

export const POST_TYPES = [POST_TYPE_NOTICE, POST_TYPE_FAQ] as const;

export const POST_SHOW_TYPE_ALL = 'all';
export const POST_SHOW_TYPE_CLIENT = 'client';
export const POST_SHOW_TYPE_PARTNER = 'partner';

export const POST_SHOW_TYPES = [
    POST_SHOW_TYPE_ALL,
    POST_SHOW_TYPE_CLIENT,
    POST_SHOW_TYPE_PARTNER,
] as const;

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
    CREATE_POST_BUTTON: '게시글 작성',
    PAGINATION: (total: number, currentPage: number, totalPages: number) =>
        `총 ${total}개 (${currentPage} / ${totalPages} 페이지)`,
    BACK_BUTTON: '뒤로',
    SAVE_BUTTON: '저장',
    SAVE_SUCCESS: '게시글이 성공적으로 저장되었습니다.',
    SAVE_FAILED: '게시글 저장에 실패했습니다.',
    DELETE_BUTTON: '삭제',
    DELETE_TITLE: '게시글 삭제',
    DELETE_DESCRIPTION: '게시글을 삭제하시겠습니까?',
    DELETE_SUCCESS: '게시글이 성공적으로 삭제되었습니다.',
    DELETE_FAILED: '게시글 삭제에 실패했습니다.',
    CONFIRM_BUTTON: '확인',
    CANCEL_BUTTON: '취소',
    NEED_TITLE: '제목을 입력해주세요.',
    TITLE_PLACEHOLDER: '제목을 입력하세요',
    TYPE_LABEL: '게시글 유형',
    TYPE: {
        [POST_TYPE_NOTICE]: '공지사항',
        [POST_TYPE_FAQ]: 'FAQ',
    },
    SHOW_TYPE_LABEL: '게시글 공개 범위',
    SHOW_TYPE: {
        [POST_SHOW_TYPE_ALL]: '전체',
        [POST_SHOW_TYPE_CLIENT]: '기업',
        [POST_SHOW_TYPE_PARTNER]: '파트너',
    },
};

/**
 * Type definitions
 */
export type PostType = (typeof POST_TYPES)[number];
export type PostShowType = (typeof POST_SHOW_TYPES)[number];
export interface FirePost<U> {
    [POST_ID_FIELD]: string;
    [POST_TYPE_FIELD]: PostType;
    [POST_TITLE_FIELD]: string;
    [POST_CONTENT_FIELD]: Content;
    [POST_CREATED_AT_FIELD]: Timestamp;
    [POST_UPDATED_AT_FIELD]: Timestamp;
    [POST_USER_FIELD]: U;
    [POST_SHOW_TYPE_FIELD]: PostShowType;
    [POST_VIEWS_FIELD]: number;
    [POST_IS_SECRET_FIELD]?: boolean;
    [POST_IS_PINNED_FIELD]?: boolean;
}
