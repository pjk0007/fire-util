import { memo, useCallback, useMemo } from 'react';
import { Table } from '@/components/ui/table';
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
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FireDatabaseTableHeader from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableHeader';
import FireDatabaseTableBody from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableBody';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import { ColumnOrderState } from '@tanstack/react-table';

function FireDatabaseTable() {
    const { table, columnOrder, setColumnOrder, addRow } =
        useFireDatabase();

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (active && over && active.id !== over.id) {
                setColumnOrder((prevOrder: ColumnOrderState) => {
                    const oldIndex = prevOrder.indexOf(active.id as string);
                    const newIndex = prevOrder.indexOf(over.id as string);
                    return arrayMove(
                        prevOrder,
                        oldIndex,
                        newIndex
                    ) as ColumnOrderState;
                });
            }
        },
        [setColumnOrder]
    );

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const tableStyle = {
        width: table?.getTotalSize(),
        marginLeft: 40,
        marginRight: 40,
    };

    if (!table) return null;

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToHorizontalAxis]}
                onDragEnd={handleDragEnd}
            >
                <Table noWrapper style={tableStyle}>
                    <FireDatabaseTableHeader
                        table={table}
                        columnOrder={columnOrder}
                    />
                    <FireDatabaseTableBody table={table} />
                </Table>
            </DndContext>

            <div
                className="h-0 p-0 m-0 sticky left-0 mb-20 px-20"
                onClick={addRow}
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

export default FireDatabaseTable;
