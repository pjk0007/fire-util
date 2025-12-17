import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';
import ColumnCell from '@/components/FireDatabase/utils/columns/ColumnCell';
import ColumnHeader from '@/components/FireDatabase/utils/columns/ColumnHeader';
import { ColumnDef } from '@tanstack/react-table';

export function databaseToTableColumns(
    databaseId: string,
    columns: FireDatabaseColumn[]
): ColumnDef<FireDatabaseRow>[] {
    return columns.map((column) => columnToTableColumn(databaseId, column));
}

export function columnToTableColumn(
    databaseId: string,
    column: FireDatabaseColumn
): ColumnDef<FireDatabaseRow> {
    switch (column.type) {
        case 'id':
        case 'name':
        case 'createdAt':
        case 'updatedAt':
        case 'string':
        case 'number':
        case 'boolean':
        case 'date':
        case 'status':
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
