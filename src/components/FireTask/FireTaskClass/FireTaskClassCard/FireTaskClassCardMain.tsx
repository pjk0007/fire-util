import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    FireUser,
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
    USER_ID_FIELD,
    USER_NAME_FIELD,
} from '@/lib/FireAuth/settings';
import updateTaskTitle from '@/lib/FireTask/api/updateTaskTitle';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_USER_FIELD,
    TASK_ID_FIELD,
    TASK_TITLE_FIELD,
    FIRE_TASK_LOCALE,
} from '@/lib/FireTask/settings';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { sendTextMessage } from '@/components/FireChat/api/sendMessage';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';

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
    const [localTitle, setLocalTitle] = useState(task[TASK_TITLE_FIELD]);
    const parentDraggableRef = useRef<{
        el: HTMLElement | null;
        orig: boolean;
    } | null>(null);
    const { user } = useFireAuth();
    const initialTitleRef = useRef(task[TASK_TITLE_FIELD]);

    // restore draggable if we left it disabled (safety)
    useEffect(() => {
        return () => {
            if (parentDraggableRef.current?.el) {
                try {
                    parentDraggableRef.current.el.draggable =
                        parentDraggableRef.current.orig;
                } catch (e) {
                    console.log(e);
                    
                    /* ignore */
                }
                parentDraggableRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        updateTaskTitle(
            task[TASK_CHANNEL_ID_FIELD],
            task[TASK_ID_FIELD],
            localTitle
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localTitle]);

    return (
        <div className="flex justify-between items-center">
            {isEditingTitle ? (
                <input
                    ref={inputRef}
                    autoFocus
                    onBlur={() => {
                        setIsEditingTitle(false);

                        if (user && localTitle !== initialTitleRef.current) {
                            const isNewTask = !initialTitleRef.current;
                            const message = isNewTask
                                ? `<b>${localTitle}</b>: ${FIRE_TASK_LOCALE.NOTIFICATION.NEW_TASK}`
                                : `<b>${localTitle}</b>: ${FIRE_TASK_LOCALE.NOTIFICATION.TITLE_EDIT}`;
                            sendTextMessage(
                                task[TASK_CHANNEL_ID_FIELD],
                                user[USER_ID_FIELD],
                                message
                            );
                            initialTitleRef.current = localTitle;
                        }
                    }}
                    draggable={false}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            inputRef.current?.blur();
                        }
                    }}
                    // Prevent parent draggable while interacting with input so text selection works
                    onMouseDownCapture={(e) => {
                        e.stopPropagation();
                        // disable closest draggable ancestor temporarily
                        const el = inputRef.current?.closest('[draggable="true"]') as HTMLElement | null;
                        if (el && !parentDraggableRef.current) {
                            parentDraggableRef.current = { el, orig: el.draggable };
                            try {
                                el.draggable = false;
                            } catch (err) {
                                console.log(err);
                                /* ignore */
                            }

                            const restore = () => {
                                if (parentDraggableRef.current?.el) {
                                    try {
                                        parentDraggableRef.current.el.draggable = parentDraggableRef.current.orig;
                                    } catch (e) {
                                        console.log(e);
                                        /* ignore */
                                    }
                                    parentDraggableRef.current = null;
                                }
                                window.removeEventListener('pointerup', restore);
                                window.removeEventListener('mouseup', restore);
                                window.removeEventListener('touchend', restore);
                            };

                            window.addEventListener('pointerup', restore, { once: true });
                            window.addEventListener('mouseup', restore, { once: true });
                            window.addEventListener('touchend', restore, { once: true });
                        }
                    }}
                    onTouchStartCapture={(e) => {
                        e.stopPropagation();
                        // same logic as mouse down
                        const el = inputRef.current?.closest('[draggable="true"]') as HTMLElement | null;
                        if (el && !parentDraggableRef.current) {
                            parentDraggableRef.current = { el, orig: el.draggable };
                            try {
                                el.draggable = false;
                            } catch (err) {
                                console.log(err);
                                /* ignore */
                            }

                            const restore = () => {
                                if (parentDraggableRef.current?.el) {
                                    try {
                                        parentDraggableRef.current.el.draggable = parentDraggableRef.current.orig;
                                    } catch (e) {
                                        console.log(e);
                                        /* ignore */
                                    }
                                    parentDraggableRef.current = null;
                                }
                                window.removeEventListener('pointerup', restore);
                                window.removeEventListener('mouseup', restore);
                                window.removeEventListener('touchend', restore);
                            };

                            window.addEventListener('pointerup', restore, { once: true });
                            window.addEventListener('mouseup', restore, { once: true });
                            window.addEventListener('touchend', restore, { once: true });
                        }
                    }}
                    onDragStartCapture={(e) => {
                        // prevent any dragstart originating from the input
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    value={localTitle}
                    onChange={(e) => {
                        setLocalTitle(e.target.value);
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
                        (task[TASK_USER_FIELD] as FU)[
                            USER_AVATAR_FIELD
                        ] || undefined
                    }
                    alt="User Avatar"
                />
                <AvatarFallback>
                    <Image
                        src={USER_AVATAR_FALLBACK_URL}
                        alt={task[TASK_USER_FIELD][USER_NAME_FIELD]}
                        width={24}
                        height={24}
                    />
                </AvatarFallback>
            </Avatar>
        </div>
    );
}
