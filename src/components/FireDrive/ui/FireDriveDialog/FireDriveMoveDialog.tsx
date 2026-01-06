import { useFireDrive } from '../../contexts';
import {
    FIRE_DRIVE_LOCALE,
    FireDriveItem,
    DRIVE_NAME_FIELD,
    DRIVE_MIME_TYPE_FIELD,
} from '../../settings';
import { useFireDriveMoveDialog } from '../../hooks';
import { getFileIcon } from '../../utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, ChevronRight, ChevronLeft, Home } from 'lucide-react';

interface FireDriveMoveDialogProps {
    items: FireDriveItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function FireDriveMoveDialog({
    items,
    open,
    onOpenChange,
}: FireDriveMoveDialogProps) {
    const { channelId, clearSelection } = useFireDrive();

    const {
        currentBrowseFolderId,
        setCurrentBrowseFolderId,
        isLoading,
        breadcrumb,
        folders,
        files,
        handleMove,
        handleFolderClick,
        handleGoToRoot,
        handleGoBack,
    } = useFireDriveMoveDialog({
        channelId,
        items,
        onSuccess: () => {
            clearSelection();
            onOpenChange(false);
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{FIRE_DRIVE_LOCALE.DIALOG.MOVE_TITLE}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                        {items.length > 1
                            ? FIRE_DRIVE_LOCALE.DIALOG.MOVE_ITEMS_DESCRIPTION(items.length)
                            : FIRE_DRIVE_LOCALE.DIALOG.MOVE_ITEM_DESCRIPTION(items[0]?.[DRIVE_NAME_FIELD])}
                    </p>

                    {/* 이전 버튼 - 루트가 아닐 때만 표시 */}
                    {currentBrowseFolderId && (
                        <button
                            className="flex items-center gap-1 mb-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={handleGoBack}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>{FIRE_DRIVE_LOCALE.DIALOG.MOVE_BACK}</span>
                        </button>
                    )}

                    {/* 브레드크럼 네비게이션 */}
                    <div className="flex items-center gap-1 mb-3 text-sm overflow-x-auto">
                        <button
                            className="flex items-center gap-1 hover:text-primary hover:underline transition-colors shrink-0"
                            onClick={handleGoToRoot}
                        >
                            <Home className="h-4 w-4" />
                            <span>{FIRE_DRIVE_LOCALE.ROOT_FOLDER}</span>
                        </button>
                        {breadcrumb.map((folder: FireDriveItem) => (
                            <div key={folder.id} className="flex items-center gap-1 shrink-0 max-w-[100px] sm:max-w-[150px]">
                                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                <button
                                    className="hover:text-primary hover:underline transition-colors line-clamp-1 min-w-0"
                                    onClick={() => setCurrentBrowseFolderId(folder.id)}
                                >
                                    {folder[DRIVE_NAME_FIELD]}
                                </button>
                            </div>
                        ))}
                    </div>

                    <ScrollArea className="h-56 border rounded-md">
                        <div className="p-2 space-y-1">
                            {/* 폴더 목록 */}
                            {folders.map((folder: FireDriveItem) => (
                                <div
                                    key={folder.id}
                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors hover:bg-accent"
                                    onClick={() => handleFolderClick(folder)}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <Folder className="h-5 w-5 text-yellow-500 shrink-0" />
                                        <span className="line-clamp-1">{folder[DRIVE_NAME_FIELD]}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ))}

                            {/* 파일 목록 (선택 불가, 흐리게 표시) */}
                            {files.map((file: FireDriveItem) => {
                                const FileIcon = getFileIcon(file[DRIVE_MIME_TYPE_FIELD]);
                                return (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-2 p-2 rounded-md opacity-50 cursor-not-allowed min-w-0"
                                    >
                                        <FileIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                                        <span className="text-muted-foreground line-clamp-1">{file[DRIVE_NAME_FIELD]}</span>
                                    </div>
                                );
                            })}

                            {folders.length === 0 && files.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    {FIRE_DRIVE_LOCALE.DIALOG.MOVE_EMPTY_FOLDER}
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {FIRE_DRIVE_LOCALE.BUTTONS.CANCEL}
                    </Button>
                    <Button onClick={handleMove} disabled={isLoading}>
                        {FIRE_DRIVE_LOCALE.DIALOG.MOVE_HERE}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
