import { useState } from 'react';
import type { DrawingTool } from '../types';
import { ANNOTATION_DEFAULT_COLOR } from '../settings';

export interface UseToolStateReturn {
    activeTool: DrawingTool | null;
    setActiveTool: (tool: DrawingTool | null) => void;
    activeColor: string;
    setActiveColor: (color: string) => void;
}

/**
 * 그리기 도구 및 색상 상태 관리 훅
 */
export function useToolState(): UseToolStateReturn {
    const [activeTool, setActiveTool] = useState<DrawingTool | null>(null);
    const [activeColor, setActiveColor] = useState(ANNOTATION_DEFAULT_COLOR);

    return {
        activeTool,
        setActiveTool,
        activeColor,
        setActiveColor,
    };
}
