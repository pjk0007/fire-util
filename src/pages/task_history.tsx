import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import FireTaskHistory from '@/components/FireTask/FireTaskHistory';

export default function TaskHistory() {
    const { channels } = useFireChannel();
    return (
        <div className="m-4 w-full">
            <FireTaskHistory
                title="Task History"
                description="Recent activities on your tasks"
                channelIds={channels.map((channel) => channel.id)}
                taskHrefBuilder={(channelId, taskId) =>
                    `/?channelId=${channelId}&taskId=${taskId}`
                }
                className="h-80"
            />
        </div>
    );
}
