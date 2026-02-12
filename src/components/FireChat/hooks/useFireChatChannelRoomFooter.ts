import { TrackedMention } from '@/components/FireChat/hooks/useChatMention';
import { useEffect, useState } from 'react';

export default function useFireChatChannelRoomFooter(channelId?: string) {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [mentions, setMentions] = useState<TrackedMention[]>([]);

    useEffect(() => {
        setMessage('');
        setFiles([]);
        setMentions([]);
    }, [channelId]);

    return { message, setMessage, files, setFiles, mentions, setMentions };
}
