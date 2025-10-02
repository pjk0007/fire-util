import FireTaskClass from '@/components/FireTask/FireTaskClass';
import { TASK_MAIN_HEADER_HEIGHT } from '@/components/FireTask/FireTaskMain';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import { TASK_STATUS_OPTIONS } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';

interface FireTaskMainBodyProps {
    dir: 'col' | 'row';
}

export default function FireTaskMainBody({ dir }: FireTaskMainBodyProps) {
    return (
        <FireScrollArea
            style={{
                height: `calc(100% - ${TASK_MAIN_HEADER_HEIGHT}px)`,
            }}
            dir={dir}
        >
            <div
                className={cn('py-4  gap-2 px-2', {
                    'flex flex-col w-full': dir === 'col',
                    'flex flex-row w-fit h-full': dir === 'row',
                })}
            >
                {TASK_STATUS_OPTIONS.map((status) => (
                    <FireTaskClass
                        onlyOpen={dir === 'row'}
                        key={status.value}
                        status={status.value}
                    />
                ))}
            </div>
        </FireScrollArea>
    );
}
