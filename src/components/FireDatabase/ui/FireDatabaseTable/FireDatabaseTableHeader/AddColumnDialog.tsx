import createColumn from '@/components/FireDatabase/api/createColumn';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import { COLUMN_LIST } from '@/components/FireDatabase/settings/types/column';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { getIcon } from '@/components/FireDatabase/utils/icons';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useState } from 'react';

export default function AddColumnPopover({
    databaseId,
    isOpen,
    onClose,
}: {
    databaseId: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { addColumn } = useFireDatabase();
    const [query, setQuery] = useState('');
    const [columnList, setColumnList] = useState(COLUMN_LIST);

    useEffect(() => {
        if (query === '') {
            setColumnList(COLUMN_LIST);
        } else {
            setColumnList(
                COLUMN_LIST.filter((column) =>
                    column.tags.some((tag) =>
                        tag.toLowerCase().includes(query.toLowerCase())
                    )
                )
            );
        }
    }, [query]);

    return (
        <Popover open={isOpen} onOpenChange={onClose}>
            <PopoverTrigger></PopoverTrigger>
            {/* <DialogContent>속성 추가 다이얼로그</DialogContent> */}
            <PopoverContent className="w-64 p-2" align="start">
                <input
                    className="focus:outline-none w-full text-xs px-2"
                    placeholder="속성 이름을 입력하세요..."
                    value={query}
                    onChange={(e) => setQuery(e.currentTarget.value)}
                />
                <div className="flex flex-col mt-2">
                    {columnList.length > 0 ? (
                        columnList.map((column) => (
                            <div
                                key={column.type}
                                className="flex items-center gap-2 p-2 hover:bg-accent cursor-pointer"
                                onClick={() => {
                                    const id = `column-${Date.now()}`;
                                    createColumn(databaseId, {
                                        id,
                                        ...column,
                                    }).then(() => {
                                        addColumn({
                                            id,
                                            ...column,
                                        });
                                        onClose();
                                    });
                                }}
                            >
                                {column.icon && getIcon(column.icon)}
                                <span className="text-xs">{column.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-muted-foreground p-2">
                            일치하는 속성이 없습니다.
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
