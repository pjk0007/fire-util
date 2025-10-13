import {
    FIRECHAT_LOCALE,
    FireMessage,
    FireMessageContent,
} from '@/lib/FireChat/settings';
import {
    CHANNEL_HOST_ID_FIELD,
    CHANNEL_ID_FIELD,
    FireChannel,
} from '@/lib/FireChannel/settings';
import {
    FireUser,
    USER_EMAIL_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireAuth/settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
    USER_AVATAR_FALLBACK_URL,
} from '@/lib/FireAuth/settings';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import removeUser from '@/lib/FireChannel/api/removeUser';
import { toast } from 'sonner';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from '@/components/ui/item';

export default function FireChatSettingsParticipantsItem<
    FC extends FireChannel<FM, FT>,
    FM extends FireMessage<FT>,
    FT extends FireMessageContent,
    FU extends FireUser
>({ user, channel }: { user: FU; channel?: FC }) {
    const { user: me } = useFireAuth();

    function handleRemoveUser(user: FU) {
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
        <Item key={user.id} className="py-2 px-0 gap-3">
            <ItemMedia>
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
            </ItemMedia>
            <ItemContent>
                <ItemTitle className='gap-1'>
                    {channel?.[CHANNEL_HOST_ID_FIELD] ===
                    user[USER_ID_FIELD] ? (
                        <Badge className="text-xs py-0.5 px-1 bg-accent-foreground">
                            {FIRECHAT_LOCALE.HOST}
                        </Badge>
                    ) : user[USER_ID_FIELD] === me?.[USER_ID_FIELD] ? (
                        <Badge className="text-xs py-0.5 px-1 bg-accent-foreground">
                            {FIRECHAT_LOCALE.ME}
                        </Badge>
                    ) : null}
                    {user[USER_NAME_FIELD]}
                </ItemTitle>
                <ItemDescription>{user[USER_EMAIL_FIELD]}</ItemDescription>
            </ItemContent>
            <ItemActions>
                {channel?.[CHANNEL_HOST_ID_FIELD] === me?.[USER_ID_FIELD] &&
                    user[USER_ID_FIELD] !== me?.[USER_ID_FIELD] && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="text-xs"
                                    size="sm"
                                    variant="outline"
                                    disabled={
                                        channel?.[CHANNEL_HOST_ID_FIELD] !==
                                            me?.[USER_ID_FIELD] ||
                                        user[USER_ID_FIELD] ===
                                            me?.[USER_ID_FIELD]
                                    }
                                >
                                    {FIRECHAT_LOCALE.SIDEBAR.REMOVE_USER_BUTTON}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {FIRECHAT_LOCALE.SIDEBAR.REMOVE_PARTICIPANT(
                                            user[USER_NAME_FIELD]
                                        )}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm">
                                        {FIRECHAT_LOCALE.SIDEBAR.REMOVE_PARTICIPANT(
                                            user[USER_NAME_FIELD]
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
                                                handleRemoveUser(user);
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
            </ItemActions>
        </Item>
    );
}
