// Firestore Collection Names
export const TRACKER_SESSION_COLLECTION = 'tracker_sessions';
export const TRACKER_EVENT_COLLECTION = 'tracker_events';

// UTM Parameter Keys
export const UTM_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
] as const;

// Session Configuration
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30분
export const SESSION_STORAGE_KEY = 'fire_tracker_session';
export const VISITOR_ID_STORAGE_KEY = 'fire_tracker_visitor_id';

// Event Types
export const EVENT_TYPES = {
    PAGE_VIEW: 'page_view',
    SESSION_START: 'session_start',
    SESSION_END: 'session_end',
    CLICK: 'click',
    FORM_SUBMIT: 'form_submit',
    PURCHASE: 'purchase',
    SECTION_VIEW: 'section_view',
    CUSTOM: 'custom',
} as const;

// Traffic Sources
export const TRAFFIC_SOURCES = {
    DIRECT: 'direct',
    ORGANIC: 'organic',
    PAID: 'paid',
    SOCIAL: 'social',
    REFERRAL: 'referral',
    EMAIL: 'email',
    UNKNOWN: 'unknown',
} as const;

// Known Referrer Domains
export const SEARCH_ENGINES = [
    'google',
    'naver',
    'daum',
    'bing',
    'yahoo',
    'duckduckgo',
] as const;

export const SOCIAL_PLATFORMS = [
    'facebook',
    'instagram',
    'twitter',
    'linkedin',
    'youtube',
    'tiktok',
    'kakaotalk',
] as const;
