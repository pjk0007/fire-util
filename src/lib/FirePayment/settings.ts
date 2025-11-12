export const PAYMENT_DOC_PATH = (userId: string) =>
    `users/${userId}/metadata/payment`;
export const SELLER_DOC_PATH = (userId: string) =>
    `users/${userId}/metadata/seller`;

export const TOSS_CLIENT_KEY = process.env
    .NEXT_PUBLIC_TOSS_CLIENT_KEY as string;
export const TOSS_SECRET_KEY = process.env
    .NEXT_PUBLIC_TOSS_SECRET_KEY as string;
export const TOSS_ENCRYPT_KEY = process.env
    .NEXT_PUBLIC_TOSS_ENCRYPT_KEY as string;

/**
 * BANK LIST
 * 참고: https://docs.tosspayments.com/codes/org-codes#%EC%9D%80%ED%96%89-%EC%BD%94%EB%93%9C
 */
export const BANK_LIST: { code: string; name: string }[] = [
    { code: '039', name: '경남은행' },
    { code: '034', name: '광주은행' },
    { code: '012', name: '단위농협(지역농축협)' },
    { code: '032', name: '부산은행' },
    { code: '045', name: '새마을금고' },
    { code: '064', name: '산림조합' },
    { code: '088', name: '신한은행' },
    { code: '048', name: '신협' },
    { code: '027', name: '씨티은행' },
    { code: '020', name: '우리은행' },
    { code: '071', name: '우체국예금보험' },
    { code: '050', name: '저축은행중앙회' },
    { code: '037', name: '전북은행' },
    { code: '035', name: '제주은행' },
    { code: '090', name: '카카오뱅크' },
    { code: '089', name: '케이뱅크' },
    { code: '092', name: '토스뱅크' },
    { code: '081', name: '하나은행' },
    { code: '054', name: '홍콩상하이은행' },
    { code: '003', name: 'IBK기업은행' },
    { code: '004', name: 'KB국민은행' },
    { code: '031', name: 'iM뱅크(대구)' },
    { code: '002', name: '한국산업은행' },
    { code: '011', name: 'NH농협은행' },
    { code: '023', name: 'SC제일은행' },
    { code: '007', name: 'Sh수협은행' },
    { code: '030', name: '수협중앙회' },
];

/**
 * Localization strings
 */
export const FIRE_PAYMENT_LOCALE = {
    // payment method
    PAYMENT_METHOD_TITLE: '결제수단 관리',
    CHANGE_PAYMENT_METHOD: '결제수단 변경',
    ADD_PAYMENT_METHOD: '결제수단 추가',
    NO_PAYMENT_METHOD: '등록된 결제수단이 없습니다.',
    ERROR_FETCHING_PAYMENT_METHOD: '결제수단 조회 중 오류:',
    SUCCESS_MESSAGE: '결제수단이 성공적으로 등록되었습니다.',
    // seller
    SELLER_TITLE: '지급계좌 관리',
    CHANGE_SELLER: '지급계좌 변경',
    ADD_SELLER: '지급계좌 등록',
    NO_SELLER: '등록된 지급계좌가 없습니다.',
    ERROR_FETCHING_SELLER: '지급계좌 조회 중 오류:',
    SUCCESS_SELLER_MESSAGE: '지급계좌가 성공적으로 등록되었습니다.',
    // seller form
    SELLER_FORM: {
        TITLE: '지급계좌 등록',
        BUSINESS_TYPE: '사업자 유형',
        BUSINESS_TYPE_PLACEHOLDER: '사업자 유형 선택',
        INDIVIDUAL: '개인',
        INDIVIDUAL_BUSINESS: '개인사업자',
        CORPORATION: '법인사업자',
        INDIVIDUAL_INFO: '개인 정보',
        COMPANY_INFO: '회사 정보',
        NAME: '이름',
        NAME_PLACEHOLDER: '홍길동',
        EMAIL: '이메일',
        EMAIL_PLACEHOLDER: 'example@email.com',
        PHONE: '전화번호',
        PHONE_PLACEHOLDER: '01012345678',
        COMPANY_NAME: '회사명',
        COMPANY_NAME_PLACEHOLDER: '(주)회사명',
        REPRESENTATIVE_NAME: '대표자명',
        BUSINESS_REGISTRATION_NUMBER: '사업자등록번호',
        BUSINESS_REGISTRATION_NUMBER_PLACEHOLDER: '123-45-67890',
        COMPANY_EMAIL_PLACEHOLDER: 'company@email.com',
        COMPANY_PHONE_PLACEHOLDER: '02-1234-5678',
        SETTLEMENT_ACCOUNT: '정산 계좌',
        BANK: '은행',
        BANK_PLACEHOLDER: '은행 선택',
        ACCOUNT_NUMBER: '계좌번호',
        ACCOUNT_NUMBER_PLACEHOLDER: '123456789012',
        HOLDER_NAME: '예금주',
        SUBMITTING: '등록 중...',
        SUBMIT: '등록하기',
        UPDATE: '수정하기',
        LOGIN_REQUIRED: '로그인이 필요합니다.',
        REGISTRATION_ERROR: '등록 중 오류가 발생했습니다.',
    },
    // errors
    ERROR: {
        TITLE: '결제수단 오류',
        USER_CANCEL: '결제창이 닫혀 카드등록이 취소되었습니다.',
        INVALID_CARD_COMPANY:
            '유효하지 않은 카드사입니다. 다른 카드사로 시도해주세요.',
        UNKNOWN: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
    },
    STATUS: {
        APPROVAL_REQUIRED: '본인인증 필요',
        PARTIALLY_APPROVED: '지급 가능',
        KYC_REQUIRED: 'KYC 심사 필요',
        APPROVED: '지급 가능',
    },
};

export interface IFirePaymentMethod {
    authenticatedAt: string;
    billingKey: string;
    card: IFirePaymentMethodCard;
    cardCompany: string;
    cardNumber: string;
    customerKey: string;
    mId: string;
    method: string;
}

interface IFirePaymentMethodCard {
    acquirerCode: string;
    cardType: string;
    issuerCode: string;
    number: string;
    ownerType: string;
}

export interface IFireSeller {
    id: string;
    refSellerId: string;
    businessType: IFireSellerBusinessType;
    individual: IIndividual | null;
    company: ICompany | null;
    status: IFireSellerStatus;
    account: IAccount;
    metadata: {
        userId: string;
    };
}

type IFireSellerBusinessType =
    | 'INDIVIDUAL'
    | 'INDIVIDUAL_BUSINESS'
    | 'CORPORATION';

type IFireSellerStatus =
    | 'APPROVAL_REQUIRED'
    | 'PARTIALLY_APPROVED'
    | 'KYC_REQUIRED'
    | 'APPROVED';

export const FIRE_SELLER_STATUS_BACKGROUND_COLORS: {
    [key in IFireSellerStatus]: string;
} = {
    APPROVAL_REQUIRED: 'var(--color-red-100)',
    PARTIALLY_APPROVED: 'var(--color-blue-100)',
    KYC_REQUIRED: 'var(--color-red-100)',
    APPROVED: 'var(--color-blue-100)',
};
export const FIRE_SELLER_STATUS_TEXT_COLORS: {
    [key in IFireSellerStatus]: string;
} = {
    APPROVAL_REQUIRED: 'var(--color-red-500)',
    PARTIALLY_APPROVED: 'var(--color-blue-500)',
    KYC_REQUIRED: 'var(--color-red-500)',
    APPROVED: 'var(--color-blue-500)',
};

interface IIndividual {
    name: string;
    email: string;
    phone: string;
}

interface ICompany {
    name: string;
    representativeName: string;
    businessRegistrationNumber: string;
    email: string;
    phone: string;
}

export interface IAccount {
    bankCode: string;
    accountNumber: string;
    holderName: string;
}
