import { memo, useCallback, useState, useRef, useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import {
    FireDatabaseRow,
    FireDatabaseDataFile,
} from '@/components/FireDatabase/settings/types/row';
import { Paperclip, X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadFiles } from '@/components/FireDatabase/api/uploadFile';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface FileCellProps {
    table: Table<FireDatabaseRow>;
    databaseId: string;
    columnId: string;
    data: FireDatabaseRow;
}

function FileCell({ table, databaseId, columnId, data }: FileCellProps) {
    const { setRows } = useFireDatabase();
    const rawValue = data.data?.[columnId] as FireDatabaseDataFile | undefined;
    const value = useMemo(() => rawValue || [], [rawValue]);
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isImageFile = useCallback((fileName: string) => {
        const imageExtensions = [
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.webp',
            '.svg',
            '.bmp',
        ];
        return imageExtensions.some((ext) =>
            fileName.toLowerCase().endsWith(ext)
        );
    }, []);

    const handleRemoveFile = useCallback(
        async (index: number) => {
            const newFiles = value.filter((_, i) => i !== index);

            // Optimistic update
            setRows((prev) =>
                prev.map((r) =>
                    r.id === data.id
                        ? {
                              ...r,
                              data: { ...r.data, [columnId]: newFiles },
                          }
                        : r
                )
            );

            // Update database
            await updateRowData(databaseId, data.id, {
                [columnId]: newFiles,
            });
        },
        [databaseId, data.id, columnId, setRows, value]
    );

    const handleFocus = useCallback(() => {
        table?.resetRowSelection();
    }, [table]);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            try {
                setIsUploading(true);

                // Upload files to Firebase Storage
                const storagePath = `databases/${databaseId}/rows/${data.id}/files`;
                const uploadedFiles = await uploadFiles(
                    Array.from(files),
                    storagePath
                );

                const updatedFiles = [...value, ...uploadedFiles];

                // Optimistic update
                setRows((prev) =>
                    prev.map((r) =>
                        r.id === data.id
                            ? {
                                  ...r,
                                  data: { ...r.data, [columnId]: updatedFiles },
                              }
                            : r
                    )
                );

                // Update database
                await updateRowData(databaseId, data.id, {
                    [columnId]: updatedFiles,
                });

                // Reset input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error('Failed to upload files:', error);
                // TODO: Show error message to user
            } finally {
                setIsUploading(false);
            }
        },
        [databaseId, data.id, columnId, setRows, value]
    );

    const handleAddFile = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className="p-2 w-full h-full min-h-[24px] flex items-center gap-1 flex-wrap cursor-pointer hover:bg-accent/50 rounded"
                    onFocus={handleFocus}
                    onClick={() => setOpen(true)}
                >
                    {value.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                            비어있음
                        </span>
                    ) : (
                        <>
                            {value.slice(0, 3).map((file, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        'inline-flex items-center gap-1 rounded',
                                        isImageFile(file.name)
                                            ? 'bg-transparent'
                                            : 'px-2 py-1 text-xs bg-muted'
                                    )}
                                >
                                    {isImageFile(file.name) ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="h-6 w-6 object-cover rounded"
                                        />
                                    ) : (
                                        <>
                                            <Paperclip className="h-3 w-3" />
                                            <span className="max-w-[80px] truncate">
                                                {file.name}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
                            {value.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                    +{value.length - 3}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-1" align="start">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div>
                    <div className="flex items-center justify-between p-2 text-muted-foreground">
                        <h4 className="text-sm font-medium ">파일 또는 이미지</h4>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={handleAddFile}
                            disabled={isUploading}
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            추가
                        </Button>
                    </div>
                    {isUploading && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            업로드 중...
                        </div>
                    )}
                    {value.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">
                            파일이 없습니다
                        </p>
                    ) : (
                        <div className="space-y-1 max-h-80 overflow-y-auto">
                            {value.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 py-1 px-2 hover:bg-accent rounded group"
                                >
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 flex-1 min-w-0"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {isImageFile(file.name) ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="h-8 w-8 object-cover rounded flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                                <Paperclip className="h-4 w-4" />
                                            </div>
                                        )}
                                        <span className="text-sm truncate">
                                            {file.name}
                                        </span>
                                    </a>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFile(index);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default memo(FileCell);
