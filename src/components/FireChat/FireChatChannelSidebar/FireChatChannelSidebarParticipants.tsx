import {
    CHANNEL_HOST_ID_FIELD,
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FcUser,
    LOCALE,
    USER_EMAIL_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
    USER_AVATAR_FALLBACK_URL,
} from '@/lib/FireChat/settings';
import Image from 'next/image';
import { Plus, Users, UserX2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { memo, useState } from 'react';
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
import { findUsersByNameOrEmail } from '@/lib/FireChat/api/getUsersByEmail';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/provider/AuthProvider';
import { toast } from 'sonner';
import inviteUser from '@/lib/FireChat/api/inviteUser';
import removeUser from '@/lib/FireChat/api/removeUser';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function FireChatChannelSidebarParticipants<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ participants, channel }: { participants: U[]; channel?: C }) {
    const { user: me } = useAuth();
    // FireChat 컨텍스트에서 현재 선택된 채널 정보 가져오기
    // 참여자 목록을 보여줌

    const sortedParticipants = participants
        ? participants.sort((a, b) =>
              b[USER_NAME_FIELD].localeCompare(a[USER_NAME_FIELD])
          )
        : [];

    function handleRemoveUser(user: U) {
        if (channel?.[CHANNEL_ID_FIELD]) {
            removeUser(channel[CHANNEL_ID_FIELD], user[USER_ID_FIELD]).then(
                () => {
                    toast.error(
                        LOCALE.SIDEBAR.PARTICIPANT_REMOVED(
                            user[USER_NAME_FIELD]
                        ),
                        {
                            duration: 3000,
                        }
                    );
                    // reFetchChannelParticipants();
                }
            );
        }
    }

    return (
        <Card className="gap-1 p-2">
            <div className="flex items-center gap-2 p-2">
                <Users className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold tracking-tight">
                    {LOCALE.SIDEBAR.PARTICIPANTS} {sortedParticipants.length}
                </h2>
            </div>
            {channel?.[CHANNEL_HOST_ID_FIELD] === me?.[USER_ID_FIELD] && (
                <InviteParticipantsButton
                    // reFetchChannelParticipants={reFetchChannelParticipants}
                    channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                />
            )}
            {sortedParticipants.length === 0 ? (
                <span className="text-sm text-muted-foreground text-center py-6">
                    {LOCALE.SIDEBAR.NO_PARTICIPANTS}
                </span>
            ) : (
                sortedParticipants.map((user) => (
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
                                    src={user[USER_AVATAR_FIELD]}
                                    alt={user.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-none">
                                    <Image
                                        src={USER_AVATAR_FALLBACK_URL}
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-base font-medium text-foreground transition-colors line-clamp-1">
                                    {user[USER_ID_FIELD] ===
                                        me?.[USER_ID_FIELD] && (
                                        <Badge className="text-xs py-0.5 px-1 mr-1">
                                            {LOCALE.ME}
                                        </Badge>
                                    )}
                                    {user[USER_NAME_FIELD]}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {user[USER_EMAIL_FIELD]}
                                </span>
                            </div>
                        </div>
                        <div>
                            {/* 추가 액션 버튼이나 상태 표시 등을 여기에 넣을 수 있음 */}
                            {channel?.[CHANNEL_HOST_ID_FIELD] ===
                                me?.[USER_ID_FIELD] &&
                                user[USER_ID_FIELD] !== me?.[USER_ID_FIELD] && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={
                                                    channel?.[
                                                        CHANNEL_HOST_ID_FIELD
                                                    ] !== me?.[USER_ID_FIELD] ||
                                                    user[USER_ID_FIELD] ===
                                                        me?.[USER_ID_FIELD]
                                                }
                                            >
                                                <UserX2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {LOCALE.SIDEBAR.REMOVE_PARTICIPANT(
                                                        user[USER_NAME_FIELD]
                                                    )}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription className="text-sm">
                                                    {LOCALE.SIDEBAR.REMOVE_PARTICIPANT(
                                                        user[USER_NAME_FIELD]
                                                    )}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    {LOCALE.CANCEL}
                                                </AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            handleRemoveUser(
                                                                user
                                                            );
                                                        }}
                                                    >
                                                        {
                                                            LOCALE.SIDEBAR
                                                                .REMOVE_USER_BUTTON
                                                        }
                                                    </Button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                        </div>
                    </div>
                ))
            )}
        </Card>
    );
}

function InviteParticipantsButton<U extends FcUser>({
    channelId,
}: {
    channelId: string;
}) {
    // 초대가능한 유저 목록 (현재는 구현하지 않음)
    const { user: me } = useAuth();
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
            toast.success(LOCALE.SIDEBAR.USER_INVITED, {
                duration: 3000,
            });
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-accent transition-colors w-full cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Avatar
                            className="w-10 h-10 border shadow-sm flex justify-center items-center text-primary"
                            style={{
                                borderRadius: '40%',
                            }}
                        >
                            <Plus />
                        </Avatar>
                        <span className="text-base font-medium text-primary transition-colors line-clamp-1">
                            {LOCALE.SIDEBAR.INVITE_PARTICIPANTS}
                        </span>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="md:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {LOCALE.SIDEBAR.INVITE_PARTICIPANTS}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {LOCALE.SIDEBAR.INVITE_PARTICIPANTS_DESCRIPTION}
                    </DialogDescription>
                    <form className="flex gap-2 mt-2" onSubmit={handleSearch}>
                        <Input
                            type="text"
                            placeholder={LOCALE.SIDEBAR.SEARCH_USER_PLACEHOLDER}
                            className="w-full mb-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            type="submit"
                            className="w-fit"
                            variant={'outline'}
                        >
                            {LOCALE.SIDEBAR.SEARCH_BUTTON}
                        </Button>
                    </form>
                    {inviteableUsers && (
                        <ScrollArea>
                            <div className="flex flex-col gap-2 max-h-96">
                                {inviteableUsers.length === 0 ? (
                                    <span className="text-sm text-muted-foreground text-center py-4">
                                        {LOCALE.SIDEBAR.NO_USERS_FOUND}
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
                                                        LOCALE.SIDEBAR
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

export default memo(FireChatChannelSidebarParticipants);
