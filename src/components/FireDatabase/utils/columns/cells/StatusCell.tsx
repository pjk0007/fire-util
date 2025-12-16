import { memo, useCallback, useState } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import {
    FireDatabaseRow,
    FireDatabaseDataSelect,
    FireDatabaseDataStatus,
} from '@/components/FireDatabase/settings/types/row';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BADGE_COLORS } from '@/components/FireDatabase/settings/colors';

interface StatusCellProps {
    table: Table<any>;
    databaseId: string;
    column: FireDatabaseColumn;
    data: FireDatabaseRow;
}

function StatusCell({ table, databaseId, column, data }: StatusCellProps) {
    const { setRows } = useFireDatabase();
    const [open, setOpen] = useState(false);
    const statusData = data.data?.[column.id] as FireDatabaseDataStatus;
    const options = column.options || [];

    const handleSelect = useCallback(
        (option: string | null) => {
            // Optimistic update
            setRows((prev) =>
                prev.map((r) =>
                    r.id === data.id
                        ? {
                              ...r,
                              data: { ...r.data, [column.id]: option },
                          }
                        : r
                )
            );

            // Update database
            updateRowData(databaseId, data.id, {
                [column.id]: option,
            });

            setOpen(false);
        },
        [databaseId, data.id, column.id, statusData, setRows]
    );

    const handleFocus = useCallback(() => {
        table?.resetRowSelection();
    }, [table]);

    return (
        <Popover
            key={`${databaseId}-${data.id}-${column.id}`}
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <div
                    className="p-2 flex items-center w-full h-full focus:outline-none focus:shadow-lg focus:border focus:rounded-lg focus:z-[100] cursor-pointer"
                    onFocus={handleFocus}
                >
                    {statusData ? (
                        <Badge
                            className={cn(
                                'text-xs font-medium',
                                column.options?.[statusData]
                                    ? `${
                                          BADGE_COLORS[
                                              column.options[statusData].color
                                          ].background
                                      } text-black/70`
                                    : 'bg-gray-100 text-gray-700'
                            )}
                        >
                            <Circle
                                className={cn(
                                    'h-1.5 w-1.5 fill-current',
                                    column.options?.[statusData]
                                        ? BADGE_COLORS[
                                              column.options[statusData].color
                                          ].text
                                        : 'text-gray-500'
                                )}
                            />
                            {column.options?.[statusData].name}
                        </Badge>
                    ) : (
                        <Badge
                            className={cn(
                                'text-xs font-medium',
                                column.default
                                    ? `${
                                          BADGE_COLORS[column.default.color]
                                              .background
                                      } text-black/70`
                                    : 'bg-gray-100 text-gray-700'
                            )}
                        >
                            <Circle
                                className={cn(
                                    'h-2 w-2 mr-1 fill-current',
                                    column.default?.color
                                        ? BADGE_COLORS[column.default.color]
                                              .text
                                        : 'text-gray-500'
                                )}
                            />
                            {column.default ? column.default.name : '선택...'}
                        </Badge>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
                <div className="flex flex-col gap-1">
                    <div
                        className="flex items-center justify-between p-1 hover:bg-accent cursor-pointer rounded"
                        onClick={() => handleSelect(null)}
                    >
                        <Badge
                            className={cn(
                                'text-xs font-medium',
                                column.default?.color
                                    ? `${
                                          BADGE_COLORS[column.default.color]
                                              .background
                                      } text-black/70`
                                    : 'bg-gray-100 text-gray-700'
                            )}
                        >
                            <Circle
                                className={cn(
                                    'h-1.5 w-1.5 fill-current',
                                    column.default?.color
                                        ? BADGE_COLORS[column.default.color]
                                              .text
                                        : 'text-gray-500'
                                )}
                            />
                            {column.default ? column.default.name : '선택...'}
                        </Badge>
                        {(statusData === null || statusData === undefined) && (
                            <Check className="h-4 w-4" />
                        )}
                    </div>
                    {Object.entries(options).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between p-1 hover:bg-accent cursor-pointer rounded"
                            onClick={() => handleSelect(key)}
                        >
                            <Badge
                                className={cn(
                                    'text-xs font-medium',
                                    value.color
                                        ? `${
                                              BADGE_COLORS[value.color]
                                                  .background
                                          } text-black/70`
                                        : 'bg-gray-100 text-gray-700'
                                )}
                            >
                                <Circle
                                    className={cn(
                                        'h-1.5 w-1.5 fill-current',
                                        value.color
                                            ? BADGE_COLORS[value.color].text
                                            : 'text-gray-500'
                                    )}
                                />
                                {value.name}
                            </Badge>
                            {statusData === key && (
                                <Check className="h-4 w-4" />
                            )}
                        </div>
                    ))}
                    {Object.keys(options).length === 0 && (
                        <div className="text-xs text-muted-foreground p-2">
                            옵션이 없습니다
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default memo(StatusCell);
