import { Timestamp } from 'firebase/firestore';
import {
    QUESTION_TYPES,
    SURVEY_TYPES,
    DEFAULT_RATING_MIN,
    DEFAULT_RATING_MAX,
} from './constants';

// Question Type
export type QuestionType = (typeof QUESTION_TYPES)[number];

// Survey Type (기존 호환)
export type SurveyType = (typeof SURVEY_TYPES)[number];

// Rating Configuration
export interface RatingConfig {
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
}

export const DEFAULT_RATING_CONFIG: RatingConfig = {
    min: DEFAULT_RATING_MIN,
    max: DEFAULT_RATING_MAX,
    minLabel: '매우 불만족',
    maxLabel: '매우 만족',
};

// Survey Option (for dropdown, checkbox, radio)
export interface SurveyOption {
    label: string;
    order: number;
}

// Survey Template = 질문 1개 (문서 1개 = 질문 1개)
export interface SurveyTemplate {
    id: string;
    // 질문 내용
    title: string;
    description?: string;
    type: QuestionType;
    isRequired: boolean;
    options?: SurveyOption[];      // dropdown, checkbox, radio용
    ratingConfig?: RatingConfig;   // rating용
    allowOther?: boolean;          // "기타" 옵션 허용 여부 (checkbox, radio용)
    // 메타 정보
    targetTypes: SurveyType[];
    isActive: boolean;
    order: number;
    createdBy: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Survey Answer (단일 질문에 대한 응답)
export interface SurveyAnswer {
    templateId: string;
    templateTitle: string;
    questionType: QuestionType;
    value: string | string[] | number;
    otherValue?: string;   // "기타" 선택 시 입력값
}

// Survey Response (한 유저의 한 질문에 대한 응답)
export interface SurveyResponse {
    id: string;
    templateId: string;
    templateTitle: string;
    surveyType: SurveyType;
    userId: string;
    userName?: string;
    userEmail?: string;
    answer: SurveyAnswer;
    submittedAt: Timestamp;
    createdAt: Timestamp;
}

// Form types for creating/editing
export interface SurveyTemplateFormData {
    title: string;
    description?: string;
    type: QuestionType;
    isRequired: boolean;
    targetTypes: SurveyType[];
    isActive: boolean;
    options?: string[];           // 옵션 라벨들
    ratingConfig?: RatingConfig;
    allowOther?: boolean;         // "기타" 옵션 허용 여부
}

// Stats types
export interface OptionStats {
    label: string;
    count: number;
    percentage: number;
}

export interface RatingDistribution {
    rating: number;
    count: number;
    percentage: number;
}

export interface TemplateStats {
    templateId: string;
    templateTitle: string;
    questionType: QuestionType;
    totalResponses: number;
    // For choice questions (dropdown, checkbox, radio)
    optionCounts?: OptionStats[];
    // For rating questions
    averageRating?: number;
    ratingDistribution?: RatingDistribution[];
    // For text questions
    textResponses?: string[];
}

// Filter types
export interface ResponseFilters {
    templateId?: string;
    surveyType?: SurveyType;
    startDate?: Date;
    endDate?: Date;
}

// Tab type
export type FireSurveyTab = 'templates' | 'responses';
