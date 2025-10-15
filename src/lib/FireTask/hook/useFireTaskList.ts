import { FireUser } from '@/lib/FireAuth/settings';
import { db } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { FireTask, TASK_COLLECTION } from '@/lib/FireTask/settings';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useFireTaskList<
    FT extends FireTask<FU>,
    FU extends FireUser
>(channelId?: string) {
    const [tasks, setTasks] = useState<FT[]>([]);

    useEffect(() => {
        if (!channelId) {
            setTasks([]);
            return;
        }

        const unsubscribe = onSnapshot(
            query(
                collection(db, CHANNEL_COLLECTION, channelId, TASK_COLLECTION)
            ),
            (snapshot) => {
                const tasksData = snapshot.docs.map((doc) => doc.data() as FT);
                setTasks(tasksData);
            }
        );

        return () => unsubscribe();
    }, [channelId]);

    return { tasks };
}
