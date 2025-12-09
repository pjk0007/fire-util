import { TableCell } from '@/components/ui/table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Cell, flexRender } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export default function FireDatabaseTableCell<TData>({
    cell,
}: {
    cell: Cell<TData, unknown>;
}) {
    const { isDragging, setNodeRef, transform } = useSortable({
        id: cell.column.id,
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0,
        padding: 0,
        height: '40px',
    };

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
