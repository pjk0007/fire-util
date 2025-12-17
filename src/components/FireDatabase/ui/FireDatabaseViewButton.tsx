import {
    FireDatabaseView,
    FireDatabaseViewType,
} from '@/components/FireDatabase/settings/types/database';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarDays, Columns3, LayoutGrid, Plus, Table } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import createView from '@/components/FireDatabase/api/createView';

export default function FireDatabaseViewButton({
    view,
    selectedViewId,
    setSelectedViewId,
    refetchViews,
}: {
    view: FireDatabaseView;
    selectedViewId: string | null;
    setSelectedViewId: (id: string) => void;
    refetchViews: () => void;
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
            onClick={() => {
                setSelectedViewId(view.id);
                refetchViews();
            }}
        >
            <ViewIcon type={view.type} />
            {view.name}
        </Button>
    );
}

export function FireDatabaseViewAddButton() {
    const [open, setOpen] = useState(false);
    const { databaseId, columns, refetchViews } = useFireDatabase();

    const viewTypes: {
        type: FireDatabaseViewType;
        label: string;
        icon: React.ReactNode;
    }[] = [
        { type: 'table', label: '테이블', icon: <Table className="h-4 w-4" /> },
        {
            type: 'kanban',
            label: '칸반',
            icon: <Columns3 className="h-4 w-4" />,
        },
        {
            type: 'gallery',
            label: '갤러리',
            icon: <LayoutGrid className="h-4 w-4" />,
        },
        {
            type: 'calendar',
            label: '캘린더',
            icon: <CalendarDays className="h-4 w-4" />,
        },
    ];

    const handleCreateView = async (type: FireDatabaseViewType) => {
        const viewName = `새 ${viewTypes.find((v) => v.type === type)?.label}`;
        const newView: Omit<FireDatabaseView, 'id'> = {
            type,
            name: viewName,
            sorting: [],
            columnOrder: columns.map((col) => col.id),
            columnSizing: {},
            columnVisibility: {
                id: false,
                createdAt: false,
                updatedAt: false,
                name: true,
            },
            groupBy: null,
            filterBy: null,
        };

        await createView(databaseId, newView);
        refetchViews();
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size={'sm'}
                    variant={'ghost'}
                    className="rounded-full group-hover:visible invisible"
                >
                    <Plus />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
                <div className="flex flex-col gap-1">
                    {viewTypes.map((viewType) => (
                        <div
                            key={viewType.type}
                            className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer rounded"
                            onClick={() => handleCreateView(viewType.type)}
                        >
                            {viewType.icon}
                            <span className="text-sm">{viewType.label}</span>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
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
