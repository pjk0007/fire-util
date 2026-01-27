import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import type { TextInputState } from '../hooks/useTextTool';
import { ANNOTATION_LOCALE } from '../settings';

interface TextInputOverlayProps {
    textInput: TextInputState;
    activeColor: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
    onSubmit: (text: string) => void;
    onCancel: () => void;
}

/**
 * 텍스트 입력 오버레이 컴포넌트
 */
export default function TextInputOverlay({
    textInput,
    activeColor,
    containerRef,
    onSubmit,
    onCancel,
}: TextInputOverlayProps) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (textInput.isActive) {
            setValue('');
            const focusInput = () => inputRef.current?.focus();
            focusInput();
            setTimeout(focusInput, 10);
            setTimeout(focusInput, 50);
        }
    }, [textInput.isActive]);

    const handleSubmit = useCallback(() => {
        onSubmit(value);
        setValue('');
    }, [onSubmit, value]);

    const handleCancel = useCallback(() => {
        onCancel();
        setValue('');
    }, [onCancel]);

    if (!textInput.isActive) return null;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const left = textInput.screenX - (containerRect?.left ?? 0);
    const top = textInput.screenY - (containerRect?.top ?? 0);

    return (
        <div
            className="absolute z-50 flex items-center gap-1"
            style={{ left, top }}
        >
            <div className="flex items-center gap-1 bg-white rounded shadow-lg border-2 border-blue-500 px-2 py-1">
                <div
                    className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: activeColor }}
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') handleSubmit();
                        else if (e.key === 'Escape') handleCancel();
                    }}
                    className="bg-transparent outline-none text-black"
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        minWidth: '100px',
                    }}
                    autoFocus
                    placeholder={ANNOTATION_LOCALE.TEXT_PLACEHOLDER}
                />
            </div>
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/90 shadow-lg hover:bg-green-100"
                onClick={handleSubmit}
                disabled={!value.trim()}
            >
                <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/90 shadow-lg hover:bg-red-100"
                onClick={handleCancel}
            >
                <X className="w-4 h-4 text-red-600" />
            </Button>
        </div>
    );
}
