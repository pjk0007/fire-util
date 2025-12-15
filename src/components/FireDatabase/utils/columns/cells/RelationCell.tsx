import { memo, useCallback, useState } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import {
    FireDatabaseRow,
    FireDatabaseDataRelation,
} from '@/components/FireDatabase/settings/types/row';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RelationCellProps {
    table: Table<any>;
    databaseId: string;
    column: FireDatabaseColumn;
    data: FireDatabaseRow;
}

function RelationCell({
    table,
    databaseId,
    column,
    data,
}: RelationCellProps) {
    const { setRows } = useFireDatabase();
    const [open, setOpen] = useState(false);
    const relationData = data.data?.[column.id] as FireDatabaseDataRelation;

    const handleClear = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            // Optimistic update
            setRows((prev) =>
                prev.map((r) =>
                    r.id === data.id
                        ? {
                              ...r,
                              data: { ...r.data, [column.id]: null },
                          }
                        : r
                )
            );

            // Update database
            updateRowData(databaseId, data.id, {
                [column.id]: null,
            });
        },
        [databaseId, data.id, column.id, setRows]
    );

    // TODO: Implement relation selection UI
    // This would require:
    // 1. Fetching available rows from the related database
    // 2. Showing them in a searchable list
    // 3. Handling selection

    return (
        <Popover
            key={`${databaseId}-${data.id}-${column.id}`}
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <div className="p-2 flex items-center w-full h-full focus:outline-none focus:shadow-lg focus:border focus:rounded-lg focus:z-[100] cursor-pointer">
                    {relationData ? (
                        <div className="flex items-center gap-2 w-full">
                            <Badge
                                variant="outline"
                                className="text-xs flex items-center gap-1"
                            >
                                <ArrowRight className="h-3 w-3" />
                            </Badge>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100"
                                onClick={handleClear}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-xs">
                            연결...
                        </span>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2" align="start">
                <div className="text-xs text-muted-foreground p-2">
                    관계 선택 UI 구현 예정
                    <br />
                    {column.relation && (
                        <span className="text-xs">
                            Database ID: {column.relation.databaseId}
                        </span>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default memo(RelationCell);
