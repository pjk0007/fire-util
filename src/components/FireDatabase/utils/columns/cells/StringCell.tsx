import { memo, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import { FireDatabaseRow, FireDatabaseDataString } from '@/components/FireDatabase/settings/types/row';

interface StringCellProps {
    table: Table<any>;
    databaseId: string;
    columnId: string;
    data: FireDatabaseRow;
}

function StringCell({ table, databaseId, columnId, data }: StringCellProps) {
    const { setRows } = useFireDatabase();
    const stringData = data.data?.[columnId] as FireDatabaseDataString;

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
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

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.currentTarget.blur();
        }
    }, []);

    const handleFocus = useCallback(() => {
        table?.resetRowSelection();
    }, [table]);

    return (
        <input
            key={`${databaseId}-${data.id}-${columnId}`}
            id={`string-input-${data.id}-${columnId}`}
            className="p-2 w-full focus:outline-none h-full focus:shadow-lg focus:border focus:rounded-lg focus:z-[100]"
            defaultValue={stringData || ''}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="텍스트를 입력해주세요"
        />
    );
}

export default memo(StringCell);
