import { useFireChannel } from '@/components/FireProvider/FireChannelProvider';
import { FireUser } from '@/lib/FireAuth/settings';
import useFireTaskList from '@/lib/FireTask/hook/useFireTaskList';
import { FireTask } from '@/lib/FireTask/settings';
import { createContext, ReactNode, useContext } from 'react';

interface FireTaskContextValue<FT extends FireTask<FU>, FU extends FireUser> {
    tasks: FT[];
    selectedTask?: FT;
    setSelectedTask: (task?: FT) => void;
}

const FireTaskContext = createContext<
    FireTaskContextValue<FireTask<FireUser>, FireUser>
>({
    tasks: [],
    selectedTask: undefined,
    setSelectedTask: () => {},
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

    return (
        <FireTaskContext.Provider
            value={{
                tasks,
                selectedTask: undefined,
                setSelectedTask: () => {},
            }}
        >
            {children}
        </FireTaskContext.Provider>
    );
}
