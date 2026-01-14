// Firestore collection and field names
export const DRIVE_COLLECTION = 'drive';

export const DRIVE_ID_FIELD = 'id';
export const DRIVE_NAME_FIELD = 'name';
export const DRIVE_TYPE_FIELD = 'type';
export const DRIVE_PARENT_ID_FIELD = 'parentId';
export const DRIVE_STORAGE_PATH_FIELD = 'storagePath';
export const DRIVE_SIZE_FIELD = 'size';
export const DRIVE_MIME_TYPE_FIELD = 'mimeType';
export const DRIVE_CREATED_BY_FIELD = 'createdBy';
export const DRIVE_CREATED_AT_FIELD = 'createdAt';
export const DRIVE_UPDATED_AT_FIELD = 'updatedAt';

// Item types
export const DRIVE_TYPE_FOLDER = 'folder';
export const DRIVE_TYPE_FILE = 'file';

// Constants
// 최대 파일 크기 제한 (500MB)
export const MAX_FILE_SIZE = 500 * 1024 * 1024;
export const ROOT_FOLDER_ID = null;
// 최대 폴더 깊이 제한 (순환 참조 방지)
export const MAX_FOLDER_DEPTH = 50;

// Config - 프로젝트별로 수정 가능
export const FIRE_DRIVE_CONFIG = {
    CHAT_PATH: '/admin/chat',
    CHAT_CHANNEL_PARAM: 'matchId',
    DRIVE_PATH: '/admin/drive',
    DRIVE_CHANNEL_PARAM: 'channelId',
    DRIVE_FOLDER_PARAM: 'folderId',
    DRIVE_FILE_PARAM: 'fileId',
};

// Localization strings
export const FIRE_DRIVE_LOCALE = {
    TITLE: '파일 저장소',
    NEW_FOLDER: '새 폴더',
    UPLOAD_FILE: '파일 업로드',
    UPLOAD_FILES: '파일 업로드',

    ROOT_FOLDER: '홈',
    EMPTY_FOLDER: '이 폴더는 비어 있습니다.',
    DRAG_DROP_HINT: '파일을 여기에 끌어다 놓으세요.',

    ACTIONS: {
        OPEN: '열기',
        DOWNLOAD: '다운로드',
        RENAME: '이름 변경',
        MOVE: '이동',
        DELETE: '삭제',
        COPY_LINK: '링크 복사',
        PREVIEW: '미리보기',
        GO_TO_CHAT: '채팅방',
        GO_TO_CHAT_TITLE: '채팅방으로 이동',
        COPY_URL: '주소 복사',
        SHARE_TO_CHAT: '채팅방에 공유',
    },

    DIALOG: {
        NEW_FOLDER_TITLE: '새 폴더 만들기',
        NEW_FOLDER_PLACEHOLDER: '폴더 이름',
        NEW_FOLDER_DEFAULT_NAME: '새 폴더',

        RENAME_TITLE: '이름 변경',
        RENAME_PLACEHOLDER: '새 이름',

        MOVE_TITLE: '이동',
        MOVE_DESCRIPTION: '이동할 폴더를 선택하세요.',
        MOVE_ITEM_DESCRIPTION: (name: string) => `"${name}" 항목을 이동합니다.`,
        MOVE_ITEMS_DESCRIPTION: (count: number) =>
            `${count}개 항목을 이동합니다.`,
        MOVE_HERE: '여기로 이동',
        MOVE_BACK: '이전',
        MOVE_EMPTY_FOLDER: '폴더가 비어 있습니다.',

        DELETE_TITLE: '삭제',
        DELETE_FILE_CONFIRM: (name: string) =>
            `"${name}" 파일을 삭제하시겠습니까?`,
        DELETE_FOLDER_CONFIRM: (name: string) =>
            `"${name}" 폴더와 그 안의 모든 파일을 삭제하시겠습니까?`,
        DELETE_WARNING: '이 작업은 되돌릴 수 없습니다.',
        DELETE_MULTIPLE_CONFIRM: (count: number) =>
            `선택한 ${count}개의 항목을 삭제하시겠습니까?`,
    },

    BUTTONS: {
        CREATE: '만들기',
        CANCEL: '취소',
        SAVE: '저장',
        DELETE: '삭제',
        MOVE: '이동',
        CLOSE: '닫기',
    },

    UPLOAD: {
        UPLOADING: '업로드 중...',
        UPLOAD_COMPLETE: '업로드 완료',
        UPLOAD_FAILED: '업로드 실패',
        FILE_TOO_LARGE: (maxSize: string) =>
            `파일 크기가 ${maxSize}를 초과합니다.`,
        PROGRESS: (percent: number) => `${percent}% 완료`,
        CLEAR_COMPLETED: '완료된 항목 지우기',
    },

    ERRORS: {
        FOLDER_EXISTS: '같은 이름의 폴더가 이미 존재합니다.',
        FILE_EXISTS: '같은 이름의 파일이 이미 존재합니다.',
        INVALID_NAME: '유효하지 않은 이름입니다.',
        UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
        DELETE_FAILED: '삭제에 실패했습니다.',
        DELETE_PARTIAL_FAILED: (success: number, failed: number) =>
            `삭제: ${success}개 성공, ${failed}개 실패`,
        MOVE_FAILED: '이동에 실패했습니다.',
        MOVE_PARTIAL_FAILED: (success: number, failed: number) =>
            `이동: ${success}개 성공, ${failed}개 실패`,
        IMAGE_LOAD_FAILED: '이미지를 불러올 수 없습니다.',
        PDF_LOAD_FAILED: 'PDF를 불러올 수 없습니다.',
        FILE_LOAD_FAILED: '파일을 불러올 수 없습니다.',
        DOWNLOAD_FAILED: '다운로드에 실패했습니다.',
        DOWNLOAD_PARTIAL_FAILED: (success: number, failed: number) =>
            `다운로드: ${success}개 성공, ${failed}개 실패`,
        CREATE_FOLDER_FAILED: '폴더 생성에 실패했습니다.',
        RENAME_FAILED: '이름 변경에 실패했습니다.',
        FOLDER_CHECK_FAILED: '폴더 구조 확인에 실패했습니다.',
        COPY_URL_FAILED: '주소 복사에 실패했습니다.',
        SHARE_FAILED: '공유에 실패했습니다.',
    },

    SUCCESS: {
        URL_COPIED: '주소가 복사되었습니다.',
        SHARED_TO_CHAT: '채팅방에 공유되었습니다.',
    },

    VIEW: {
        GRID: '그리드 보기',
        LIST: '리스트 보기',
    },

    SORT: {
        NAME: '이름',
        DATE: '날짜',
        SIZE: '크기',
        TYPE: '유형',
    },

    SELECTION: {
        SELECTED: (count: number) => `${count}개 선택됨`,
        SELECT_ALL: '전체 선택',
        DESELECT_ALL: '선택 해제',
    },

    PREVIEW: {
        TITLE: '미리보기',
        UNSUPPORTED: '미리보기를 지원하지 않는 파일 형식입니다.',
        LOADING: '로딩 중...',
        OPEN_IN_NEW_TAB: '새 탭에서 열기',
        DOWNLOAD_TO_OPEN: '다운로드하여 열기',
    },

    FILE_TYPES: {
        FILE: '파일',
        IMAGE: '이미지',
        PDF: 'PDF 문서',
        VIDEO: '동영상',
        AUDIO: '오디오',
        SPREADSHEET: '스프레드시트',
        DOCUMENT: '문서',
        PRESENTATION: '프레젠테이션',
    },

    FILE_INFO: {
        TITLE: '파일 세부정보',
        TYPE: '종류',
        SIZE: '크기',
        CREATED_AT: '생성일',
        MIME_TYPE: 'MIME 타입',
    },

    CONTEXT_MENU: {
        DOWNLOAD_FILES: (count: number) => `${count}개 파일 다운로드`,
        MOVE_ITEMS: (count: number) => `${count}개 항목 이동`,
        DELETE_ITEMS: (count: number) => `${count}개 항목 삭제`,
        ITEMS_SELECTED: (count: number) => `${count}개 항목 선택됨`,
    },

    BOTTOM_SHEET: {
        SELECT_ACTION: '작업 선택',
    },

    DRAG: {
        ITEMS: (count: number) => `${count}개 항목`,
    },
};
