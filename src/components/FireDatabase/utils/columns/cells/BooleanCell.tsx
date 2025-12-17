import { memo, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';

interface BooleanCellProps {
    databaseId: string;
    columnId: string;
    data: FireDatabaseRow;
}

function BooleanCell({ databaseId, columnId, data }: BooleanCellProps) {
    const { setRows } = useFireDatabase();

    const handleCheckedChange = useCallback((checked: boolean) => {
        // Optimistic update
        setRows((prev) =>
            prev.map((r) =>
                r.id === data.id
                    ? {
                          ...r,
                          data: { ...r.data, [columnId]: checked },
                      }
                    : r
            )
        );
        // Update database
        updateRowData(databaseId, data.id, {
            [columnId]: checked,
        });
    }, [databaseId, data.id, columnId, setRows]);

    return (
        <Checkbox
            key={`${databaseId}-${data.id}-${columnId}`}
            className="m-2 size-4"
            defaultChecked={Boolean(data.data?.[columnId])}
            onCheckedChange={handleCheckedChange}
        />
    );
}

export default memo(BooleanCell);
