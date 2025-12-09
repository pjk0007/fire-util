import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import ColumnCell from '@/components/FireDatabase/utils/columns/ColumnCell';
import ColumnHeader from '@/components/FireDatabase/utils/columns/ColumnHeader';
import { ColumnDef } from '@tanstack/react-table';
import { CaseSensitive, Clock3 } from 'lucide-react';

export function databaseToTableColumns(
    databaseId: string,
    columns: FireDatabaseColumn[],
    refetchRows?: () => void
) {
    return columns.map((column) =>
        columnToTableColumn(databaseId, column, refetchRows)
    );
}

export function columnToTableColumn<TData>(
    databaseId: string,
    column: FireDatabaseColumn,
    refetchRows?: () => void
): ColumnDef<TData> {
    console.log(column.type);
    switch (column.type) {
        case 'id':
        case 'name':
        case 'createdAt':
        case 'updatedAt':
            return {
                id: column.id,
                accessorKey: column.id,
                header: () => <ColumnHeader column={column} />,
                cell: (info) => (
                    <ColumnCell
                        table={info.table}
                        databaseId={databaseId}
                        column={column}
                        row={info.row}
                        refetchRows={refetchRows}
                    />
                ),
            };
        case 'string':
            return {
                id: column.id,
                accessorKey: column.id,
                header: column.name,
            };
        case 'number':
            return {
                id: column.id,
                accessorKey: column.id,
                header: column.name,
            };
        case 'boolean':
            return {
                id: column.id,
                accessorKey: column.id,
                header: column.name,
            };
        case 'date':
            return {
                id: column.id,
                accessorKey: column.id,
                header: column.name,
            };
        case 'select':
        case 'multi-select':
            return {
                id: column.id,
                accessorKey: column.id,
                header: column.name,
            };
        default:
            return {
                id: column.id,
                accessorKey: column.id,
                header: column.name,
            };
    }
}
