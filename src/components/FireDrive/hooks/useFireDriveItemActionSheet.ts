import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Folder } from 'lucide-react';
import {
    FireDriveItem,
    DRIVE_TYPE_FOLDER,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_MIME_TYPE_FIELD,
    DRIVE_NAME_FIELD,
    DRIVE_SIZE_FIELD,
    DRIVE_ID_FIELD,
    DRIVE_PARENT_ID_FIELD,
    FIRE_DRIVE_LOCALE,
    FIRE_DRIVE_CONFIG,
} from '../settings';
import { downloadItems } from '../api';
import { isPreviewable, getFileIcon } from '../utils';
import { toast } from 'sonner';
import { storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import sendMessage, { updateLastMessage } from '@/components/FireChat/api/sendMessage';
import {
    MESSAGE_COLLECTION,
    MESSAGE_ID_FIELD,
    MESSAGE_USER_ID_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_REPLY_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_FILE_SIZE_FIELD,
    FireMessage,
    FireMessageFile,
} from '@/components/FireChat/settings';
import { Timestamp } from 'firebase/firestore';

interface UseFireDriveItemActionSheetOptions {
    items: FireDriveItem[];
    onOpenChange: (open: boolean) => void;
    openItem: (item: FireDriveItem) => void;
    setPreviewItem: (item: FireDriveItem | null) => void;
    channelId?: string;
    userId?: string;
}

/**
 * 아이템 액션 시트 로직을 처리하는 훅
 */
export default function useFireDriveItemActionSheet({
    items,
    onOpenChange,
    openItem,
    setPreviewItem,
    channelId,
    userId,
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

    const handleShareToChat = async () => {
        if (!channelId || !userId) return;

        try {
            const files = items.filter(
                (i) => i.type !== DRIVE_TYPE_FOLDER && i[DRIVE_STORAGE_PATH_FIELD]
            );
            if (files.length === 0) return;

            for (const file of files) {
                const url = await getDownloadURL(ref(storage, file[DRIVE_STORAGE_PATH_FIELD]!));
                const now = Timestamp.now();
                const msg = {
                    [MESSAGE_ID_FIELD]: `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`,
                    [MESSAGE_USER_ID_FIELD]: userId,
                    [MESSAGE_CREATED_AT_FIELD]: now,
                    [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_FILE,
                    [MESSAGE_CONTENTS_FIELD]: [
                        {
                            [MESSAGE_TYPE_FIELD]: MESSAGE_TYPE_FILE,
                            [MESSAGE_CONTENT_URL_FIELD]: url,
                            [MESSAGE_CONTENT_FILE_NAME_FIELD]: file[DRIVE_NAME_FIELD],
                            [MESSAGE_CONTENT_FILE_SIZE_FIELD]: file[DRIVE_SIZE_FIELD],
                        } as FireMessageFile,
                    ],
                    [MESSAGE_REPLY_FIELD]: null,
                } as FireMessage<FireMessageFile>;

                await sendMessage(channelId, msg);
                await updateLastMessage(channelId, msg);
            }
            toast.success(FIRE_DRIVE_LOCALE.SUCCESS.SHARED_TO_CHAT);
        } catch {
            toast.error(FIRE_DRIVE_LOCALE.ERRORS.SHARE_FAILED);
        }
        onOpenChange(false);
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
        handleShareToChat,
    };
}
