import FireChat from '@/components/FireChat/FireChat';
import FireChatChannelRoom from '@/components/FireChat/FireChatChannelRoom';
import { useRouter } from 'next/router';

export default function ChannelPage() {
    const router = useRouter();
    const { channelId } = router.query;

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            <FireChatChannelRoom channelId={channelId as string | undefined} />
        </div>
    );
}
