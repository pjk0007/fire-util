import { memo, useCallback, useState } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import {
    FireDatabaseRow,
    FireDatabaseDataMultiSelect,
} from '@/components/FireDatabase/settings/types/row';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface MultiSelectCellProps {
    table: Table<any>;
    databaseId: string;
    column: FireDatabaseColumn;
    data: FireDatabaseRow;
}

function MultiSelectCell({
    table,
    databaseId,
    column,
    data,
}: MultiSelectCellProps) {
    const { setRows } = useFireDatabase();
    const [open, setOpen] = useState(false);
    const multiSelectData = (data.data?.[column.id] ||
        []) as FireDatabaseDataMultiSelect;
    const options = column.options || [];

    const handleToggle = useCallback(
        (option: string) => {
            const currentValues = Array.isArray(multiSelectData)
                ? multiSelectData
                : [];
            const newValues = currentValues.includes(option)
                ? currentValues.filter((v) => v !== option)
                : [...currentValues, option];

            // Optimistic update
            setRows((prev) =>
                prev.map((r) =>
                    r.id === data.id
                        ? {
                              ...r,
                              data: { ...r.data, [column.id]: newValues },
                          }
                        : r
                )
            );

            // Update database
            updateRowData(databaseId, data.id, {
                [column.id]: newValues,
            });
        },
        [databaseId, data.id, column.id, multiSelectData, setRows]
    );

    const selectedValues = Array.isArray(multiSelectData)
        ? multiSelectData
        : [];

    return (
        <Popover
            key={`${databaseId}-${data.id}-${column.id}`}
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <div className="p-2 flex items-center gap-1 w-full h-full focus:outline-none focus:shadow-lg focus:border focus:rounded-lg focus:z-[100] cursor-pointer flex-wrap">
                    {selectedValues.length > 0 ? (
                        selectedValues.map((value) => (
                            <Badge
                                key={value}
                                variant="secondary"
                                className="text-xs"
                            >
                                {value}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground text-xs">
                            선택...
                        </span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
                <div className="flex flex-col gap-1">
                    {options.map((option) => (
                        <div
                            key={option}
                            className="flex items-center justify-between p-2 hover:bg-accent cursor-pointer rounded"
                            onClick={() => handleToggle(option)}
                        >
                            <span className="text-sm">{option}</span>
                            {selectedValues.includes(option) && (
                                <Check className="h-4 w-4" />
                            )}
                        </div>
                    ))}
                    {options.length === 0 && (
                        <div className="text-xs text-muted-foreground p-2">
                            옵션이 없습니다
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default memo(MultiSelectCell);
