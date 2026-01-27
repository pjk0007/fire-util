import { Button } from '@/components/ui/button';
import { ANNOTATION_LOCALE } from '../settings';

interface DialogControlsProps {
    hasElements: boolean;
    isCapturing: boolean;
    onClear: () => void;
    onCancel: () => void;
    onComplete: () => void;
}

/**
 * 다이얼로그 하단 컨트롤 버튼 컴포넌트
 */
export default function DialogControls({
    hasElements,
    isCapturing,
    onClear,
    onCancel,
    onComplete,
}: DialogControlsProps) {
    return (
        <div className="px-4 py-3 border-t flex justify-between items-center shrink-0">
            <Button variant="ghost" onClick={onClear} disabled={!hasElements}>
                {ANNOTATION_LOCALE.BTN_CLEAR}
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                    {ANNOTATION_LOCALE.BTN_CANCEL}
                </Button>
                <Button onClick={onComplete} disabled={isCapturing}>
                    {isCapturing ? ANNOTATION_LOCALE.BTN_PROCESSING : ANNOTATION_LOCALE.BTN_COMPLETE}
                </Button>
            </div>
        </div>
    );
}
