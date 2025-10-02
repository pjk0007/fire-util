import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TASK_LOCALE } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default function FireTaskAddNew({
    size,
}: {
    size: 'small' | 'large';
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size={'icon'}
                    variant={'outline'}
                    className={cn('rounded-full ', {
                        'w-6 h-6': size === 'small',
                        'w-9 h-9': size === 'large',
                    })}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <Plus />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{TASK_LOCALE.ADD_TASK}</TooltipContent>
        </Tooltip>
    );
}
