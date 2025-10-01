import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    FireMessage,
    FireMessageContent,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import {
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
    USER_NAME_FIELD
} from '@/lib/FireAuth/settings';
import Image from 'next/image';

export default function FireChatMessageAvatar<
    U extends FireUser,
    M extends FireMessage<T>,
    T extends FireMessageContent
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
