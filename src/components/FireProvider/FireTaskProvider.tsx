import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import FireTaskSheet from '@/components/FireTask/FireTaskSheet';
import { FireUser } from '@/lib/FireAuth/settings';
import useFireChannelInfo from '@/lib/FireChannel/hook/useFireChannelInfo';
import useFireTaskList from '@/lib/FireTask/hook/useFireTaskList';
import { FireTask } from '@/lib/FireTask/settings';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

interface FireTaskContextValue<FT extends FireTask<FU>, FU extends FireUser> {
    tasks: FT[];
    selectedTask?: FT;
    setSelectedTaskId: (taskId?: string) => void;
    draggingTaskId?: string;
    setDraggingTaskId: (taskId?: string) => void;
}

const FireTaskContext = createContext<
    FireTaskContextValue<FireTask<FireUser>, FireUser>
>({
    tasks: [],
    selectedTask: undefined,
    setSelectedTaskId: () => {},
    draggingTaskId: undefined,
    setDraggingTaskId: () => {},
});

export const useFireTask = () => useContext(FireTaskContext);

interface FireTaskProviderProps {
    children: ReactNode;
    defaultTaskId?: string;
}

export function FireTaskProvider<FT extends FireTask<FU>, FU extends FireUser>({
    children,
    defaultTaskId,
}: FireTaskProviderProps) {
    const { selectedChannelId: channelId } = useFireChannel();
    const { participants } = useFireChannelInfo({
        channelId: channelId,
    });
    const { tasks } = useFireTaskList<FT, FU>(channelId);
    const [draggingTaskId, setDraggingTaskId] = useState<string | undefined>(
        undefined
    );
    const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
        undefined
    );
    const selectedTask = tasks.find((task) => task['id'] === selectedTaskId);

    useEffect(() => {
        if (defaultTaskId) {
            setSelectedTaskId(defaultTaskId);
        }
    }, [defaultTaskId]);

    return (
        <FireTaskContext.Provider
            value={
                {
                    tasks,
                    selectedTask,
                    setSelectedTaskId,
                    draggingTaskId,
                    setDraggingTaskId,
                } as FireTaskContextValue<FireTask<FireUser>, FireUser>
            }
        >
            <FireTaskSheet task={selectedTask} participants={participants} />
            {children}
        </FireTaskContext.Provider>
    );
}
