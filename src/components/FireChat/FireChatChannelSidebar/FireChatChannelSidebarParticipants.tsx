import {
    CHANNEL_HOST_ID_FIELD,
    CHANNEL_ID_FIELD,
    FcChannel,
    FcMessage,
    FcMessageContent,
    FIRECHAT_LOCALE,
} from '@/lib/FireChat/settings';
import { FcUser } from '@/lib/FireAuth/settings';
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
import { UserX2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { toast } from 'sonner';
import removeUser from '@/lib/FireChannel/api/removeUser';
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
import FireChatChannelSidebarInviteButton from '@/components/FireChat/FireChatChannelSidebar/FireChatChannelSidebarInviteButton';

function FireChatChannelSidebarParticipants<
    C extends FcChannel<M, T>,
    U extends FcUser,
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ participants, channel }: { participants: U[]; channel?: C }) {
    const { user: me } = useFireAuth();
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
                        FIRECHAT_LOCALE.SIDEBAR.PARTICIPANT_REMOVED(
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
        <Card className="gap-4 p-2 md:py-5 md:px-4 shadow-none w-full">
            <div className="flex items-center gap-2">
                {/* <Users className="w-4 h-4 text-primary" /> */}
                <h2 className="text-sm font-semibold tracking-tight">
                    {FIRECHAT_LOCALE.SIDEBAR.PARTICIPANTS}
                    <span className="ml-1.5 text-muted-foreground">
                        {sortedParticipants.length}
                    </span>
                </h2>
            </div>

            <div className='flex flex-col gap-1'>
                {sortedParticipants.length === 0 ? (
                    <span className="text-sm text-muted-foreground text-center py-6">
                        {FIRECHAT_LOCALE.SIDEBAR.NO_PARTICIPANTS}
                    </span>
                ) : (
                    sortedParticipants.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between gap-3 p-2 py-2 rounded-lg hover:bg-accent transition-colors w-full"
                        >
                            <div className="flex items-center gap-3 max-w-40 md:max-w-max">
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
                                <div className="flex flex-col line-clamp-1">
                                    <span className="text-base font-medium text-foreground transition-colors line-clamp-1 ">
                                        {channel?.[CHANNEL_HOST_ID_FIELD] ===
                                        user[USER_ID_FIELD] ? (
                                            <Badge className="text-xs py-0.5 px-1 mr-1 bg-accent-foreground">
                                                {FIRECHAT_LOCALE.HOST}
                                            </Badge>
                                        ) : user[USER_ID_FIELD] ===
                                          me?.[USER_ID_FIELD] ? (
                                            <Badge className="text-xs py-0.5 px-1 mr-1 bg-accent-foreground">
                                                {FIRECHAT_LOCALE.ME}
                                            </Badge>
                                        ) : null}

                                        {user[USER_NAME_FIELD]}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {user[USER_EMAIL_FIELD]}
                                    </span>
                                </div>
                            </div>
                            <div>
                                {/* 추가 액션 버튼이나 상태 표시 등을 여기에 넣을 수 있음 */}
                                {channel?.[CHANNEL_HOST_ID_FIELD] ===
                                    me?.[USER_ID_FIELD] &&
                                    user[USER_ID_FIELD] !==
                                        me?.[USER_ID_FIELD] && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className="text-xs"
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={
                                                        channel?.[
                                                            CHANNEL_HOST_ID_FIELD
                                                        ] !==
                                                            me?.[
                                                                USER_ID_FIELD
                                                            ] ||
                                                        user[USER_ID_FIELD] ===
                                                            me?.[USER_ID_FIELD]
                                                    }
                                                >
                                                    {
                                                        FIRECHAT_LOCALE.SIDEBAR
                                                            .REMOVE_USER_BUTTON
                                                    }
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {FIRECHAT_LOCALE.SIDEBAR.REMOVE_PARTICIPANT(
                                                            user[
                                                                USER_NAME_FIELD
                                                            ]
                                                        )}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-sm">
                                                        {FIRECHAT_LOCALE.SIDEBAR.REMOVE_PARTICIPANT(
                                                            user[
                                                                USER_NAME_FIELD
                                                            ]
                                                        )}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        {FIRECHAT_LOCALE.CANCEL}
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
                                                                FIRECHAT_LOCALE.SIDEBAR
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
                {channel?.[CHANNEL_HOST_ID_FIELD] === me?.[USER_ID_FIELD] && (
                    <FireChatChannelSidebarInviteButton
                        // reFetchChannelParticipants={reFetchChannelParticipants}
                        channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                    />
                )}
            </div>
        </Card>
    );
}

export default memo(FireChatChannelSidebarParticipants);
