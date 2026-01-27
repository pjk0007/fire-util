import { useRef, useCallback, useState } from 'react';
import type { IAnnotationElement } from '../types';
import { createPencilElement, createPencilPreview } from '../utils/elementFactory';

interface PencilDrawingState {
    isDrawing: boolean;
    startX: number;
    startY: number;
    path: { x: number; y: number }[];
}

const INITIAL_STATE: PencilDrawingState = {
    isDrawing: false,
    startX: 0,
    startY: 0,
    path: [],
};

interface UsePencilToolOptions {
    activeColor: string;
    onElementCreated: (element: IAnnotationElement) => void;
}

export interface UsePencilToolReturn {
    isDrawing: boolean;
    previewElement: IAnnotationElement | null;
    startPencil: (x: number, y: number) => void;
    updatePencil: (x: number, y: number) => void;
    finishPencil: () => void;
    cancelPencil: () => void;
}

/**
 * 펜슬 그리기 도구 상태 관리 훅
 */
export function usePencilTool({
    activeColor,
    onElementCreated,
}: UsePencilToolOptions): UsePencilToolReturn {
    const stateRef = useRef<PencilDrawingState>(INITIAL_STATE);
    const [previewElement, setPreviewElement] = useState<IAnnotationElement | null>(null);

    const startPencil = useCallback(
        (x: number, y: number) => {
            stateRef.current = {
                isDrawing: true,
                startX: x,
                startY: y,
                path: [{ x, y }],
            };
            setPreviewElement(createPencilPreview(x, y, [{ x, y }], activeColor));
        },
        [activeColor]
    );

    const updatePencil = useCallback(
        (x: number, y: number) => {
            if (!stateRef.current.isDrawing) return;

            stateRef.current.path.push({ x, y });
            setPreviewElement(
                createPencilPreview(
                    stateRef.current.startX,
                    stateRef.current.startY,
                    [...stateRef.current.path],
                    activeColor
                )
            );
        },
        [activeColor]
    );

    const finishPencil = useCallback(() => {
        if (!stateRef.current.isDrawing) return;

        const { path } = stateRef.current;
        if (path.length >= 2) {
            const element = createPencilElement(path, activeColor);
            onElementCreated(element);
        }

        stateRef.current = { ...INITIAL_STATE, path: [] };
        setPreviewElement(null);
    }, [activeColor, onElementCreated]);

    const cancelPencil = useCallback(() => {
        stateRef.current = { ...INITIAL_STATE, path: [] };
        setPreviewElement(null);
    }, []);

    return {
        isDrawing: stateRef.current.isDrawing,
        previewElement,
        startPencil,
        updatePencil,
        finishPencil,
        cancelPencil,
    };
}
