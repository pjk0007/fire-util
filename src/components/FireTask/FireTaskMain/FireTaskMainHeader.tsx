import FireTaskAddNew from '@/components/FireTask/FireTaskAddNew';
import { TASK_MAIN_HEADER_HEIGHT } from '@/components/FireTask/FireTaskMain';
import { TASK_LOCALE } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';

export default function FireTaskMainHeader() {
    return (
        <div
            className={cn('flex items-center gap-2 md:px-2 px-2')}
            style={{ height: TASK_MAIN_HEADER_HEIGHT }}
        >
            <span
                className={cn(
                    'font-semibold md:text-left  text-center'
                )}
            >
                {TASK_LOCALE.TASK_LIST}
            </span>
            <FireTaskAddNew size={'small'} />
        </div>
    );
}
