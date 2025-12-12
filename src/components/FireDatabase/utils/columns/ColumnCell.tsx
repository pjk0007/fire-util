import { memo } from 'react';
import { Row, Table } from '@tanstack/react-table';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';
import NameCell from '@/components/FireDatabase/utils/columns/cells/NameCell';
import StringCell from '@/components/FireDatabase/utils/columns/cells/StringCell';
import NumberCell from '@/components/FireDatabase/utils/columns/cells/NumberCell';
import BooleanCell from '@/components/FireDatabase/utils/columns/cells/BooleanCell';
import DateCell from '@/components/FireDatabase/utils/columns/cells/DateCell';

interface ColumnCellProps {
    table: Table<any>;
    databaseId: string;
    column: FireDatabaseColumn;
    row: Row<any>;
}

function ColumnCell({ table, databaseId, column, row }: ColumnCellProps) {
    const data = row.original as FireDatabaseRow;

    switch (column.type) {
        case 'id':
            return <div className="p-2">{data.id}</div>;
        case 'name':
            return (
                <NameCell
                    table={table}
                    databaseId={databaseId}
                    columnId={column.id}
                    data={data}
                />
            );
        case 'createdAt':
            return (
                <div className="p-2">
                    {Intl.DateTimeFormat('default', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                    }).format(data.createdAt.toDate())}
                </div>
            );
        case 'updatedAt':
            return (
                <div className="p-2">
                    {Intl.DateTimeFormat('default', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                    }).format(data.updatedAt.toDate())}
                </div>
            );
        case 'string':
            return (
                <StringCell
                    table={table}
                    databaseId={databaseId}
                    columnId={column.id}
                    data={data}
                />
            );
        case 'number':
            return (
                <NumberCell
                    table={table}
                    databaseId={databaseId}
                    columnId={column.id}
                    data={data}
                />
            );
        case 'boolean':
            return (
                <BooleanCell
                    databaseId={databaseId}
                    columnId={column.id}
                    data={data}
                />
            );
        case 'date':
            return (
                <DateCell
                    databaseId={databaseId}
                    column={column}
                    data={data}
                />
            );
        default:
            return column.name;
    }
}

export default memo(ColumnCell);
