import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    FireDriveItem,
    FIRE_DRIVE_LOCALE,
    DRIVE_NAME_FIELD,
} from '../../settings';
import { useFireDrive } from '../../contexts';
import { useFireDriveItemActionSheet } from '../../hooks';
import {
    Download,
    Edit,
    FolderInput,
    Trash2,
    Eye,
    FolderOpen,
} from 'lucide-react';
import FireDriveRenameDialog from '../FireDriveDialog/FireDriveRenameDialog';
import FireDriveMoveDialog from '../FireDriveDialog/FireDriveMoveDialog';
import FireDriveDeleteDialog from '../FireDriveDialog/FireDriveDeleteDialog';
import ActionButton from './ActionButton';

interface FireDriveItemActionSheetProps {
    items: FireDriveItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function FireDriveItemActionSheet({
    items,
    open,
    onOpenChange,
}: FireDriveItemActionSheetProps) {
    const { openItem, setPreviewItem } = useFireDrive();

    const {
        singleItem,
        isFolder,
        canPreview,
        hasDownloadableItems,
        downloadableFileCount,
        Icon,
        renameOpen,
        setRenameOpen,
        moveOpen,
        setMoveOpen,
        deleteOpen,
        setDeleteOpen,
        handleOpen,
        handlePreview,
        handleDownload,
        handleRename,
        handleMove,
        handleDelete,
    } = useFireDriveItemActionSheet({
        items,
        onOpenChange,
        openItem,
        setPreviewItem,
    });

    if (items.length === 0) return null;

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="rounded-t-xl pb-8">
                    <SheetHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            <Icon
                                className={`h-8 w-8 ${isFolder ? 'text-yellow-500' : 'text-blue-500'}`}
                            />
                            <SheetTitle className="text-left truncate">
                                {items.length === 1
                                    ? singleItem![DRIVE_NAME_FIELD]
                                    : FIRE_DRIVE_LOCALE.CONTEXT_MENU.ITEMS_SELECTED(items.length)}
                            </SheetTitle>
                        </div>
                    </SheetHeader>

                    <div className="flex flex-col gap-1 mt-2">
                        {/* 열기 - 단일 선택일 때만 */}
                        {singleItem && (
                            <ActionButton
                                icon={FolderOpen}
                                label={FIRE_DRIVE_LOCALE.ACTIONS.OPEN}
                                onClick={handleOpen}
                            />
                        )}

                        {/* 미리보기 - 단일 파일이고 미리보기 가능할 때 */}
                        {canPreview && (
                            <ActionButton
                                icon={Eye}
                                label={FIRE_DRIVE_LOCALE.ACTIONS.PREVIEW}
                                onClick={handlePreview}
                            />
                        )}

                        {/* 다운로드 - 다운로드 가능한 파일이 있을 때 */}
                        {hasDownloadableItems && (
                            <ActionButton
                                icon={Download}
                                label={
                                    downloadableFileCount > 1
                                        ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.DOWNLOAD_FILES(downloadableFileCount)
                                        : FIRE_DRIVE_LOCALE.ACTIONS.DOWNLOAD
                                }
                                onClick={handleDownload}
                            />
                        )}

                        <div className="h-px bg-border my-2" />

                        {/* 이름 변경 - 단일 선택일 때만 */}
                        {singleItem && (
                            <ActionButton
                                icon={Edit}
                                label={FIRE_DRIVE_LOCALE.ACTIONS.RENAME}
                                onClick={handleRename}
                            />
                        )}

                        {/* 이동 */}
                        <ActionButton
                            icon={FolderInput}
                            label={
                                items.length > 1
                                    ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.MOVE_ITEMS(items.length)
                                    : FIRE_DRIVE_LOCALE.ACTIONS.MOVE
                            }
                            onClick={handleMove}
                        />

                        <div className="h-px bg-border my-2" />

                        {/* 삭제 */}
                        <ActionButton
                            icon={Trash2}
                            label={
                                items.length > 1
                                    ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.DELETE_ITEMS(items.length)
                                    : FIRE_DRIVE_LOCALE.ACTIONS.DELETE
                            }
                            onClick={handleDelete}
                            destructive
                        />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Dialogs */}
            {singleItem && (
                <FireDriveRenameDialog
                    item={singleItem}
                    open={renameOpen}
                    onOpenChange={setRenameOpen}
                />
            )}
            <FireDriveMoveDialog
                items={items}
                open={moveOpen}
                onOpenChange={setMoveOpen}
            />
            <FireDriveDeleteDialog
                items={items}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
