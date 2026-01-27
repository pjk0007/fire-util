import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

interface ImageNavigatorProps {
    current: number;
    total: number;
    onPrevious: () => void;
    onNext: () => void;
}

/**
 * 이미지 네비게이션 컴포넌트
 */
export default function ImageNavigator({
    current,
    total,
    onPrevious,
    onNext,
}: ImageNavigatorProps) {
    if (total <= 1) return null;

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                onClick={onPrevious}
                disabled={current === 0}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                onClick={onNext}
                disabled={current === total - 1}
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
            <Badge className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl">
                <ImageIcon className="w-3 h-3 mr-1" />
                {current + 1} / {total}
            </Badge>
        </>
    );
}
