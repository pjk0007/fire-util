import { FireChatChannelProvider } from '@/components/FireProvider/FireChatChannelProvider';
import FireChatContents from '@/components/FireChat/FireChatContents';
import { useRouter } from 'next/router';

export default function ChannelPage() {
    const router = useRouter();
    const { channelId, tab } = router.query;

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            <FireChatChannelProvider
                channelId={channelId as string | undefined}
            >
                <FireChatContents
                    defatultTab={
                        typeof tab === 'string'
                            ? (tab as 'image' | 'file')
                            : undefined
                    }
                />
            </FireChatChannelProvider>
        </div>
    );
}
