import {
    FireTaskSidebar,
    TASK_SIDEBAR_WIDTH,
    useFireTaskSidebar,
} from '@/components/FireProvider/FireTaskSidebarProvider';
import FireTaskClass from '@/components/FireTask/FireTaskClass';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { TASK_LOCALE, TASK_STATUS_OPTIONS } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import FireTaskMainHeader from '@/components/FireTask/FireTaskMain/FireTaskMainHeader';
import FireTaskAddNew from '@/components/FireTask/FireTaskAddNew';
import FireTaskMain from '@/components/FireTask/FireTaskMain';

export default function FireTask() {
    const { isOpen, isExpanded } = useFireTaskSidebar();
    const isMobile = useIsMobile();

    return (
        <FireTaskSidebar>
            {!isOpen && !isMobile && (
                <div className="mt-2">
                    <FireTaskAddNew size={'large'} />
                </div>
            )}
            {!isOpen && isMobile && (
                <div className="text-xs flex text-center mt-2 font-semibold">
                    {TASK_LOCALE.TASK_LIST}
                </div>
            )}
            {isOpen && (
                <FireTaskMain dir={isMobile || !isExpanded ? 'col' : 'row'} />
            )}
        </FireTaskSidebar>
    );
}
