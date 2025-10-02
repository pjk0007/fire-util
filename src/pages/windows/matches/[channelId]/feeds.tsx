import { FireChatProvider } from '@/components/FireProvider/FireChatProvider';
import { FireTaskProvider } from '@/components/FireProvider/FireTaskProvider';
import FireTaskMain from '@/components/FireTask/FireTaskMain';

export default function ChannelFeeds() {
    return (
        <FireTaskProvider>
            <div className="w-screen h-screen relative overflow-hidden pt-4 px-4">
                <FireTaskMain dir={'row'} />
            </div>
        </FireTaskProvider>
    );
}
