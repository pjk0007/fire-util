import { CSSProperties, useMemo, useCallback } from 'react';
import { Header, flexRender } from '@tanstack/react-table';
import { TableHead } from '@/components/ui/table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { ColumnHeaderContextMenu } from '@/components/FireDatabase/utils/columns/ColumnHeader';

interface FireDatabaseTableHeadProps<TData> {
    header: Header<TData, unknown>;
}

function FireDatabaseTableHead<TData>({
    header,
}: FireDatabaseTableHeadProps<TData>) {
    const { attributes, isDragging, listeners, setNodeRef, transform } =
        useSortable({
            id: header.column.id,
        });

    const headerSize = header.getSize();

    const style: CSSProperties = useMemo(
        () => ({
            opacity: isDragging ? 0.8 : 1,
            position: 'relative',
            transform: CSS.Translate.toString(transform),
            transition: isDragging ? 'transform 200ms' : '',
            whiteSpace: 'nowrap',
            width: headerSize,
            zIndex: isDragging ? 1 : 0,
        }),
        [isDragging, transform, headerSize]
    );

    const handleDoubleClick = useCallback(() => {
        header.column.resetSize();
    }, [header.column]);

    const resizeHandler = useMemo(
        () => header.getResizeHandler(),
        [header]
    );

    const isResizing = header.column.getIsResizing();

    return (
        <ColumnHeaderContextMenu columnId={header.column.id}>
            <TableHead
                colSpan={header.colSpan}
                ref={setNodeRef}
                style={style}
                className={cn('group relative p-0 border-b', {
                    'bg-gray-200': isDragging,
                    'hover:bg-gray-100': !isResizing,
                })}
            >
                <div
                    className="flex h-full px-2 items-center cursor-pointer text-muted-foreground"
                    {...attributes}
                    {...listeners}
                >
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                          )}
                </div>
                <div
                    onDoubleClick={handleDoubleClick}
                    onMouseDown={resizeHandler}
                    onTouchStart={resizeHandler}
                    className={cn(
                        'absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-blue-400 transition-colors',
                        {
                            'bg-blue-500 w-1': isResizing,
                            'bg-transparent': !isResizing,
                        }
                    )}
                    style={{
                        transform: 'translateX(50%)',
                    }}
                />
            </TableHead>
        </ColumnHeaderContextMenu>
    );
}

export default FireDatabaseTableHead;
