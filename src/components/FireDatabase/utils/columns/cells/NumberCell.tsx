import { memo, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import { FireDatabaseRow, FireDatabaseDataNumber } from '@/components/FireDatabase/settings/types/row';

interface NumberCellProps {
    table: Table<any>;
    databaseId: string;
    columnId: string;
    data: FireDatabaseRow;
}

function NumberCell({ table, databaseId, columnId, data }: NumberCellProps) {
    const { setRows } = useFireDatabase();
    const numberData = data.data?.[columnId] as FireDatabaseDataNumber;

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = Number(e.currentTarget.value);
        // Optimistic update
        setRows((prev) =>
            prev.map((r) =>
                r.id === data.id
                    ? {
                          ...r,
                          data: { ...r.data, [columnId]: newValue },
                      }
                    : r
            )
        );
        // Update database
        updateRowData(databaseId, data.id, {
            [columnId]: newValue,
        });
    }, [databaseId, data.id, columnId, setRows]);

    const handleFocus = useCallback(() => {
        table?.resetRowSelection();
    }, [table]);

    return (
        <input
            key={`${databaseId}-${data.id}-${columnId}`}
            id={`number-input-${data.id}-${columnId}`}
            className="p-2 w-full focus:outline-none h-full focus:shadow-lg focus:border focus:rounded-lg focus:z-[100]"
            defaultValue={
                numberData !== undefined &&
                typeof numberData === 'number'
                    ? Number(numberData)
                    : ''
            }
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="숫자를 입력해주세요"
        />
    );
}

export default memo(NumberCell);
