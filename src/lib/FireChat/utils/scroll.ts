import { findVisibleChild } from '@/lib/FireChat/utils/findVisibleChild';

export function getScrollState(ref: Element | null) {
    if (!ref) return { scrollHeight: 0, scrollTop: 0 };
    return {
        scrollHeight: ref.scrollHeight,
        scrollTop: ref.scrollTop,
    };
}

export function restoreScrollPosition(
    ref: Element | null,
    prevScrollHeight: number,
    prevScrollTop: number
) {
    if (!ref) return;
    const newScrollHeight = ref.scrollHeight;
    const newScrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
    ref.scrollTo(0, newScrollTop);
}

export function scrollToBottom(ref: Element | null, smooth = true) {
    if (!ref) return;
    ref.scrollTo({
        top: ref.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
    });
}

export function isScrollAtBottom(ref: Element | null, threshold = 200) {
    if (!ref) return false;
    return ref.scrollHeight - ref.scrollTop - ref.clientHeight < threshold;
}

export function isScrollAtTop(ref: Element | null, threshold = 2000) {
    if (!ref) return false;
    return ref.scrollTop < threshold;
}

export function getScrollDate(ref: Element | null) {
    if (!ref) return undefined;
    const element = findVisibleChild(ref);
    if (!element) return undefined;
    const { seconds } = element.dataset;
    if (seconds) {
        return new Date(Number(seconds) * 1000).toLocaleDateString();
    }
    return undefined;
}
