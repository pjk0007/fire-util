import { useCallback, ReactElement } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import FireDatabaseTableCell from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableCell';
import { cn } from '@/lib/utils';
import { Table, Row as TanStackRow } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

interface TableRowComponentProps<TData> {
    row: TanStackRow<TData>;
}

function TableRowComponent<TData>({
    row,
}: TableRowComponentProps<TData>) {
    const isSelected = row.getIsSelected();

    const handleToggleSelection = useCallback(() => {
        row.toggleSelected(!isSelected);
    }, [row, isSelected]);

    return (
        <TableRow
            className={`group transition-colors border-0 ${
                isSelected
                    ? 'bg-blue-100 hover:bg-blue-100'
                    : 'bg-background hover:bg-background'
            }`}
        >
            <TableCell className="w-10 p-0 h-10 sticky left-0 z-10">
                <div
                    className={cn(
                        'flex items-center justify-center h-full cursor-pointer',
                        {
                            'bg-blue-100': isSelected,
                            'bg-background': !isSelected,
                        }
                    )}
                    onClick={handleToggleSelection}
                >
                    <Checkbox
                        checked={isSelected}
                        className={`transition-opacity ${
                            isSelected
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100 hover:bg-gray-100'
                        }`}
                    />
                </div>
            </TableCell>
            {row.getVisibleCells().map((cell) => (
                <FireDatabaseTableCell key={cell.id} cell={cell} />
            ))}
            <TableCell className="border-b" />
        </TableRow>
    );
}

function FireDatabaseTableBody<TData>({
    table,
}: {
    table: Table<TData>;
}) {
    return (
        <TableBody>
            {table.getRowModel().rows.map((row) => (
                <TableRowComponent key={row.id} row={row} />
            ))}
        </TableBody>
    );
}

export default FireDatabaseTableBody;
