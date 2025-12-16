import { memo } from 'react';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import ColumnCell from '@/components/FireDatabase/utils/columns/ColumnCell';
import ColumnHeader from '@/components/FireDatabase/utils/columns/ColumnHeader';
import { ColumnDef } from '@tanstack/react-table';

export function databaseToTableColumns(
    databaseId: string,
    columns: FireDatabaseColumn[]
) {
    return columns.map((column) => columnToTableColumn(databaseId, column));
}

export function columnToTableColumn<TData>(
    databaseId: string,
    column: FireDatabaseColumn
): ColumnDef<TData> {
    switch (column.type) {
        case 'id':
        case 'name':
        case 'createdAt':
        case 'updatedAt':
        case 'string':
        case 'number':
        case 'boolean':
        case 'date':
        case 'select':
        case 'multi-select':
        case 'relation':
        case 'file':
        case 'formula':
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
                    />
                ),
            };

        default:
            return {
                id: column.id,
                accessorKey: column.id,
                header: column.name,
            };
    }
}
