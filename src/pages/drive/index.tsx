import { FireDrive, FIRE_DRIVE_LOCALE } from '@/components/FireDrive';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function DrivePage() {
    const { user } = useFireAuth();
    const { channels, selectedChannelId, setSelectedChannelId } = useFireChannel();

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-muted-foreground">로그인이 필요합니다.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            {/* 헤더 */}
            <header className="flex items-center justify-between p-4 border-b bg-background">
                <h1 className="text-xl font-bold">{FIRE_DRIVE_LOCALE.TITLE}</h1>

                <div className="flex items-center gap-4">
                    <Select
                        value={selectedChannelId || ''}
                        onValueChange={(value) => setSelectedChannelId(value || undefined)}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="채널을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                            {channels.map((channel) => (
                                <SelectItem key={channel.id} value={channel.id}>
                                    {channel.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span className="text-sm text-muted-foreground">
                        {user.name || user.email}
                    </span>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main className="flex-1 overflow-hidden">
                {selectedChannelId ? (
                    <FireDrive channelId={selectedChannelId} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">
                            채널을 선택하면 파일 저장소를 사용할 수 있습니다.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
