import { UTM_PARAMS, UTMData } from '@/components/FireTracker/settings';

/**
 * URL에서 UTM 파라미터 파싱
 */
export function parseUTMParams(url?: string): UTMData {
    const searchParams = new URLSearchParams(
        url ?? (typeof window !== 'undefined' ? window.location.search : '')
    );

    const utm: UTMData = {};

    for (const param of UTM_PARAMS) {
        const value = searchParams.get(param);
        if (value) {
            utm[param] = value;
        }
    }

    return utm;
}

/**
 * UTM 파라미터가 있는지 확인
 */
export function hasUTMParams(utm: UTMData): boolean {
    return Object.keys(utm).length > 0;
}
