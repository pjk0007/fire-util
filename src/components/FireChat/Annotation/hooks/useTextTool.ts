import { useState, useCallback } from 'react';
import type { IAnnotationElement } from '../types';
import { createTextElement } from '../utils/elementFactory';

export interface TextInputState {
    isActive: boolean;
    x: number; // 상대 좌표 (0-1)
    y: number; // 상대 좌표 (0-1)
    screenX: number; // 화면 좌표
    screenY: number; // 화면 좌표
}

const INITIAL_TEXT_INPUT: TextInputState = {
    isActive: false,
    x: 0,
    y: 0,
    screenX: 0,
    screenY: 0,
};

interface UseTextToolOptions {
    activeColor: string;
    onElementCreated: (element: IAnnotationElement) => void;
}

export interface UseTextToolReturn {
    textInput: TextInputState;
    activateTextInput: (x: number, y: number, screenX: number, screenY: number) => void;
    submitTextInput: (text: string) => void;
    cancelTextInput: () => void;
}

/**
 * 텍스트 도구 상태 관리 훅
 */
export function useTextTool({
    activeColor,
    onElementCreated,
}: UseTextToolOptions): UseTextToolReturn {
    const [textInput, setTextInput] = useState<TextInputState>(INITIAL_TEXT_INPUT);

    const activateTextInput = useCallback(
        (x: number, y: number, screenX: number, screenY: number) => {
            setTextInput({ isActive: true, x, y, screenX, screenY });
        },
        []
    );

    const submitTextInput = useCallback(
        (text: string) => {
            if (text.trim() && textInput.isActive) {
                const element = createTextElement(textInput.x, textInput.y, text.trim(), activeColor);
                onElementCreated(element);
            }
            setTextInput(INITIAL_TEXT_INPUT);
        },
        [textInput, activeColor, onElementCreated]
    );

    const cancelTextInput = useCallback(() => {
        setTextInput(INITIAL_TEXT_INPUT);
    }, []);

    return {
        textInput,
        activateTextInput,
        submitTextInput,
        cancelTextInput,
    };
}
