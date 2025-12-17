import { DeviceInfo } from '@/components/FireTracker/settings';

/**
 * User Agent로 모바일 여부 확인
 */
export function checkIsMobile(userAgent: string): boolean {
    return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
    );
}

/**
 * User Agent로 태블릿 여부 확인
 */
export function checkIsTablet(userAgent: string): boolean {
    return /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);
}

/**
 * 현재 디바이스 정보 수집
 */
export function getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
        return {
            userAgent: '',
            language: '',
            platform: '',
            screenWidth: 0,
            screenHeight: 0,
            isMobile: false,
            isTablet: false,
        };
    }

    const userAgent = navigator.userAgent;

    return {
        userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        isMobile: checkIsMobile(userAgent),
        isTablet: checkIsTablet(userAgent),
    };
}
