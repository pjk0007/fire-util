import {
    FireMessage,
    FireMessageContent,
    FIRE_CHAT_LOCALE,
} from '@/lib/FireChat/settings';
import { FireChannel } from '@/lib/FireChannel/settings';
import {
    CHANNEL_HOST_ID_FIELD,
    CHANNEL_ID_FIELD,
} from '@/lib/FireChannel/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import { USER_NAME_FIELD } from '@/lib/FireAuth/settings';
import { Card } from '@/components/ui/card';
import { memo } from 'react';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import FireChatSettingsInviteButton from '@/components/FireChat/FireChatSettings/FireChatSettingsInviteButton';
import FireChatSettingsParticipantsItem from '@/components/FireChat/FireChatSettings/FireChatSettingsParticipantsItem';

function FireChatSettingsParticipants<
    C extends FireChannel<M, T>,
    U extends FireUser,
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ participants, channel }: { participants: U[]; channel?: C }) {
    const { user: me } = useFireAuth();
    // FireChat 컨텍스트에서 현재 선택된 채널 정보 가져오기
    // 참여자 목록을 보여줌

    const sortedParticipants = participants
        ? participants.sort((a, b) =>
              b[USER_NAME_FIELD].localeCompare(a[USER_NAME_FIELD])
          )
        : [];

    return (
        <Card className="gap-4 p-2 md:py-5 md:px-4 shadow-none w-full">
            <div className="flex items-center gap-2">
                {/* <Users className="w-4 h-4 text-primary" /> */}
                <h2 className="text-sm font-semibold tracking-tight">
                    {FIRE_CHAT_LOCALE.SIDEBAR.PARTICIPANTS}
                    <span className="ml-1.5 text-muted-foreground">
                        {sortedParticipants.length}
                    </span>
                </h2>
            </div>

            <div className="flex flex-col gap-1">
                {sortedParticipants.length === 0 ? (
                    <span className="text-sm text-muted-foreground text-center py-6">
                        {FIRE_CHAT_LOCALE.SIDEBAR.NO_PARTICIPANTS}
                    </span>
                ) : (
                    sortedParticipants.map((user) => (
                        <FireChatSettingsParticipantsItem
                            key={user[USER_ID_FIELD]}
                            channel={channel}
                            user={user}
                        />
                    ))
                )}
                {channel?.[CHANNEL_HOST_ID_FIELD] === me?.[USER_ID_FIELD] && (
                    <FireChatSettingsInviteButton
                        // reFetchChannelParticipants={reFetchChannelParticipants}
                        channelId={channel?.[CHANNEL_ID_FIELD] || ''}
                    />
                )}
            </div>
        </Card>
    );
}

export default memo(FireChatSettingsParticipants);
