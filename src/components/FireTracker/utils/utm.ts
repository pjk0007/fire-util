import { UTM_PARAMS, UTMData } from '@/components/FireTracker/settings';

// 무시할 시스템 파라미터 (UTM 외에 수집하지 않을 것들)
const IGNORED_PARAMS = [
    'fbclid', // Facebook
    'gclid', // Google Ads
    'gclsrc',
    'dclid',
    'msclkid', // Microsoft Ads
    '_ga', // Google Analytics
    '_gl',
] as const;

interface ParsedParams {
    utm: UTMData;
    customParams: Record<string, string> | null;
}

/**
 * URL에서 UTM 파라미터와 커스텀 파라미터 파싱
 */
export function parseURLParams(url?: string): ParsedParams {
    const searchParams = new URLSearchParams(
        url ?? (typeof window !== 'undefined' ? window.location.search : '')
    );

    const utm: UTMData = {};
    const customParams: Record<string, string> = {};

    searchParams.forEach((value, key) => {
        // UTM 파라미터
        if ((UTM_PARAMS as readonly string[]).includes(key)) {
            utm[key as keyof UTMData] = value;
        }
        // 무시할 파라미터는 스킵
        else if ((IGNORED_PARAMS as readonly string[]).includes(key)) {
            return;
        }
        // 나머지는 커스텀 파라미터
        else {
            customParams[key] = value;
        }
    });

    return {
        utm,
        customParams: Object.keys(customParams).length > 0 ? customParams : null,
    };
}

/**
 * URL에서 UTM 파라미터만 파싱 (하위 호환성)
 */
export function parseUTMParams(url?: string): UTMData {
    return parseURLParams(url).utm;
}

/**
 * UTM 파라미터가 있는지 확인
 */
export function hasUTMParams(utm: UTMData): boolean {
    return Object.keys(utm).length > 0;
}
