import { useAuth } from '@/components/provider/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { FcUser } from '@/lib/FireAuth/settings';
import {
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD
} from '@/lib/FireAuth/settings';
import Image from 'next/image';

export default function FireChatChannelHeaderAvatar<U extends FcUser>({
    participants,
}: {
    participants: U[];
}) {
    const { user: me } = useAuth();
    if (!me) return <Skeleton className="w-8 h-8 rounded-full" />;
    // 참여자 목록에서 나를 제외한 참여자 추출
    const others = participants.filter((p) => p.id !== me.id) || [];

    // 아바타 렌더링 함수
    const renderAvatar = (user: U, isInnerAvatar?: boolean, key?: number) => (
        <Avatar
            key={key}
            style={{
                width: isInnerAvatar ? 14 : 32,
                height: isInnerAvatar ? 14 : 32,
                borderRadius: '40%',
            }}
        >
            <AvatarImage src={user[USER_AVATAR_FIELD]} alt={user.name} />
            <AvatarFallback className="rounded-none">
                <Image
                    src={USER_AVATAR_FALLBACK_URL}
                    alt={user.name}
                    width={isInnerAvatar ? 14 : 32}
                    height={isInnerAvatar ? 14 : 32}
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
        <div className="overflow-hidden w-8 h-8 gap-x-0.5 gap-y-0.5 grid grid-cols-2 grid-rows-2">
            {gridUsers.map((user, idx) => renderAvatar(user as U, true, idx))}
        </div>
    );
}
