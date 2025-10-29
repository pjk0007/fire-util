import { useEffect, useRef, useState } from 'react';
import { FireDoc } from '@/lib/FireEditor/settings';
import { useSelection } from '@/lib/FireEditor/hooks/useSelection';

export type UseSelectionToolbarOptions = {
    debounceMs?: number;
};

export function useSelectionToolbar(
    editableRef: React.RefObject<HTMLElement | null>,
    docState?: FireDoc,
    opts?: UseSelectionToolbarOptions
) {
    const debounceMs = opts?.debounceMs ?? 120;
    const {
        save: saveSelection,
        getSelectionRect,
    } = useSelection();

    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const isPointerDownRef = useRef(false);
    const pendingRectRef = useRef<DOMRect | null>(null);
    const pendingSelectingRef = useRef<boolean>(false);
    const selectionTimerRef = useRef<number | null>(null);
    console.log(selectionRect);

    // 선택 영역 변경 감지
    useEffect(() => {
        function onSelectionChange() {
            const el = editableRef.current;
            if (!el) return;
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) {
                pendingRectRef.current = null;
                pendingSelectingRef.current = false;
                if (selectionTimerRef.current) {
                    window.clearTimeout(selectionTimerRef.current);
                    selectionTimerRef.current = null;
                }
                setSelectionRect(null);
                setIsSelecting(false);
                return;
            }
            const range = sel.getRangeAt(0);
            if (!el.contains(range.commonAncestorContainer)) {
                pendingRectRef.current = null;
                pendingSelectingRef.current = false;
                setSelectionRect(null);
                setIsSelecting(false);
                return;
            }
            try {
                saveSelection(el, range);
                const rect = getSelectionRect();
                const selecting = !sel.isCollapsed;

                if (isPointerDownRef.current) {
                    pendingRectRef.current = rect;
                    pendingSelectingRef.current = selecting;
                    if (selectionTimerRef.current) {
                        window.clearTimeout(selectionTimerRef.current);
                        selectionTimerRef.current = null;
                    }
                } else {
                    if (selectionTimerRef.current)
                        window.clearTimeout(selectionTimerRef.current);
                    selectionTimerRef.current = window.setTimeout(() => {
                        setSelectionRect(rect);
                        setIsSelecting(selecting);
                        selectionTimerRef.current = null;
                    }, debounceMs);
                }
            } catch (e) {
                console.log('Failed to handle selection change:', e);
                // ignore
            }
        }

        document.addEventListener('selectionchange', onSelectionChange);
        return () =>
            document.removeEventListener('selectionchange', onSelectionChange);
    }, [editableRef, getSelectionRect, saveSelection, debounceMs]);

    // docState 변경 시 선택 영역 복원
    // useEffect(() => {
    //     const el = editableRef.current;
    //     if (!el) return;
    //     try {
    //         restoreSelection(el);
    //     } catch (e) {
    //         // ignore
    //     }
    // }, [docState, restoreSelection, editableRef]);

    // 드래그 중 선택 영역 업데이트
    useEffect(() => {
        const el = editableRef.current;
        if (!el) return;

        function onPointerDown() {
            isPointerDownRef.current = true;
            setSelectionRect(null);
            setIsSelecting(false);
            if (selectionTimerRef.current) {
                window.clearTimeout(selectionTimerRef.current);
                selectionTimerRef.current = null;
            }
        }

        function flushPendingSelection() {
            isPointerDownRef.current = false;
            if (pendingRectRef.current && pendingSelectingRef.current) {
                setSelectionRect(pendingRectRef.current);
                setIsSelecting(true);
            } else {
                setSelectionRect(null);
                setIsSelecting(false);
            }
            pendingRectRef.current = null;
            pendingSelectingRef.current = false;
        }

        function onPointerUp() {
            window.requestAnimationFrame(() => flushPendingSelection());
        }

        el.addEventListener('mousedown', onPointerDown);
        document.addEventListener('mouseup', onPointerUp);
        el.addEventListener('touchstart', onPointerDown, { passive: true });
        document.addEventListener('touchend', onPointerUp);

        return () => {
            el.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('mouseup', onPointerUp);
            el.removeEventListener(
                'touchstart',
                onPointerDown as EventListener
            );
            document.removeEventListener(
                'touchend',
                onPointerUp as EventListener
            );
        };
    }, [editableRef]);

    return {
        selectionRect,
        isSelecting,
    };
}

export default useSelectionToolbar;
