import { useState, useCallback, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useDrawingTool } from './hooks';
import type { IAnnotationElement } from './types';
import AnnotationCanvas from './AnnotationCanvas';
import AnnotationToolbar from './AnnotationToolbar';
import TextInputOverlay from './components/TextInputOverlay';
import ImageNavigator from './components/ImageNavigator';
import DialogControls from './components/DialogControls';
import { captureAnnotatedImage } from './utils/captureAnnotation';
import { ANNOTATION_LOCALE } from './settings';

interface AnnotationViewDialogProps {
    children?: React.ReactNode;
    dialogTitle?: string;
    defaultIdx: number;
    images: string[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onComplete?: (imageBlob: Blob) => void;
}

/**
 * 이미지 어노테이션 다이얼로그
 * 선 그리기, 텍스트, 사각형, 원 도구만 지원
 */
export default function AnnotationViewDialog({
    children,
    dialogTitle = ANNOTATION_LOCALE.DIALOG_TITLE,
    defaultIdx,
    images,
    open: controlledOpen,
    onOpenChange,
    onComplete,
}: AnnotationViewDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;
    const setOpen = isControlled ? onOpenChange! : setInternalOpen;
    const [current, setCurrent] = useState(defaultIdx);

    const [elements, setElements] = useState<IAnnotationElement[]>([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const imageAreaRef = useRef<HTMLDivElement>(null);

    const handleElementCreated = useCallback((element: IAnnotationElement) => {
        setElements((prev) => [...prev, element]);
    }, []);

    const {
        activeTool,
        setActiveTool,
        activeColor,
        setActiveColor,
        previewElement,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        textInput,
        submitTextInput,
        cancelTextInput,
    } = useDrawingTool({ onElementCreated: handleElementCreated });

    useEffect(() => {
        setCurrent(defaultIdx);
    }, [defaultIdx]);

    useEffect(() => {
        if (open) {
            setElements([]);
            setActiveTool(null);
        }
    }, [open, setActiveTool]);

    const goToPrevious = useCallback(() => {
        setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
        setElements([]);
    }, []);

    const goToNext = useCallback(() => {
        setCurrent((prev) => (prev < images.length - 1 ? prev + 1 : prev));
        setElements([]);
    }, [images.length]);

    const handleClear = useCallback(() => {
        setElements([]);
    }, []);

    const handleComplete = useCallback(async () => {
        if (!onComplete) return;

        setIsCapturing(true);
        try {
            const blob = await captureAnnotatedImage(images[current], elements);
            onComplete(blob);
            setOpen(false);
        } catch (error) {
            console.error('Failed to capture image:', error);
        } finally {
            setIsCapturing(false);
        }
    }, [onComplete, setOpen, images, current, elements]);

    const handleCancel = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const localAnnotations = elements.length > 0
        ? [{ id: 'local', elements }]
        : [];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="max-w-[95vw] sm:max-w-[90vw] h-[90vh] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-4 py-3 border-b shrink-0">
                    <DialogTitle className="text-sm">{dialogTitle}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden min-h-0">
                    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                        <div className="p-2 border-b flex justify-center shrink-0">
                            <AnnotationToolbar
                                activeTool={activeTool}
                                onToolChange={setActiveTool}
                                activeColor={activeColor}
                                onColorChange={setActiveColor}
                            />
                        </div>

                        <div ref={imageAreaRef} className="flex-1 relative overflow-auto min-h-0 group">
                            <AnnotationCanvas
                                imageUrl={images[current]}
                                annotations={localAnnotations}
                                activeTool={activeTool}
                                previewElement={previewElement}
                                selectedAnnotationId={null}
                                onSelectAnnotation={() => {}}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                            />

                            <TextInputOverlay
                                textInput={textInput}
                                activeColor={activeColor}
                                containerRef={imageAreaRef}
                                onSubmit={submitTextInput}
                                onCancel={cancelTextInput}
                            />

                            <ImageNavigator
                                current={current}
                                total={images.length}
                                onPrevious={goToPrevious}
                                onNext={goToNext}
                            />
                        </div>

                        <DialogControls
                            hasElements={elements.length > 0}
                            isCapturing={isCapturing}
                            onClear={handleClear}
                            onCancel={handleCancel}
                            onComplete={handleComplete}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
