import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    FireUser,
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
} from '@/lib/FireAuth/settings';
import updateTaskTitle from '@/lib/FireTask/api/updateTaskTitle';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_CHANNEL_USER_FIELD,
    TASK_ID_FIELD,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface FireTaskClassCardMainProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
    setIsEditingTitle: (isEditing: boolean) => void;
    isEditingTitle: boolean;
}

export default function FireTaskClassCardMain<
    FT extends FireTask<FU>,
    FU extends FireUser
>({
    task,
    setIsEditingTitle,
    isEditingTitle,
}: FireTaskClassCardMainProps<FT, FU>) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex justify-between items-center">
            {isEditingTitle ? (
                <input
                    ref={inputRef}
                    autoFocus
                    onBlur={() => {
                        setIsEditingTitle(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            inputRef.current?.blur();
                        }
                    }}
                    value={task[TASK_TITLE_FIELD]}
                    onChange={(e) => {
                        updateTaskTitle(
                            task[TASK_CHANNEL_ID_FIELD],
                            task[TASK_ID_FIELD],
                            e.target.value
                        );
                    }}
                    className="text-sm font-medium focus:outline-none md:max-w-40 max-w-64 text-card-foreground line-clamp-2 wrap-break-word"
                />
            ) : (
                <div className="md:max-w-40 max-w-64 text-sm text-card-foreground font-medium line-clamp-2 wrap-break-word">
                    {task[TASK_TITLE_FIELD]}
                </div>
            )}
            <Avatar className="w-6 h-6">
                <AvatarImage
                    src={
                        (task[TASK_CHANNEL_USER_FIELD] as FU)[
                            USER_AVATAR_FIELD
                        ] || undefined
                    }
                    alt="User Avatar"
                />
                <AvatarFallback>
                    <Image
                        src={USER_AVATAR_FALLBACK_URL}
                        alt={task[TASK_CHANNEL_USER_FIELD][USER_NAME_FIELD]}
                        width={24}
                        height={24}
                    />
                </AvatarFallback>
            </Avatar>
        </div>
    );
}
