import FireTaskMainBody from '@/components/FireTask/FireTaskMain/FireTaskMainBody';
import FireTaskMainHeader from '@/components/FireTask/FireTaskMain/FireTaskMainHeader';
import { ScrollBar } from '@/components/ui/scroll-area';

export const TASK_MAIN_HEADER_HEIGHT = 40;

interface FireTaskMainProps {
    dir: 'col' | 'row';
}

export default function FireTaskMain({ dir }: FireTaskMainProps) {
    return (
        <div className="w-full h-full flex flex-col">
            <FireTaskMainHeader />
            <FireTaskMainBody dir={dir} />
        </div>
    );
}
