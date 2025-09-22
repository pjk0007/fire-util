import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
    FcUser,
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
} from '@/lib/FireChat/settings';
import Image from 'next/image';

export default function FireChatChannelListItemAvatar<U extends FcUser>({
    participants,
    me,
}: {
    participants: U[];
    me?: U | null;
}) {
    if (!me) return <Skeleton className="w-14 h-14 rounded-full" />;
    // 참여자 목록에서 나를 제외한 참여자 추출
    const others = participants.filter((p) => p.id !== me.id);

    // 아바타 렌더링 함수
    const renderAvatar = (user: U, isInnerAvatar?: boolean, key?: number) => (
        <Avatar
            key={key}
            style={{
                width: isInnerAvatar ? 26 : 56,
                height: isInnerAvatar ? 26 : 56,
                borderRadius: '40%',
            }}
        >
            <AvatarImage src={user[USER_AVATAR_FIELD]} alt={user.name} />
            <AvatarFallback className="rounded-none">
                <Image
                    src={USER_AVATAR_FALLBACK_URL}
                    alt={user.name}
                    width={isInnerAvatar ? 26 : 56}
                    height={isInnerAvatar ? 26 : 56}
                />
            </AvatarFallback>
        </Avatar>
    );

    if (others.length === 0) {
        // 나만 있을 때
        return renderAvatar(me as U);
    }

    if (others.length === 1) {
        // 1명만 있을 때
        return renderAvatar(others[0] as U);
    }

    // 2명 이상일 때: 2x2 그리드
    const gridUsers = [me, ...others].slice(0, 4); // 최대 4명
    return (
        <div className="overflow-hidden w-14 h-14 gap-x-0.5 gap-y-0.5 grid grid-cols-2 grid-rows-2">
            {gridUsers.map((user, idx) => renderAvatar(user as U, true, idx))}
        </div>
    );
}
