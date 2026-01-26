import { useCallback } from 'react';
import type { DrawingTool, IAnnotationElement } from '../types';
import { useToolState } from './useToolState';
import { usePencilTool } from './usePencilTool';
import { useShapeTool } from './useShapeTool';
import { useTextTool, type TextInputState } from './useTextTool';

interface UseDrawingToolOptions {
    onElementCreated: (element: IAnnotationElement) => void;
}

interface UseDrawingToolReturn {
    activeTool: DrawingTool | null;
    setActiveTool: (tool: DrawingTool | null) => void;
    activeColor: string;
    setActiveColor: (color: string) => void;
    isDrawing: boolean;
    previewElement: IAnnotationElement | null;
    handleMouseDown: (x: number, y: number, screenX: number, screenY: number) => void;
    handleMouseMove: (x: number, y: number, screenX: number, screenY: number) => void;
    handleMouseUp: () => void;
    cancelDrawing: () => void;
    textInput: TextInputState;
    submitTextInput: (text: string) => void;
    cancelTextInput: () => void;
}

export { type TextInputState };

/**
 * 그리기 도구 상태 관리 훅
 * pencil, text, rect, circle 도구만 지원
 */
export function useDrawingTool({
    onElementCreated,
}: UseDrawingToolOptions): UseDrawingToolReturn {
    const { activeTool, setActiveTool, activeColor, setActiveColor } = useToolState();

    const pencilTool = usePencilTool({ activeColor, onElementCreated });
    const shapeTool = useShapeTool({ activeColor, onElementCreated });
    const textTool = useTextTool({ activeColor, onElementCreated });

    const handleMouseDown = useCallback(
        (x: number, y: number, screenX: number, screenY: number) => {
            if (!activeTool) return;

            if (activeTool === 'text') {
                textTool.activateTextInput(x, y, screenX, screenY);
                return;
            }

            if (activeTool === 'pencil') {
                pencilTool.startPencil(x, y);
                return;
            }

            if (activeTool === 'rect' || activeTool === 'circle') {
                shapeTool.startShape(activeTool, x, y, screenX, screenY);
            }
        },
        [activeTool, pencilTool, shapeTool, textTool]
    );

    const handleMouseMove = useCallback(
        (x: number, y: number, screenX: number, screenY: number) => {
            if (!activeTool) return;

            if (activeTool === 'pencil') {
                pencilTool.updatePencil(x, y);
                return;
            }

            if (activeTool === 'rect' || activeTool === 'circle') {
                shapeTool.updateShape(activeTool, x, y, screenX, screenY);
            }
        },
        [activeTool, pencilTool, shapeTool]
    );

    const handleMouseUp = useCallback(() => {
        if (!activeTool || activeTool === 'text') return;

        if (activeTool === 'pencil') {
            pencilTool.finishPencil();
            return;
        }

        if (activeTool === 'rect' || activeTool === 'circle') {
            shapeTool.finishShape(activeTool);
        }
    }, [activeTool, pencilTool, shapeTool]);

    const cancelDrawing = useCallback(() => {
        pencilTool.cancelPencil();
        shapeTool.cancelShape();
    }, [pencilTool, shapeTool]);

    // 현재 활성화된 도구의 preview element 반환
    const previewElement = pencilTool.previewElement || shapeTool.previewElement;
    const isDrawing = pencilTool.isDrawing || shapeTool.isDrawing;

    return {
        activeTool,
        setActiveTool,
        activeColor,
        setActiveColor,
        isDrawing,
        previewElement,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        cancelDrawing,
        textInput: textTool.textInput,
        submitTextInput: textTool.submitTextInput,
        cancelTextInput: textTool.cancelTextInput,
    };
}
