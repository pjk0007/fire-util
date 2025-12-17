import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import {
    getIcon,
    getAllIcons,
    IconName,
} from '@/components/FireDatabase/utils/icons';
import { Button } from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ReactNode, useState, useMemo, useCallback } from 'react';

export default function ColumnHeader({
    column,
}: {
    column: FireDatabaseColumn;
}) {
    return (
        <div className="w-full h-full flex gap-2 items-center">
            {column.icon && getIcon(column.icon)}
            {column.name}
        </div>
    );
}

export function ColumnHeaderContextMenu({
    children,
    columnId,
}: {
    children: ReactNode;
    columnId: string;
}) {
    const { columns, updateColumn, deleteColumn } = useFireDatabase();
    const column = useMemo(
        () => columns.find((col) => col.id === columnId),
        [columns, columnId]
    );
    const [iconPopoverOpen, setIconPopoverOpen] = useState(false);
    const [iconSearch, setIconSearch] = useState('');

    const allIcons = useMemo(() => getAllIcons(), []);
    const filteredIcons = useMemo(
        () =>
            allIcons.filter((icon) =>
                icon.tags.some((tag) =>
                    tag.toLowerCase().includes(iconSearch.toLowerCase())
                )
            ),
        [allIcons, iconSearch]
    );

    const handleIconSelect = useCallback(
        (iconName: IconName) => {
            updateColumn(columnId, { icon: iconName });
            setIconPopoverOpen(false);
            setIconSearch('');
        },
        [updateColumn, columnId]
    );

    const handleNameBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            const name = e.currentTarget.value;
            if (column && name !== column.name) {
                updateColumn(columnId, { name });
            }
        },
        [column, updateColumn, columnId]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.currentTarget.blur();
            }
        },
        []
    );

    if (!column) {
        return <>{children}</>;
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent
                className="p-2"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div className="flex gap-1">
                    <Popover
                        open={iconPopoverOpen}
                        onOpenChange={setIconPopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button variant={'outline'} size="icon-sm">
                                {column.icon && getIcon(column.icon)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2" align="start">
                            <Input
                                placeholder="아이콘 검색..."
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                                className="mb-2"
                            />
                            <div className="grid grid-cols-6 gap-1">
                                {filteredIcons.map((iconItem) => (
                                    <Button
                                        key={iconItem.name}
                                        variant={
                                            column.icon === iconItem.name
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        size="icon-sm"
                                        onClick={() =>
                                            handleIconSelect(iconItem.name)
                                        }
                                        title={iconItem.label}
                                    >
                                        {getIcon(iconItem.name)}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <input
                        className="focus:outline-none border rounded-sm bg-muted px-2 py-1 text-sm"
                        defaultValue={column.name}
                        onBlur={handleNameBlur}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <ContextMenuGroup className="mt-2">
                    <ContextMenuItem
                        variant="destructive"
                        onSelect={() => deleteColumn(columnId)}
                    >
                        삭제
                    </ContextMenuItem>
                </ContextMenuGroup>
            </ContextMenuContent>
        </ContextMenu>
    );
}
