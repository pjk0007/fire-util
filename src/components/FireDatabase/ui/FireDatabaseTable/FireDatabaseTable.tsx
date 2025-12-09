import { useState, useEffect } from 'react';
import {
    ColumnOrderState,
    ColumnSizingState,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';
import {
    FireDatabaseColumn,
    FireDatabaseView,
} from '@/components/FireDatabase/settings/types/database';
import { arrayMove } from '@dnd-kit/sortable';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import FireDatabaseTableCell from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableCell';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { rowsToTableData } from '@/components/FireDatabase/utils/data';
import createRow from '@/components/FireDatabase/api/createRow';
import { cn } from '@/lib/utils';
import updateDatabaseView from '@/components/FireDatabase/api/updateDatabaseView';
import FireDatabaseTableHeader from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableHeader';
import { databaseToTableColumns } from '@/components/FireDatabase/utils/columns';
import FireDatabaseTableBody from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableBody';

export default function FireDatabaseTable({
    databaseId,
    rows,
    refetchRows,
    columns,
    view,
}: {
    databaseId: string;
    rows: FireDatabaseRow[];
    refetchRows: () => void;
    columns: FireDatabaseColumn[];
    view: FireDatabaseView;
}) {
    const [data, setData] = useState(() => rowsToTableData(rows));
    const [sorting, setSorting] = useState<SortingState>(view.sorting || []);
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
        view.columnSizing || {}
    );
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
        view.columnOrder || []
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        view.columnVisibility || {}
    );
    const [rowSelection, setRowSelection] = useState({});

    // rows가 변경되면 data 업데이트
    useEffect(() => {
        setData(rowsToTableData(rows));
    }, [rows]);

    useEffect(() => {
        updateDatabaseView(databaseId, view.id, {
            sorting,
            columnOrder,
            columnSizing,
            columnVisibility,
        });
    }, [columnOrder, columnSizing, columnVisibility]);

    const table = useReactTable({
        data,
        columns: databaseToTableColumns(databaseId, columns, refetchRows),
        state: {
            sorting,
            columnOrder,
            columnSizing,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnOrderChange: setColumnOrder,
        onColumnSizingChange: setColumnSizing,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange',
        enableRowSelection: true,
        enableColumnResizing: true,
        columnResizeDirection: 'ltr',
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder((columnOrder) => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
            });
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToHorizontalAxis]}
                onDragEnd={handleDragEnd}
            >
                <Table
                    noWrapper
                    style={{
                        width: table.getTotalSize(),
                        marginLeft: 40,
                        marginRight: 40,
                    }}
                >
                    <FireDatabaseTableHeader
                        table={table}
                        columnOrder={columnOrder}
                    />

                    <FireDatabaseTableBody table={table} />
                </Table>
            </DndContext>

            <div
                className="h-0 p-0 m-0 sticky left-0 mb-20 px-20"
                onClick={() => {
                    createRow(databaseId, {}).then(() => {
                        refetchRows();
                    });
                }}
            >
                <Button
                    className="mt-2 text-muted-foreground text-sm hover:text-muted-foreground"
                    variant="ghost"
                    size="sm"
                >
                    <Plus />
                    신규 Item
                </Button>
            </div>
        </>
    );
}
