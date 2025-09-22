import { useEffect, useState } from 'react';

export default function useFireChatChannelRoomFooter(channelId?: string) {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        setMessage('');
        setFiles([]);
    }, [channelId]);

    return { message, setMessage, files, setFiles };
}
