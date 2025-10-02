import FireTaskClassCardMain from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardMain';
import FireTaskClassCardMenu from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardMenu';
import FireTaskClassCardSub from '@/components/FireTask/FireTaskClass/FireTaskClassCard/FireTaskClassCardSub';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FireUser } from '@/lib/FireAuth/settings';
import { FireTask } from '@/lib/FireTask/settings';
import { Ellipsis, PenLine } from 'lucide-react';
import { useState } from 'react';

interface FireTaskClassCardProps<FT extends FireTask<FU>, FU extends FireUser> {
    task: FT;
}

export default function FireTaskClassCard<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardProps<FT, FU>) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    return (
        <Card className="relative p-3 rounded-lg h-24 flex flex-col justify-between gap-0 hover:shadow-md cursor-pointer group">
            <FireTaskClassCardMain
                task={task}
                isEditingTitle={isEditingTitle}
                setIsEditingTitle={setIsEditingTitle}
            />
            <FireTaskClassCardSub task={task} />
            <FireTaskClassCardMenu
                isEditingTitle={isEditingTitle}
                setIsEditingTitle={setIsEditingTitle}
            />
        </Card>
    );
}
