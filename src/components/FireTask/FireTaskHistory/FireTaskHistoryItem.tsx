import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item';
import {
    FireUser,
    USER_AVATAR_FALLBACK_URL,
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
} from '@/lib/FireAuth/settings';
import {
    FIRE_TASK_LOCALE,
    IFireTaskHistory,
    TASK_COLLECTION,
} from '@/lib/FireTask/settings';
import { SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface FireTaskHistoryItemProps<U extends FireUser> {
    historyItem: IFireTaskHistory<U>;
    href: string;
}

export default function FireTaskHistoryItem<U extends FireUser>({
    historyItem,
    href,
}: FireTaskHistoryItemProps<U>) {
    let user: U | null = null;
    let content: string = '';
    if (historyItem.type === 'comment') {
        user = historyItem.comment?.user || null;
        content = FIRE_TASK_LOCALE.HISTORY_ITEM.COMMENT(
            user ? user[USER_NAME_FIELD] : 'Unknown',
            historyItem.title,
            historyItem.comment?.content || ''
        );
    } else if (historyItem.type === 'status') {
        user = historyItem.status?.user || null;
        content = FIRE_TASK_LOCALE.HISTORY_ITEM.STATUS_CHANGE(
            user ? user[USER_NAME_FIELD] : 'Unknown',
            historyItem.title,
            historyItem.status!.from,
            historyItem.status!.to
        );
    } else if (historyItem.type === 'create') {
        user = historyItem.create?.user || null;
        content = FIRE_TASK_LOCALE.HISTORY_ITEM.CREATE(
            user ? user[USER_NAME_FIELD] : 'Unknown',
            historyItem.title
        );
    }

    if (!user) {
        return null;
    }

    return (
        <Item className="relative px-1.5 py-2 hover:bg-accent group">
            <ItemMedia className="flex items-center">
                <Avatar
                    className="w-6 h-6 border shadow-sm"
                    style={{
                        borderRadius: 16,
                    }}
                >
                    <AvatarImage
                        src={user[USER_AVATAR_FIELD]}
                        alt={user.name}
                        className="object-cover"
                    />
                    <AvatarFallback className="rounded-none">
                        <Image
                            src={USER_AVATAR_FALLBACK_URL}
                            alt={user.name}
                            width={24}
                            height={24}
                            className="object-cover"
                        />
                    </AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent className="flex-row items-center">
                <ItemTitle className="break-all">{content}</ItemTitle>
                <ItemDescription className="text-xs md:block hidden text-nowrap min-w-24">
                    {historyItem.timestamp
                        .toDate()
                        .toLocaleTimeString()
                        .slice(0, -3)}
                </ItemDescription>
            </ItemContent>
            <ItemActions className="group-hover:visible invisible absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground cursor-pointer"
                    asChild
                >
                    <Link href={href}>
                        <SquareArrowOutUpRight />
                    </Link>
                </Button>
            </ItemActions>
        </Item>
    );
}
