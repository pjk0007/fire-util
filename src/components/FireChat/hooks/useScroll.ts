import {
    getScrollDate,
    isScrollAtBottom,
    isScrollAtTop,
} from '@/components/FireChat/utils/scroll';
import { useLayoutEffect, useRef, useState } from 'react';

export default function useScroll() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isTop, setIsTop] = useState(false);
    const [isBottom, setIsBottom] = useState(true);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [scrollDate, setScrollDate] = useState<string>();

    useLayoutEffect(() => {
        if (!scrollAreaRef.current) return;

        const viewport = scrollAreaRef.current?.querySelector(
            '[data-slot="scroll-area-viewport"]'
        );
        if (!viewport) return;

        const onScroll = () => {
            if (!viewport) return;

            setIsScrolling(true);

            setIsTop(isScrollAtTop(viewport));
            setIsBottom(isScrollAtBottom(viewport));

            setScrollDate(getScrollDate(viewport));

            // 기존 타이머가 있으면 clear
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            // 새로운 타이머 등록
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
                scrollTimeoutRef.current = null;
            }, 1000);
        };

        viewport.addEventListener('scroll', onScroll);

        return () => {
            viewport.removeEventListener('scroll', onScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollAreaRef.current]);

    return {
        scrollAreaRef,
        isScrolling,
        scrollDate,
        isTop,
        isBottom,
    };
}
