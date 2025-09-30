import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    FcMessage,
    FcMessageContent,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { FcUser } from '@/lib/FireAuth/settings';
import {
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
    USER_NAME_FIELD
} from '@/lib/FireAuth/settings';
import Image from 'next/image';

export default function FireChatMessageAvatar<
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ message, participants }: { message: M; participants: U[] }) {
    const messageUser = participants.find(
        (p) => p.id === message[MESSAGE_USER_ID_FIELD]
    ) as U | undefined;

    return (
        <Avatar
            style={{
                width: 32,
                height: 32,
                borderRadius: '40%',
            }}
        >
            <AvatarImage
                src={messageUser?.[USER_AVATAR_FIELD]}
                alt={messageUser?.[USER_NAME_FIELD]}
            />
            <AvatarFallback className="rounded-none">
                <Image
                    src={USER_AVATAR_FALLBACK_URL}
                    alt={messageUser?.[USER_NAME_FIELD] || 'User'}
                    width={32}
                    height={32}
                />
            </AvatarFallback>
        </Avatar>
    );
}
