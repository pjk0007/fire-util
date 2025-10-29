import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { FireUser } from '@/lib/FireAuth/settings';
import deleteTask from '@/lib/FireTask/api/deleteTask';
import updateTaskStatus from '@/lib/FireTask/api/updateTaskStatus';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_ID_FIELD,
    FIRE_TASK_LOCALE,
    TASK_STATUS_FIELD,
    TASK_STATUS_OPTIONS,
    TaskStatus,
} from '@/lib/FireTask/settings';
import { Ellipsis, PenLine } from 'lucide-react';

interface FireTaskClassCardMenuProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
    setIsEditingTitle: (isEditing: boolean) => void;
    isEditingTitle: boolean;
}

export default function FireTaskClassCardMenu<
    FT extends FireTask<FU>,
    FU extends FireUser
>({
    task,
    setIsEditingTitle,
    isEditingTitle,
}: FireTaskClassCardMenuProps<FT, FU>) {
    const { user } = useFireAuth();
    return (
        <div className="absolute group-hover:visible invisible top-2 right-2">
            <ButtonGroup>
                {!isEditingTitle && (
                    <Button
                        size={'icon-sm'}
                        variant={'outline'}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingTitle(!isEditingTitle);
                        }}
                        className="bg-background"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PenLine />
                            </TooltipTrigger>
                            <TooltipContent>
                                {FIRE_TASK_LOCALE.CARD.EDIT}
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size={'icon-sm'}
                            variant={'outline'}
                            value="edit"
                            className="bg-background"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Ellipsis />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="w-40"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    {FIRE_TASK_LOCALE.CARD.CHANGE_STATUS}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-40">
                                    <DropdownMenuLabel>
                                        {FIRE_TASK_LOCALE.CARD.CHANGE_STATUS}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                        value={task[TASK_STATUS_FIELD]}
                                        onValueChange={(value) => {
                                            const status = value as TaskStatus;
                                            if (!user) return;
                                            updateTaskStatus(
                                                user,
                                                task,
                                                status
                                            );
                                        }}
                                    >
                                        {TASK_STATUS_OPTIONS.map((status) => (
                                            <DropdownMenuRadioItem
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                    deleteTask(
                                        task[TASK_CHANNEL_ID_FIELD],
                                        task[TASK_ID_FIELD]
                                    );
                                }}
                            >
                                {FIRE_TASK_LOCALE.CARD.DELETE}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ButtonGroup>
        </div>
    );
}
