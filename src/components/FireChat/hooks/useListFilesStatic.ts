import getFileMessages from '@/components/FireChat/api/getFileMessages';
import getImageMessages from '@/components/FireChat/api/getImageMessages';
import {
    FireMessage,
    FireMessageContent,
} from '@/components/FireChat/settings';
import { useEffect, useState } from 'react';

/**
 * 정적 파일/이미지 목록 조회 (실시간 업데이트 없음)
 * 전체보기 창에서 사용
 */
export default function useListFilesStatic<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ channelId }: { channelId?: string }) {
    const [imageMessages, setImageMessages] = useState<M[]>([]);
    const [fileMessages, setFileMessages] = useState<M[]>([]);

    useEffect(() => {
        if (!channelId) {
            setImageMessages([]);
            setFileMessages([]);
            return;
        }

        getImageMessages<M, T>(channelId).then((imgs) => {
            setImageMessages(imgs);
        });

        getFileMessages<M, T>(channelId).then((files) => {
            setFileMessages(files);
        });
    }, [channelId]);

    return { imageMessages, fileMessages };
}
