import updateRowName from '@/components/FireDatabase/api/updateRowName';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';
import { Row, Table } from '@tanstack/react-table';
import { CaseSensitive, Clock3 } from 'lucide-react';

export default function ColumnCell({
    table,
    databaseId,
    column,
    row,
    refetchRows,
}: {
    table: Table<any>;
    databaseId: string;
    column: FireDatabaseColumn;
    row: Row<any>;
    refetchRows?: () => void;
}) {
    console.log(table);

    const data = row.original as FireDatabaseRow;
    switch (column.type) {
        case 'id':
            return <div className="p-2">{data.id}</div>;
        case 'name':
            return (
                <input
                    id={'name-input'}
                    className="p-2 w-full focus:outline-none h-full focus:shadow-lg focus:border focus:rounded-lg focus:z-[100]"
                    defaultValue={data.name}
                    onBlur={(e) =>
                        updateRowName(
                            databaseId,
                            data.id,
                            e.currentTarget.value
                        ).then(() => {
                            refetchRows && refetchRows();
                        })
                    }
                    onFocus={() => table?.resetRowSelection()}
                    placeholder="이름을 입력해주세요"
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
        default:
            return column.name;
    }
}
