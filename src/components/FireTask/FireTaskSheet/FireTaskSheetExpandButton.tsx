import { useIsMobile } from '@/hooks/use-mobile';
import { Minimize2, MoveDiagonal } from 'lucide-react';

export default function FireTaskSheetExpandButton({
    isExpanded,
    setIsExpanded,
}: {
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
}) {
    const isMobile = useIsMobile();
    if(isMobile) return null;
    if (!isExpanded) {
        return (
            <MoveDiagonal
                size={16}
                className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 left-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
                onClick={() => setIsExpanded(true)}
            />
        );
    } else {
        return (
            <Minimize2
                size={16}
                className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 left-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none rotate-180"
                onClick={() => setIsExpanded(false)}
            />
        );
    }
}
