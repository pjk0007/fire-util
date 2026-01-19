// Firestore collection names
export const SURVEY_TEMPLATES_COLLECTION = 'surveyTemplates';
export const SURVEY_RESPONSES_COLLECTION = 'surveyResponses';

// Template field names (Template = 질문 1개)
export const TEMPLATE_ID_FIELD = 'id';
export const TEMPLATE_TITLE_FIELD = 'title';
export const TEMPLATE_DESCRIPTION_FIELD = 'description';
export const TEMPLATE_TYPE_FIELD = 'type';
export const TEMPLATE_IS_REQUIRED_FIELD = 'isRequired';
export const TEMPLATE_OPTIONS_FIELD = 'options';
export const TEMPLATE_RATING_CONFIG_FIELD = 'ratingConfig';
export const TEMPLATE_TARGET_TYPES_FIELD = 'targetTypes';
export const TEMPLATE_IS_ACTIVE_FIELD = 'isActive';
export const TEMPLATE_ORDER_FIELD = 'order';
export const TEMPLATE_CREATED_BY_FIELD = 'createdBy';
export const TEMPLATE_CREATED_AT_FIELD = 'createdAt';
export const TEMPLATE_UPDATED_AT_FIELD = 'updatedAt';
export const TEMPLATE_ALLOW_OTHER_FIELD = 'allowOther';

// Response field names
export const RESPONSE_ID_FIELD = 'id';
export const RESPONSE_TEMPLATE_ID_FIELD = 'templateId';
export const RESPONSE_TEMPLATE_TITLE_FIELD = 'templateTitle';
export const RESPONSE_SURVEY_TYPE_FIELD = 'surveyType';
export const RESPONSE_USER_ID_FIELD = 'userId';
export const RESPONSE_USER_NAME_FIELD = 'userName';
export const RESPONSE_USER_EMAIL_FIELD = 'userEmail';
export const RESPONSE_ANSWER_FIELD = 'answer';
export const RESPONSE_SUBMITTED_AT_FIELD = 'submittedAt';
export const RESPONSE_CREATED_AT_FIELD = 'createdAt';

// Question types
export const QUESTION_TYPE_TEXT = 'text' as const;
export const QUESTION_TYPE_DROPDOWN = 'dropdown' as const;
export const QUESTION_TYPE_CHECKBOX = 'checkbox' as const;
export const QUESTION_TYPE_RADIO = 'radio' as const;
export const QUESTION_TYPE_RATING = 'rating' as const;

export const QUESTION_TYPES = [
    QUESTION_TYPE_TEXT,
    QUESTION_TYPE_DROPDOWN,
    QUESTION_TYPE_CHECKBOX,
    QUESTION_TYPE_RADIO,
    QUESTION_TYPE_RATING,
] as const;

// Survey types (기존 호환)
export const SURVEY_TYPE_PROPOSAL = 'proposal' as const;
export const SURVEY_TYPE_TEST = 'test' as const;
export const SURVEY_TYPE_PROCEED = 'proceed' as const;

export const SURVEY_TYPES = [
    SURVEY_TYPE_PROPOSAL,
    SURVEY_TYPE_TEST,
    SURVEY_TYPE_PROCEED,
] as const;

// Default values
export const DEFAULT_RATING_MIN = 1;
export const DEFAULT_RATING_MAX = 5;

// Config - 프로젝트별 수정 가능
export const FIRE_SURVEY_CONFIG = {
    SURVEY_PATH: '/admin/fire-survey',
    TEMPLATES_TAB: 'templates',
    RESPONSES_TAB: 'responses',
};

// Localization strings
export const FIRE_SURVEY_LOCALE = {
    TITLE: '설문 관리',

    TABS: {
        TEMPLATES: '설문 항목',
        RESPONSES: '응답 결과',
    },

    TEMPLATE: {
        NEW: '새 설문 항목',
        EDIT: '설문 항목 편집',
        DELETE: '설문 항목 삭제',
        TITLE_PLACEHOLDER: '질문을 입력하세요',
        DESCRIPTION_PLACEHOLDER: '질문 설명 (선택)',
        TARGET_TYPES: '대상 사용자 타입',
        IS_ACTIVE: '활성화',
        IS_REQUIRED: '필수 응답',
        TYPE: '질문 유형',
        EMPTY: '등록된 설문 항목이 없습니다.',
        CREATE_FIRST: '첫 번째 설문 항목을 만들어보세요.',
    },

    QUESTION_TYPES: {
        [QUESTION_TYPE_TEXT]: '텍스트 입력',
        [QUESTION_TYPE_DROPDOWN]: '드롭다운',
        [QUESTION_TYPE_CHECKBOX]: '체크박스 (다중 선택)',
        [QUESTION_TYPE_RADIO]: '라디오 버튼 (단일 선택)',
        [QUESTION_TYPE_RATING]: '평점 (5점 척도)',
    },

    SURVEY_TYPES: {
        [SURVEY_TYPE_PROPOSAL]: '신청서 제출',
        [SURVEY_TYPE_TEST]: '3일 테스트',
        [SURVEY_TYPE_PROCEED]: '구독 중',
    },

    OPTIONS: {
        TITLE: '선택지',
        ADD: '선택지 추가',
        PLACEHOLDER: '선택지 입력',
        MIN_REQUIRED: '선택지를 2개 이상 입력해주세요.',
    },

    RATING: {
        MIN_LABEL: '매우 불만족',
        MAX_LABEL: '매우 만족',
    },

    RESPONSE: {
        TITLE: '응답 결과',
        EMPTY: '아직 응답이 없습니다.',
        FILTER_TEMPLATE: '설문 항목',
        FILTER_TYPE: '설문 타입',
        FILTER_DATE: '기간',
        ALL: '전체',
        DETAIL: '응답 상세',
        EXPORT: '내보내기',
        VIEW_RESPONSES: '응답 보기',
        TOTAL_RESPONSES: (count: number) => `총 ${count}건`,
    },

    STATS: {
        TITLE: '응답 통계',
        TOTAL_RESPONSES: '총 응답 수',
        AVG_RATING: '평균 평점',
        RESPONSE_RATE: '응답률',
        BY_CHOICE: '선택지별 분포',
        BY_RATING: '평점 분포',
    },

    TABLE: {
        USER: '응답자',
        EMAIL: '이메일',
        SURVEY_TYPE: '설문 타입',
        SUBMITTED_AT: '제출일',
        ACTIONS: '작업',
    },

    BUTTONS: {
        CREATE: '만들기',
        SAVE: '저장',
        CANCEL: '취소',
        DELETE: '삭제',
        EDIT: '수정',
        CLOSE: '닫기',
        ADD: '추가',
        REMOVE: '제거',
    },

    ERRORS: {
        CREATE_FAILED: '생성에 실패했습니다.',
        UPDATE_FAILED: '수정에 실패했습니다.',
        DELETE_FAILED: '삭제에 실패했습니다.',
        LOAD_FAILED: '데이터 로딩에 실패했습니다.',
        SUBMIT_FAILED: '제출에 실패했습니다.',
        REQUIRED_TITLE: '질문을 입력해주세요.',
        REQUIRED_TARGET_TYPE: '대상 타입을 선택해주세요.',
        REQUIRED_QUESTION_TYPE: '질문 유형을 선택해주세요.',
        REQUIRED_OPTIONS: '선택지를 2개 이상 추가해주세요.',
    },

    SUCCESS: {
        CREATED: '생성되었습니다.',
        UPDATED: '수정되었습니다.',
        DELETED: '삭제되었습니다.',
        RESPONSE_SUBMITTED: '설문이 제출되었습니다.',
    },

    CONFIRM: {
        DELETE_TEMPLATE: (title: string) => `"${title}" 항목을 삭제하시겠습니까?`,
        DELETE_TEMPLATE_WARNING: '이 항목에 대한 기존 응답 데이터는 유지됩니다.',
    },
};
