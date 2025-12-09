import { Checkbox } from '@/components/ui/checkbox';
import FireDatabaseTableCell from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableCell';

import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function FireDatabaseTableBody<TData>({
    table,
}: {
    table: Table<TData>;
}) {
    return (
        <TableBody>
            {table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    className={`group transition-colors border-0 ${
                        row.getIsSelected()
                            ? 'bg-blue-100 hover:bg-blue-100'
                            : 'bg-background hover:bg-background'
                    }`}
                >
                    <TableCell className={`w-10 p-0 h-10 sticky left-0 z-10`}>
                        <div
                            className={cn(
                                'flex items-center justify-center h-full cursor-pointer',
                                {
                                    'bg-blue-100': row.getIsSelected(),
                                    'bg-background': !row.getIsSelected(),
                                }
                            )}
                            onClick={() => {
                                row.toggleSelected(!row.getIsSelected());
                            }}
                        >
                            <Checkbox
                                checked={row.getIsSelected()}
                                className={`transition-opacity ${
                                    row.getIsSelected()
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
            ))}
        </TableBody>
    );
}
