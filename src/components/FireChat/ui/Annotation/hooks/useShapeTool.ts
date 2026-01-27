import { useRef, useCallback, useState } from 'react';
import type { IAnnotationElement } from '../types';
import { createShapeElement, createShapePreview } from '../utils/elementFactory';

const MIN_DRAG_DISTANCE_PX = 5;
const MIN_ELEMENT_SIZE = 0.02;

interface ShapeDrawingState {
    isDrawing: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    startScreenX: number;
    startScreenY: number;
    hasMoved: boolean;
}

const INITIAL_STATE: ShapeDrawingState = {
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startScreenX: 0,
    startScreenY: 0,
    hasMoved: false,
};

interface UseShapeToolOptions {
    activeColor: string;
    onElementCreated: (element: IAnnotationElement) => void;
}

export interface UseShapeToolReturn {
    isDrawing: boolean;
    previewElement: IAnnotationElement | null;
    startShape: (tool: 'rect' | 'circle', x: number, y: number, screenX: number, screenY: number) => void;
    updateShape: (tool: 'rect' | 'circle', x: number, y: number, screenX: number, screenY: number) => void;
    finishShape: (tool: 'rect' | 'circle') => void;
    cancelShape: () => void;
}

/**
 * 도형(rect, circle) 그리기 도구 상태 관리 훅
 */
export function useShapeTool({
    activeColor,
    onElementCreated,
}: UseShapeToolOptions): UseShapeToolReturn {
    const stateRef = useRef<ShapeDrawingState>(INITIAL_STATE);
    const [previewElement, setPreviewElement] = useState<IAnnotationElement | null>(null);

    const startShape = useCallback(
        (tool: 'rect' | 'circle', x: number, y: number, screenX: number, screenY: number) => {
            stateRef.current = {
                isDrawing: true,
                startX: x,
                startY: y,
                currentX: x,
                currentY: y,
                startScreenX: screenX,
                startScreenY: screenY,
                hasMoved: false,
            };
        },
        []
    );

    const updateShape = useCallback(
        (tool: 'rect' | 'circle', x: number, y: number, screenX: number, screenY: number) => {
            if (!stateRef.current.isDrawing) return;

            const screenDx = Math.abs(screenX - stateRef.current.startScreenX);
            const screenDy = Math.abs(screenY - stateRef.current.startScreenY);

            if (screenDx > MIN_DRAG_DISTANCE_PX || screenDy > MIN_DRAG_DISTANCE_PX) {
                stateRef.current.hasMoved = true;
            }

            stateRef.current.currentX = x;
            stateRef.current.currentY = y;

            if (stateRef.current.hasMoved) {
                setPreviewElement(
                    createShapePreview(
                        tool,
                        stateRef.current.startX,
                        stateRef.current.startY,
                        x,
                        y,
                        activeColor
                    )
                );
            }
        },
        [activeColor]
    );

    const finishShape = useCallback(
        (tool: 'rect' | 'circle') => {
            if (!stateRef.current.isDrawing) return;

            const { startX, startY, currentX, currentY, hasMoved } = stateRef.current;

            if (hasMoved) {
                const dx = Math.abs(currentX - startX);
                const dy = Math.abs(currentY - startY);

                if (dx > MIN_ELEMENT_SIZE || dy > MIN_ELEMENT_SIZE) {
                    const element = createShapeElement(tool, startX, startY, currentX, currentY, activeColor);
                    onElementCreated(element);
                }
            }

            stateRef.current = { ...INITIAL_STATE };
            setPreviewElement(null);
        },
        [activeColor, onElementCreated]
    );

    const cancelShape = useCallback(() => {
        stateRef.current = { ...INITIAL_STATE };
        setPreviewElement(null);
    }, []);

    return {
        isDrawing: stateRef.current.isDrawing,
        previewElement,
        startShape,
        updateShape,
        finishShape,
        cancelShape,
    };
}
