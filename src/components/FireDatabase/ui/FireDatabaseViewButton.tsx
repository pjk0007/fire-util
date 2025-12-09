import {
    FireDatabaseView,
    FireDatabaseViewType,
} from '@/components/FireDatabase/settings/types/database';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarDays, Columns3, LayoutGrid, Plus, Table } from 'lucide-react';

export default function FireDatabaseViewButton({
    view,
    selectedViewId,
    setSelectedViewId,
}: {
    view: FireDatabaseView;
    selectedViewId: string | null;
    setSelectedViewId: (id: string) => void;
}) {
    return (
        <Button
            size={'sm'}
            key={view.id}
            variant={'ghost'}
            className={cn('rounded-full', {
                'bg-muted text-foreground': selectedViewId === view.id,
                'text-muted-foreground': selectedViewId !== view.id,
            })}
            onClick={() => setSelectedViewId(view.id)}
        >
            <ViewIcon type={view.type} />
            {view.name}
        </Button>
    );
}

export function FireDatabaseViewAddButton() {
    return (
        <Button
            size={'sm'}
            variant={'ghost'}
            className="rounded-full group-hover:visible invisible"
        >
            <Plus />
        </Button>
    );
}

function ViewIcon({ type }: { type: FireDatabaseViewType }) {
    switch (type) {
        case 'table':
            return <Table />;
        case 'kanban':
            return <Columns3 />;
        case 'gallery':
            return <LayoutGrid />;
        case 'calendar':
            return <CalendarDays />;
        default:
            return <Table />;
    }
}
