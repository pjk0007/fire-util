import { Timestamp } from 'firebase/firestore';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';

/**
 * 특정 메시지의 안 읽은 사람 수를 계산합니다.
 * 카카오톡 스타일: 메시지 옆에 "2", "1" 같은 숫자 표시
 *
 * @returns 안 읽은 사람 수 (0이면 모두 읽음)
 */
export default function getUnreadCount<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({
    message,
    participants,
    lastSeen,
}: {
    message: M;
    participants: string[];
    lastSeen?: { [userId: string]: Timestamp };
}): number {
    if (!message) return 0;

    if (!participants || participants.length <= 1) return 0;

    const messageTime = message[MESSAGE_CREATED_AT_FIELD];
    const messageAuthorId = message[MESSAGE_USER_ID_FIELD];

    let readCount = 0;

    for (const userId of participants) {
        // 메시지 작성자는 자동으로 읽은 것으로 처리
        if (userId === messageAuthorId) {
            readCount++;
            continue;
        }

        // lastSeen이 메시지 시간보다 크거나 같으면 읽은 것
        const userLastSeen = lastSeen?.[userId];
        if (userLastSeen && userLastSeen.toMillis() >= messageTime.toMillis()) {
            readCount++;
        }
    }

    return Math.max(0, participants.length - readCount);
}
