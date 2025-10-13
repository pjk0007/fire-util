import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { FireUser } from '@/lib/FireAuth/settings';
import useFireTaskList from '@/lib/FireTask/hook/useFireTaskList';
import { FireTask } from '@/lib/FireTask/settings';
import { createContext, ReactNode, useContext, useState } from 'react';

interface FireTaskContextValue<FT extends FireTask<FU>, FU extends FireUser> {
    tasks: FT[];
    selectedTask?: FT;
    setSelectedTask: (task?: FT) => void;
    draggingTaskId?: string;
    setDraggingTaskId: (taskId?: string) => void;
}

const FireTaskContext = createContext<
    FireTaskContextValue<FireTask<FireUser>, FireUser>
>({
    tasks: [],
    selectedTask: undefined,
    setSelectedTask: () => {},
    draggingTaskId: undefined,
    setDraggingTaskId: () => {},
});

export const useFireTask = () => useContext(FireTaskContext);

interface FireTaskProviderProps {
    children: ReactNode;
}

export function FireTaskProvider<FT extends FireTask<FU>, FU extends FireUser>({
    children,
}: FireTaskProviderProps) {
    const { selectedChannelId: channelId } = useFireChannel();
    const { tasks } = useFireTaskList<FT, FU>(channelId);
    const [draggingTaskId, setDraggingTaskId] = useState<string | undefined>(
        undefined
    );

    return (
        <FireTaskContext.Provider
            value={{
                tasks,
                selectedTask: undefined,
                setSelectedTask: () => {},
                draggingTaskId,
                setDraggingTaskId,
            }}
        >
            {children}
        </FireTaskContext.Provider>
    );
}
