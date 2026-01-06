import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Folder } from 'lucide-react';
import {
    FireDriveItem,
    DRIVE_TYPE_FOLDER,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_MIME_TYPE_FIELD,
} from '../settings';
import { downloadItems } from '../api';
import { isPreviewable, getFileIcon } from '../utils';

interface UseFireDriveItemActionSheetOptions {
    items: FireDriveItem[];
    onOpenChange: (open: boolean) => void;
    openItem: (item: FireDriveItem) => void;
    setPreviewItem: (item: FireDriveItem | null) => void;
}

/**
 * 아이템 액션 시트 로직을 처리하는 훅
 */
export default function useFireDriveItemActionSheet({
    items,
    onOpenChange,
    openItem,
    setPreviewItem,
}: UseFireDriveItemActionSheetOptions) {
    const [renameOpen, setRenameOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const singleItem = items.length === 1 ? items[0] : null;
    const isFolder = singleItem?.type === DRIVE_TYPE_FOLDER;
    const canPreview = singleItem && !isFolder && isPreviewable(singleItem[DRIVE_MIME_TYPE_FIELD]);

    const handleOpen = () => {
        if (singleItem) {
            openItem(singleItem);
            onOpenChange(false);
        }
    };

    const handlePreview = () => {
        if (singleItem && canPreview) {
            setPreviewItem(singleItem);
            onOpenChange(false);
        }
    };

    const handleDownload = async () => {
        await downloadItems(items);
        onOpenChange(false);
    };

    const handleRename = () => {
        onOpenChange(false);
        setTimeout(() => setRenameOpen(true), 100);
    };

    const handleMove = () => {
        onOpenChange(false);
        setTimeout(() => setMoveOpen(true), 100);
    };

    const handleDelete = () => {
        onOpenChange(false);
        setTimeout(() => setDeleteOpen(true), 100);
    };

    const Icon: LucideIcon = singleItem
        ? isFolder
            ? Folder
            : getFileIcon(singleItem[DRIVE_MIME_TYPE_FIELD])
        : Folder;

    const hasDownloadableItems = items.some(
        (i) => i.type !== DRIVE_TYPE_FOLDER && i[DRIVE_STORAGE_PATH_FIELD]
    );

    const downloadableFileCount = items.filter((i) => i.type !== DRIVE_TYPE_FOLDER).length;

    return {
        // 상태
        singleItem,
        isFolder,
        canPreview,
        hasDownloadableItems,
        downloadableFileCount,
        Icon,
        // 다이얼로그 상태
        renameOpen,
        setRenameOpen,
        moveOpen,
        setMoveOpen,
        deleteOpen,
        setDeleteOpen,
        // 핸들러
        handleOpen,
        handlePreview,
        handleDownload,
        handleRename,
        handleMove,
        handleDelete,
    };
}
