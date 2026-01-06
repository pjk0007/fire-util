import { useRef, useCallback } from 'react';
import useTouchDevice from './useTouchDevice';

interface UseLongPressOptions {
    duration?: number;
    onLongPress: () => void;
}

/**
 * 롱프레스(길게 누르기) 감지 훅
 * 모바일에서만 동작하며, 터치 시작 후 지정된 시간이 지나면 콜백 실행
 */
export default function useLongPress({ duration = 500, onLongPress }: UseLongPressOptions) {
    const isTouch = useTouchDevice();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggered = useRef(false);

    const onTouchStart = useCallback((e?: React.TouchEvent) => {
        if (!isTouch) return;
        e?.stopPropagation?.();
        triggered.current = false;
        timerRef.current = setTimeout(() => {
            triggered.current = true;
            onLongPress();
        }, duration);
    }, [isTouch, duration, onLongPress]);

    const onTouchEnd = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const onTouchMove = useCallback(() => {
        // 터치 이동 시 롱프레스 취소
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const onContextMenu = useCallback((e: React.MouseEvent) => {
        // 모바일에서 브라우저 기본 컨텍스트 메뉴 방지
        if (isTouch) e.preventDefault();
    }, [isTouch]);

    return {
        triggered,
        isTouch,
        handlers: {
            onTouchStart,
            onTouchEnd,
            onTouchMove,
            onContextMenu,
        },
    };
}
