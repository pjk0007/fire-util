import FireChat from '@/components/FireChat/FireChat';
import { useRouter } from 'next/router';

export default function ChannelPage() {
    const router = useRouter();
    const { channelId } = router.query;

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            <FireChat />;
        </div>
    );
}
