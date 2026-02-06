import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import useFireChannelInfo from '@/components/FireChannel/hook/useFireChannelInfo';
import { CHANNEL_COLLECTION, CHANNEL_TASK_NOTIFICATION_FIELD } from '@/components/FireChannel/settings';
import FireTaskClassAddNew from '@/components/FireTask/FireTaskClass/FireTaskClassAddNew';
import { TASK_MAIN_HEADER_HEIGHT } from '@/components/FireTask/FireTaskMain';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import { FIRE_TASK_LOCALE } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { BellOff, BellRing } from 'lucide-react';

export default function FireTaskMainHeader() {
    const { selectedChannelId } = useFireChannel();
    const { channel } = useFireChannelInfo({ channelId: selectedChannelId });
    const taskNotificationEnabled = channel?.[CHANNEL_TASK_NOTIFICATION_FIELD] ?? true;

    return (
        <div
            className={cn('flex self-start items-center gap-2 md:px-2 px-2')}
            style={{ height: TASK_MAIN_HEADER_HEIGHT }}
        >
            <span
                className={cn(
                    'font-semibold md:text-left  text-center'
                )}
            >
                {FIRE_TASK_LOCALE.TASK_LIST}
            </span>
            <div className="flex items-center gap-1 ml-auto">
                <div className="flex items-center gap-1">
                    {taskNotificationEnabled ? (
                        <BellRing className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                        <BellOff className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                        {FIRE_TASK_LOCALE.NOTIFICATION.TOGGLE_LABEL}
                    </span>
                    <Switch
                        checked={taskNotificationEnabled}
                        onCheckedChange={(checked) => {
                            if (selectedChannelId) {
                                updateDoc(
                                    doc(db, CHANNEL_COLLECTION, selectedChannelId),
                                    { [CHANNEL_TASK_NOTIFICATION_FIELD]: checked }
                                );
                            }
                        }}
                        className="scale-75"
                    />
                </div>
                <FireTaskClassAddNew size={'small'} />
            </div>
        </div>
    );
}
