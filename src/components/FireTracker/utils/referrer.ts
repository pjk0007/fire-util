import {
    SEARCH_ENGINES,
    SOCIAL_PLATFORMS,
    TRAFFIC_SOURCES,
    TrafficSource,
} from '@/components/FireTracker/settings';

/**
 * Referrer에서 도메인 추출
 */
export function extractDomain(referrer: string): string | null {
    if (!referrer) return null;

    try {
        const url = new URL(referrer);
        return url.hostname.replace('www.', '');
    } catch {
        return null;
    }
}

/**
 * 도메인이 검색엔진인지 확인
 */
export function isSearchEngine(domain: string): boolean {
    return SEARCH_ENGINES.some((engine) => domain.includes(engine));
}

/**
 * 도메인이 소셜 플랫폼인지 확인
 */
export function isSocialPlatform(domain: string): boolean {
    return SOCIAL_PLATFORMS.some((platform) => domain.includes(platform));
}

/**
 * 트래픽 소스 분류
 */
export function classifyTrafficSource(
    referrer: string | null,
    utmMedium?: string
): TrafficSource {
    // UTM medium이 있으면 우선 사용
    if (utmMedium) {
        const medium = utmMedium.toLowerCase();
        if (medium === 'cpc' || medium === 'ppc' || medium === 'paid') {
            return TRAFFIC_SOURCES.PAID;
        }
        if (medium === 'organic') {
            return TRAFFIC_SOURCES.ORGANIC;
        }
        if (medium === 'social') {
            return TRAFFIC_SOURCES.SOCIAL;
        }
        if (medium === 'email') {
            return TRAFFIC_SOURCES.EMAIL;
        }
        if (medium === 'referral') {
            return TRAFFIC_SOURCES.REFERRAL;
        }
    }

    // Referrer가 없으면 직접 유입
    if (!referrer) {
        return TRAFFIC_SOURCES.DIRECT;
    }

    const domain = extractDomain(referrer);
    if (!domain) {
        return TRAFFIC_SOURCES.DIRECT;
    }

    // 같은 도메인이면 직접 유입으로 처리
    if (typeof window !== 'undefined') {
        const currentDomain = window.location.hostname.replace('www.', '');
        if (domain === currentDomain) {
            return TRAFFIC_SOURCES.DIRECT;
        }
    }

    // 검색엔진
    if (isSearchEngine(domain)) {
        return TRAFFIC_SOURCES.ORGANIC;
    }

    // 소셜 플랫폼
    if (isSocialPlatform(domain)) {
        return TRAFFIC_SOURCES.SOCIAL;
    }

    // 그 외는 레퍼럴
    return TRAFFIC_SOURCES.REFERRAL;
}

/**
 * 현재 페이지의 referrer 정보 가져오기
 */
export function getReferrerInfo(): {
    referrer: string | null;
    referrerDomain: string | null;
} {
    if (typeof window === 'undefined') {
        return { referrer: null, referrerDomain: null };
    }

    const referrer = document.referrer || null;
    const referrerDomain = referrer ? extractDomain(referrer) : null;

    return { referrer, referrerDomain };
}
