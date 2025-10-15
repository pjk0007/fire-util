import {
    FIRE_CHAT_LOCALE,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import {
    USER_EMAIL_FIELD,
    USER_ID_FIELD
} from '@/lib/FireAuth/settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
    USER_AVATAR_FALLBACK_URL
} from '@/lib/FireAuth/settings';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { findUsersByNameOrEmail } from '@/lib/FireAuth/api/getUsersByEmail';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { toast } from 'sonner';
import inviteUser from '@/lib/FireChannel/api/inviteUser';

export default function FireChatSettingsInviteButton<U extends FireUser>({
    channelId,
}: {
    channelId: string;
}) {
    // 초대가능한 유저 목록 (현재는 구현하지 않음)
    const { user: me } = useFireAuth();
    const [inviteableUsers, setInviteableUsers] = useState<U[] | undefined>();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        findUsersByNameOrEmail(searchQuery).then((users) => {
            setInviteableUsers(
                users.filter(
                    (u) => u[USER_ID_FIELD] !== me?.[USER_ID_FIELD]
                ) as U[]
            );
        });
    }

    function handleInviteUser(userId: string) {
        setIsOpen(false);
        inviteUser(channelId, userId).then(() => {
            // reFetchChannelParticipants();
            toast.success(FIRE_CHAT_LOCALE.SIDEBAR.USER_INVITED, {
                duration: 3000,
            });
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full mt-4">
                    {FIRE_CHAT_LOCALE.SIDEBAR.INVITE_PARTICIPANTS}
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {FIRE_CHAT_LOCALE.SIDEBAR.INVITE_PARTICIPANTS}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {FIRE_CHAT_LOCALE.SIDEBAR.INVITE_PARTICIPANTS_DESCRIPTION}
                    </DialogDescription>
                    <form className="flex gap-2 mt-2" onSubmit={handleSearch}>
                        <Input
                            type="text"
                            placeholder={FIRE_CHAT_LOCALE.SIDEBAR.SEARCH_USER_PLACEHOLDER}
                            className="w-full mb-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            className="w-fit"
                            variant={'outline'}
                        >
                            {FIRE_CHAT_LOCALE.SIDEBAR.SEARCH_BUTTON}
                        </Button>
                    </form>
                    {inviteableUsers && (
                        <ScrollArea>
                            <div className="flex flex-col gap-2 max-h-96">
                                {inviteableUsers.length === 0 ? (
                                    <span className="text-sm text-muted-foreground text-center py-4">
                                        {FIRE_CHAT_LOCALE.SIDEBAR.NO_USERS_FOUND}
                                    </span>
                                ) : (
                                    inviteableUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent transition-colors w-full"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    className="w-10 h-10 border shadow-sm"
                                                    style={{
                                                        borderRadius: 16,
                                                    }}
                                                >
                                                    <AvatarImage
                                                        src={
                                                            user[
                                                                USER_AVATAR_FIELD
                                                            ]
                                                        }
                                                        alt={user.name}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="rounded-none">
                                                        <Image
                                                            src={
                                                                USER_AVATAR_FALLBACK_URL
                                                            }
                                                            alt={user.name}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                        />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-medium text-foreground transition-colors line-clamp-1">
                                                        {user[USER_NAME_FIELD]}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {user[USER_EMAIL_FIELD]}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        handleInviteUser(
                                                            user[USER_ID_FIELD]
                                                        );
                                                    }}
                                                >
                                                    {
                                                        FIRE_CHAT_LOCALE.SIDEBAR
                                                            .INVITE_BUTTON
                                                    }
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
