import { findVisibleChild } from '@/lib/FireChat/utils/findVisibleChild';
import { useLayoutEffect, useRef, useState } from 'react';

export default function useScroll() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isBottom, setIsBottom] = useState(true);
    const [isTop, setIsTop] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);
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

            getSetScrollDate(viewport);

            // 기존 타이머가 있으면 clear
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            // 새로운 타이머 등록
            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
                scrollTimeoutRef.current = null;
            }, 1000);

            setIsBottom(
                viewport.scrollHeight - viewport.scrollTop <=
                    viewport.clientHeight + 200
            );
            setIsTop(viewport.scrollTop === 0);
        };

        viewport.addEventListener('scroll', onScroll);

        return () => {
            viewport.removeEventListener('scroll', onScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [scrollAreaRef.current]);

    // 1. 현재 스크롤 상태 저장
    function getScrollState() {
        const viewport = scrollAreaRef.current?.querySelector(
            '[data-slot="scroll-area-viewport"]'
        );
        if (!viewport) return { scrollHeight: 0, scrollTop: 0 };
        return {
            scrollHeight: viewport.scrollHeight,
            scrollTop: viewport.scrollTop,
        };
    }

    // 2. 스크롤 위치 복원
    function restoreScrollState(prev: {
        scrollHeight: number;
        scrollTop: number;
    }) {
        const viewport = scrollAreaRef.current?.querySelector(
            '[data-slot="scroll-area-viewport"]'
        );
        if (!viewport) return;
        const diff = viewport.scrollHeight - prev.scrollHeight;

        viewport.scrollTo({
            top: prev.scrollTop + diff,
            behavior: 'auto',
        });
    }

    function scrollToBottom(smooth: boolean = false) {
        const viewport = scrollAreaRef.current?.querySelector(
            '[data-slot="scroll-area-viewport"]'
        );
        if (!viewport) {
            return;
        }

        viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto',
        });
    }

    const getSetScrollDate = (scrollDiv: Element) => {
        const element = findVisibleChild(scrollDiv);

        if (element) {
            const { seconds } = element.dataset;

            if (seconds) {
                setScrollDate(
                    new Date(Number(seconds) * 1000).toLocaleDateString()
                );
            }
        } else {
            setScrollDate(undefined);
        }
    };

    return {
        scrollAreaRef,
        isBottom,
        scrollToBottom,
        isTop,
        restoreScrollState,
        getScrollState,
        isScrolling,
        scrollDate,
    };
}
