import { useState, useEffect } from 'react';

/**
 * 터치 디바이스 감지 훅
 * pointer: coarse = 터치스크린 (모바일/태블릿)
 * pointer: fine = 마우스/트랙패드 (데스크톱)
 */
export default function useTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        // 초기 감지
        const mediaQuery = window.matchMedia('(pointer: coarse)');
        setIsTouch(mediaQuery.matches);

        // 변경 감지 (태블릿에서 키보드/마우스 연결 시)
        const handler = (e: MediaQueryListEvent) => {
            setIsTouch(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return isTouch;
}
