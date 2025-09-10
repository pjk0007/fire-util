import {
    CHANNEL_HOST_ID_FIELD,
    LOCALE,
    USER_EMAIL_FIELD,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    USER_AVATAR_FIELD,
    USER_NAME_FIELD,
    USER_AVATAR_FALLBACK_URL,
} from '@/lib/FireChat/settings';
import Image from 'next/image';
import { Plus, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FireChatChannelSidebarParticipants() {
    // FireChat 컨텍스트에서 현재 선택된 채널 정보 가져오기
    // 참여자 목록을 보여줌

    const { selectedChannel, user: me } = useFireChat();
    const participants = selectedChannel?.participants
        ? selectedChannel.participants.sort((a, b) =>
              b[USER_NAME_FIELD].localeCompare(a[USER_NAME_FIELD])
          )
        : [];

    return (
        <Card className="gap-1 p-2">
            <div className="flex items-center gap-2 p-2">
                <Users className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold tracking-tight">
                    {LOCALE.SIDEBAR.PARTICIPANTS} {participants.length}
                </h2>
            </div>
            {selectedChannel?.channel[CHANNEL_HOST_ID_FIELD] ===
                me?.[USER_ID_FIELD] && (
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
                    <div>
                        {/* 추가 액션 버튼이나 상태 표시 등을 여기에 넣을 수 있음 */}
                    </div>
                </div>
            )}
            {participants.length === 0 ? (
                <span className="text-sm text-muted-foreground text-center py-6">
                    {LOCALE.SIDEBAR.NO_PARTICIPANTS}
                </span>
            ) : (
                participants.map((user) => (
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
                                            {LOCALE.SIDEBAR.ME}
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
                        </div>
                    </div>
                ))
            )}
        </Card>
    );
}
