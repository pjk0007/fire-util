import { useMemo } from 'react';
import { Timestamp } from 'firebase/firestore';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_ID_FIELD,
} from '@/lib/FireChat/settings';
import getUnreadCount from '@/lib/FireChat/utils/getUnreadCount';

/**
 * 메시지 목록의 안 읽은 사람 수를 실시간으로 계산하는 훅입니다.
 * lastSeen이 업데이트되면 자동으로 재계산됩니다.
 *
 * @example
 * const { getUnreadCountForMessage } = useMessageUnreadCount({
 *     messages: [...beforeMessages, ...messages],
 *     participants: channel?.users ?? [],
 *     lastSeen: channel?.lastSeen,
 * });
 *
 * // 특정 메시지의 안 읽은 수 조회
 * const count = getUnreadCountForMessage(message.id);
 * {count > 0 && <span>{count}</span>}
 */
export default function useMessageUnreadCount<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({
    messages,
    participants,
    lastSeen,
}: {
    messages: M[];
    participants: string[];
    lastSeen?: { [userId: string]: Timestamp };
}) {
    // lastSeen 변경 감지용 키
    const lastSeenKey = useMemo(() => {
        if (!lastSeen) return '';
        return Object.entries(lastSeen)
            .map(([userId, timestamp]) => `${userId}:${timestamp.toMillis()}`)
            .sort()
            .join(',');
    }, [lastSeen]);

    // 메시지별 안 읽은 수 맵
    const unreadCountsMap = useMemo(() => {
        const map = new Map<string, number>();

        for (const message of messages) {
            const count = getUnreadCount({
                message,
                participants,
                lastSeen,
            });
            map.set(message[MESSAGE_ID_FIELD], count);
        }

        return map;
    }, [messages, participants, lastSeenKey]);

    const getUnreadCountForMessage = (messageId: string): number => {
        return unreadCountsMap.get(messageId) ?? 0;
    };

    return {
        unreadCountsMap,
        getUnreadCountForMessage,
    };
}
