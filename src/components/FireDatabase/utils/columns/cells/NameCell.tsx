import { memo, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowName from '@/components/FireDatabase/api/updateRowName';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';

interface NameCellProps {
    table: Table<FireDatabaseRow>;
    databaseId: string;
    columnId: string;
    data: FireDatabaseRow;
}

function NameCell({ table, databaseId, columnId, data }: NameCellProps) {
    const { setRows } = useFireDatabase();

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        // Optimistic update
        setRows((prev) =>
            prev.map((r) =>
                r.id === data.id ? { ...r, name: newValue } : r
            )
        );
        // Update database
        updateRowName(databaseId, data.id, newValue);
    }, [databaseId, data.id, setRows]);

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
            id={`name-input-${data.id}-${columnId}`}
            className="p-2 w-full focus:outline-none h-full focus:shadow-lg focus:border focus:rounded-lg focus:z-[100]"
            defaultValue={data.name}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="이름을 입력해주세요"
        />
    );
}

export default memo(NameCell);
