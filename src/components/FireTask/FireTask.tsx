import {
    FireTaskSidebar,
    useFireTaskSidebar,
} from '@/components/FireProvider/FireTaskSidebarProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { FIRE_TASK_LOCALE } from '@/lib/FireTask/settings';
import FireTaskClassAddNew from '@/components/FireTask/FireTaskClass/FireTaskClassAddNew';
import FireTaskMain from '@/components/FireTask/FireTaskMain';

export default function FireTask() {
    const { isOpen, isExpanded } = useFireTaskSidebar();
    const isMobile = useIsMobile();

    return (
        <FireTaskSidebar>
            {!isOpen && !isMobile && (
                <div className="mt-2">
                    <FireTaskClassAddNew size={'large'} />
                </div>
            )}
            {!isOpen && isMobile && (
                <div className="text-xs flex text-center mt-2 font-semibold">
                    {FIRE_TASK_LOCALE.TASK_LIST}
                </div>
            )}
            {isOpen && (
                <FireTaskMain dir={isMobile || !isExpanded ? 'col' : 'row'} />
            )}
        </FireTaskSidebar>
    );
}
