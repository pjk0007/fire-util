import { FireUser } from '@/lib/FireAuth/settings';
import updateTaskContent from '@/lib/FireTask/api/updateTaskContent';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_CONTENT_FIELD,
    TASK_ID_FIELD,
    FIRE_TASK_LOCALE,
} from '@/lib/FireTask/settings';
import { useEffect, useRef, useState } from 'react';

interface FireTaskClassCardSheetContentProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSheetContent<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSheetContentProps<FT, FU>) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [localContent, setLocalContent] = useState(task[TASK_CONTENT_FIELD]);

    useEffect(() => {
        if (localContent === task[TASK_CONTENT_FIELD]) return;
        updateTaskContent(
            task[TASK_CHANNEL_ID_FIELD],
            task[TASK_ID_FIELD],
            localContent
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localContent]);

    useEffect(() => {
        if (!textareaRef.current) return;
        const ta = textareaRef.current;
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
    }, []);

    return (
        <textarea
            ref={textareaRef}
            className="w-full resize-none min-h-40 py-2 px-0.5 text-sm outline-none overflow-hidden"
            placeholder={FIRE_TASK_LOCALE.CARD.CONTENT_PLACEHOLDER}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onInput={() => {
                if (!textareaRef.current) return;
                const ta = textareaRef.current;
                ta.style.height = 'auto';
                ta.style.height = `${ta.scrollHeight}px`;
            }}
        />
    );
}
