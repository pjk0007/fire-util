import { useLayoutEffect, useRef, useState } from 'react';

export default function useScroll() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isBottom, setIsBottom] = useState(true);

    useLayoutEffect(() => {
        if (!scrollAreaRef.current) return;

        const viewport = scrollAreaRef.current?.querySelector(
            '[data-slot="scroll-area-viewport"]'
        );
        if (!viewport) return;
        viewport.addEventListener('scroll', (event) => {
            if (!viewport) return;
            setIsBottom(
                viewport.scrollHeight - viewport.scrollTop <=
                    viewport.clientHeight + 200
            );
        });

        return () => {
            if (!scrollAreaRef.current) return;
            scrollAreaRef.current.removeEventListener('scroll', () => {});
        };
    }, [scrollAreaRef.current]);

    function scrollToBottom(
        smooth: boolean = false,
        {
            afterScroll,
        }: {
            afterScroll?: () => void;
        } = {}
    ) {
        if (!scrollAreaRef.current) return;

        const viewport = scrollAreaRef.current?.querySelector(
            '[data-slot="scroll-area-viewport"]'
        );
        if (!viewport) return;

        setTimeout(() => {
            viewport.scrollTo({
                top: viewport.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            });
            afterScroll?.();
        }, 200);
    }

    return { scrollAreaRef, isBottom, scrollToBottom };
}
