import { memo, useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import {
    FireDatabaseRow,
    FireDatabaseDataString,
} from '@/components/FireDatabase/settings/types/row';

interface StringCellProps {
    table: Table<FireDatabaseRow>;
    databaseId: string;
    columnId: string;
    data: FireDatabaseRow;
}

function StringCell({ table, databaseId, columnId, data }: StringCellProps) {
    const { setRows } = useFireDatabase();
    // const [value, setValue] = useState<string>(data.data?.[columnId] as string || '');
    const value = data.data?.[columnId] as FireDatabaseDataString;

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLDivElement>) => {
            const newValue = e.currentTarget.textContent || '';
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
        },
        [databaseId, data.id, columnId, setRows]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
            ) {
                e.currentTarget.blur();
            }
        },
        []
    );

    const handleFocus = useCallback(() => {
        table?.resetRowSelection();
    }, [table]);

    return (
        <div
            key={`${databaseId}-${data.id}-${columnId}`}
            className="p-2 w-full h-full focus:outline-none focus:shadow-lg focus:border focus:rounded-lg focus:z-[100] whitespace-pre-wrap break-words min-h-[24px] cursor-text break-all"
            contentEditable
            suppressContentEditableWarning
            // onInput={(e) => setValue(e.currentTarget.textContent || '')}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            role="textbox"
            aria-multiline="true"
            tabIndex={0}
        >
            {value}
        </div>
    );
}

export default memo(StringCell);
