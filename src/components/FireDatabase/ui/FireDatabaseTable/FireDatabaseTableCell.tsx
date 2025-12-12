import { useMemo } from 'react';
import { TableCell } from '@/components/ui/table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Cell, flexRender } from '@tanstack/react-table';
import { CSSProperties } from 'react';

function FireDatabaseTableCell<TData>({
    cell,
}: {
    cell: Cell<TData, unknown>;
}) {
    const { isDragging, setNodeRef, transform } = useSortable({
        id: cell.column.id,
    });

    const columnSize = cell.column.getSize();

    const style: CSSProperties = useMemo(
        () => ({
            opacity: isDragging ? 0.8 : 1,
            position: 'relative',
            transform: CSS.Translate.toString(transform),
            width: columnSize,
            zIndex: isDragging ? 1 : 0,
            padding: 0,
            height: '40px',
        }),
        [isDragging, transform, columnSize]
    );

    return (
        <TableCell
            style={style}
            ref={setNodeRef}
            className="font-medium border-b border-r"
        >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    );
}

export default FireDatabaseTableCell;
