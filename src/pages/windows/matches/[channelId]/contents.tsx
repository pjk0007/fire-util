import { FireChatProvider } from '@/components/FireProvider/FireChatProvider';
import FireChatContents from '@/components/FireChat/FireChatContents';
import { useRouter } from 'next/router';

export default function ChannelPage() {
    const router = useRouter();
    const { tab } = router.query;

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            <FireChatProvider>
                <FireChatContents
                    defatultTab={
                        typeof tab === 'string'
                            ? (tab as 'image' | 'file')
                            : undefined
                    }
                />
            </FireChatProvider>
        </div>
    );
}
