import { useState, useCallback, useRef, useEffect, RefObject } from 'react';
import { FireDriveItem } from '../settings';

interface SelectionBox {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

interface UseFireDriveSelectionBoxOptions {
    items: FireDriveItem[];
    selectedItems: FireDriveItem[];
    setSelectedItems: (items: FireDriveItem[]) => void;
    clearSelection: () => void;
}

/**
 * 드래그 선택 박스 로직을 처리하는 훅
 */
export default function useFireDriveSelectionBox({
    items,
    selectedItems,
    setSelectedItems,
    clearSelection,
}: UseFireDriveSelectionBoxOptions) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
    const isSelectingRef = useRef(false);
    const startPointRef = useRef<{ x: number; y: number } | null>(null);
    const initialSelectedRef = useRef<FireDriveItem[]>([]);
    const rafRef = useRef<number | null>(null);
    const shiftKeyRef = useRef(false);
    const hasDraggedRef = useRef(false);

    // 아이템 요소들의 위치를 캐싱
    const itemRectsRef = useRef<Map<string, DOMRect>>(new Map());

    const cacheItemRects = useCallback(() => {
        if (!containerRef.current) return;
        const elements = containerRef.current.querySelectorAll('[data-item-id]');
        const containerRect = containerRef.current.getBoundingClientRect();

        itemRectsRef.current.clear();
        elements.forEach((element) => {
            const id = element.getAttribute('data-item-id');
            if (id) {
                const rect = element.getBoundingClientRect();
                // 컨테이너 기준 상대 좌표로 저장
                itemRectsRef.current.set(id, new DOMRect(
                    rect.left - containerRect.left,
                    rect.top - containerRect.top,
                    rect.width,
                    rect.height
                ));
            }
        });
    }, []);

    const getSelectedItemsInBox = useCallback(
        (box: SelectionBox) => {
            const boxLeft = Math.min(box.startX, box.endX);
            const boxRight = Math.max(box.startX, box.endX);
            const boxTop = Math.min(box.startY, box.endY);
            const boxBottom = Math.max(box.startY, box.endY);

            const selectedIds: string[] = [];

            itemRectsRef.current.forEach((rect, id) => {
                const overlaps =
                    boxLeft < rect.right &&
                    boxRight > rect.left &&
                    boxTop < rect.bottom &&
                    boxBottom > rect.top;

                if (overlaps) {
                    selectedIds.push(id);
                }
            });

            return items.filter((item) => selectedIds.includes(item.id));
        },
        [items]
    );

    const updateSelection = useCallback((box: SelectionBox) => {
        const newSelectedItems = getSelectedItemsInBox(box);

        if (shiftKeyRef.current) {
            // Shift 키: 초기 선택에 추가
            const merged = [...initialSelectedRef.current];
            newSelectedItems.forEach((item) => {
                if (!merged.find((i) => i.id === item.id)) {
                    merged.push(item);
                }
            });
            setSelectedItems(merged);
        } else {
            setSelectedItems(newSelectedItems);
        }
    }, [getSelectedItemsInBox, setSelectedItems]);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            // 아이템 위에서 시작하면 선택 박스 시작 안함
            const target = e.target as HTMLElement;
            if (target.closest('[data-item-id]')) return;

            // 우클릭은 무시
            if (e.button !== 0) return;

            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            const startX = e.clientX - containerRect.left;
            const startY = e.clientY - containerRect.top;

            // 아이템 위치 캐싱
            cacheItemRects();

            startPointRef.current = { x: startX, y: startY };
            isSelectingRef.current = true;
            shiftKeyRef.current = e.shiftKey;
            hasDraggedRef.current = false;
            initialSelectedRef.current = e.shiftKey ? [...selectedItems] : [];

            setSelectionBox({
                startX,
                startY,
                endX: startX,
                endY: startY,
            });
        },
        [cacheItemRects, selectedItems]
    );

    // 전역 마우스 이벤트 처리 (컨테이너 밖으로 나가도 계속 동작)
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isSelectingRef.current || !startPointRef.current) return;

            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) return;

            const endX = e.clientX - containerRect.left;
            const endY = e.clientY - containerRect.top;

            const newBox = {
                startX: startPointRef.current.x,
                startY: startPointRef.current.y,
                endX,
                endY,
            };

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                setSelectionBox(newBox);
                updateSelection(newBox);
                hasDraggedRef.current = true;
            });
        };

        const handleGlobalMouseUp = () => {
            if (isSelectingRef.current) {
                // 드래그 없이 클릭만 했으면 선택 해제
                if (!hasDraggedRef.current && !shiftKeyRef.current) {
                    clearSelection();
                }

                isSelectingRef.current = false;
                startPointRef.current = null;
                hasDraggedRef.current = false;

                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }

                setSelectionBox(null);
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [updateSelection, clearSelection]);

    // 선택 박스 스타일 계산
    const boxStyle = selectionBox ? {
        left: Math.min(selectionBox.startX, selectionBox.endX),
        top: Math.min(selectionBox.startY, selectionBox.endY),
        width: Math.abs(selectionBox.endX - selectionBox.startX),
        height: Math.abs(selectionBox.endY - selectionBox.startY),
    } : undefined;

    return {
        containerRef,
        selectionBox,
        boxStyle,
        handleMouseDown,
    };
}
