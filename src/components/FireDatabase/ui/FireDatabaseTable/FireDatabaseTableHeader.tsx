import { TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import FireDatabaseTableHead from './FireDatabaseTableHeader/FireDatabaseTableHead';
import {
    horizontalListSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ColumnOrderState, Table } from '@tanstack/react-table';
import FireDatabaseTableAddColumn from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableHeader/FireDatabaseTableAddColumn';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';

export default function FireDatabaseTableHeader<TData>({
    table,
    columnOrder,
}: {
    table: Table<TData>;
    columnOrder: ColumnOrderState;
}) {
    return (
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent group"
                    style={{
                        border: 'none',
                    }}
                >
                    <TableCell className="w-10 p-0 sticky left-0 bg-background z-10">
                        <div
                            className="flex items-center justify-center h-full bg-background cursor-pointer"
                            onClick={() => {
                                table.toggleAllRowsSelected(
                                    !table.getIsAllRowsSelected()
                                );
                            }}
                        >
                            <Checkbox
                                checked={table.getIsAllRowsSelected()}
                                className={`transition-opacity ${
                                    table.getIsSomeRowsSelected() ||
                                    table.getIsAllRowsSelected()
                                        ? 'opacity-100'
                                        : 'opacity-0 group-hover:opacity-100 hover:bg-gray-100'
                                }`}
                            />
                        </div>
                    </TableCell>
                    <SortableContext
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                    >
                        {headerGroup.headers.map((header) => (
                            <FireDatabaseTableHead
                                key={header.id}
                                header={header}
                            />
                        ))}
                    </SortableContext>
                    <FireDatabaseTableAddColumn />
                </TableRow>
            ))}
        </TableHeader>
    );
}
