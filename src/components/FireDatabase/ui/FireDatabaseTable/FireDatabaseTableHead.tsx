import { CSSProperties } from 'react';
import { Header, flexRender, ColumnResizeMode } from '@tanstack/react-table';
import { TableHead } from '@/components/ui/table';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface FireDatabaseTableHeadProps<TData> {
    header: Header<TData, unknown>;
}

export default function FireDatabaseTableHead<TData>({
    header,
}: FireDatabaseTableHeadProps<TData>) {
    const { attributes, isDragging, listeners, setNodeRef, transform } =
        useSortable({
            id: header.column.id,
        });

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
        transition: isDragging ? 'transform 200ms' : '',
        whiteSpace: 'nowrap',
        width: header.column.getIsResizing()
            ? header.getSize()
            : header.getSize(),
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <TableHead
            colSpan={header.colSpan}
            ref={setNodeRef}
            style={style}
            className={cn('group  relative p-0 border-b', {
                'bg-gray-200': isDragging,
                'hover:bg-gray-100': !header
                    .getContext()
                    .column.getIsResizing(),
            })}
        >
            <ContextMenu>
                <ContextMenuTrigger asChild>
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
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <div className="p-2 text-sm">
                        Size: {header.column.getSize()}px
                    </div>
                </ContextMenuContent>
            </ContextMenu>
            <div
                onDoubleClick={() => header.column.resetSize()}
                onMouseDown={header.getResizeHandler()}
                onTouchStart={header.getResizeHandler()}
                className={cn(
                    'absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none hover:bg-blue-400 transition-colors',
                    {
                        'bg-blue-500 w-1': header.column.getIsResizing(),
                        'bg-transparent': !header.column.getIsResizing(),
                    }
                )}
                style={{
                    transform: 'translateX(50%)',
                }}
            />
        </TableHead>
    );
}
