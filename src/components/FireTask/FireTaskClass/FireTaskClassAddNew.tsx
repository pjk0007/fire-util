import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import createTask from '@/lib/FireTask/api/createTask';
import { FIRE_TASK_LOCALE } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default function FireTaskClassAddNew({
    size,
}: {
    size: 'small' | 'large';
}) {
    const { selectedChannelId } = useFireChannel();
    const { user } = useFireAuth();
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
                        if (selectedChannelId && user) {
                            createTask(selectedChannelId, user);
                        }
                    }}
                >
                    <Plus />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{FIRE_TASK_LOCALE.ADD_TASK}</TooltipContent>
        </Tooltip>
    );
}
