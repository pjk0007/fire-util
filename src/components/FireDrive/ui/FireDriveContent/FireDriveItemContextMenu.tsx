import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    FireDriveItem,
    FIRE_DRIVE_LOCALE,
    FIRE_DRIVE_CONFIG,
    DRIVE_TYPE_FOLDER,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_MIME_TYPE_FIELD,
    DRIVE_NAME_FIELD,
    DRIVE_SIZE_FIELD,
    DRIVE_ID_FIELD,
    DRIVE_PARENT_ID_FIELD,
} from "../../settings";
import { downloadItems } from "../../api";
import { useTouchDevice } from "../../hooks";
import { isPreviewable } from "../../utils";
import { Download, Edit, FolderInput, Trash2, Eye, FolderOpen, Link, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { storage } from "@/lib/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { useFireAuth } from "@/components/FireProvider/FireAuthProvider";
import sendMessage, { updateLastMessage } from "@/components/FireChat/api/sendMessage";
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
} from "@/components/FireChat/settings";
import { Timestamp } from "firebase/firestore";
import { useState, useRef } from "react";
import { useFireDrive } from "../../contexts";
import FireDriveRenameDialog from "../FireDriveDialog/FireDriveRenameDialog";
import FireDriveMoveDialog from "../FireDriveDialog/FireDriveMoveDialog";
import FireDriveDeleteDialog from "../FireDriveDialog/FireDriveDeleteDialog";

interface FireDriveItemContextMenuProps {
    item: FireDriveItem;
    children: React.ReactNode;
}

export default function FireDriveItemContextMenu({ item, children }: FireDriveItemContextMenuProps) {
    const { openItem, setPreviewItem, selectedItems, isSelected, channelId } = useFireDrive();
    const { user } = useFireAuth();
    const [renameOpen, setRenameOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [capturedTargetItems, setCapturedTargetItems] = useState<FireDriveItem[]>([item]);
    const isTouch = useTouchDevice();
    const openTimeRef = useRef<number>(0);

    // 모바일에서는 ContextMenu 비활성화 (롱프레스 충돌 방지)
    if (isTouch) {
        return <>{children}</>;
    }

    // 컨텍스트 메뉴 열릴 때 targetItems 캡처
    const handleOpenChange = (open: boolean) => {
        if (open) {
            openTimeRef.current = Date.now();
            const currentIsMulti = isSelected(item) && selectedItems.length > 1;
            setCapturedTargetItems(currentIsMulti ? [...selectedItems] : [item]);
        }
    };

    // 메뉴가 열린 직후 클릭 방지 (화면 하단에서 메뉴가 위로 열릴 때 의도치 않은 클릭 방지)
    const shouldIgnoreSelect = () => {
        return Date.now() - openTimeRef.current < 150;
    };

    const isFolder = item.type === DRIVE_TYPE_FOLDER;
    const canPreview = !isFolder && isPreviewable(item[DRIVE_MIME_TYPE_FIELD]);

    const handleOpen = (e: Event) => {
        if (shouldIgnoreSelect()) {
            e.preventDefault();
            return;
        }
        openItem(item);
    };

    const handleDownload = (e: Event) => {
        if (shouldIgnoreSelect()) {
            e.preventDefault();
            return;
        }
        downloadItems(capturedTargetItems);
    };

    const handlePreview = (e: Event) => {
        if (shouldIgnoreSelect()) {
            e.preventDefault();
            return;
        }
        if (canPreview) {
            setPreviewItem(item);
        }
    };

    const handleRename = (e: Event) => {
        if (shouldIgnoreSelect()) {
            e.preventDefault();
            return;
        }
        setRenameOpen(true);
    };

    const handleMove = (e: Event) => {
        if (shouldIgnoreSelect()) {
            e.preventDefault();
            return;
        }
        setMoveOpen(true);
    };

    const handleDelete = (e: Event) => {
        if (shouldIgnoreSelect()) {
            e.preventDefault();
            return;
        }
        setDeleteOpen(true);
    };

    const handleShareToChat = async (e: Event) => {
        if (shouldIgnoreSelect()) {
            e.preventDefault();
            return;
        }
        if (!channelId || !user?.id) return;

        try {
            const files = capturedTargetItems.filter(
                (i) => i.type !== DRIVE_TYPE_FOLDER && i[DRIVE_STORAGE_PATH_FIELD]
            );
            if (files.length === 0) return;

            for (const file of files) {
                const url = await getDownloadURL(ref(storage, file[DRIVE_STORAGE_PATH_FIELD]!));
                const now = Timestamp.now();
                const msg = {
                    [MESSAGE_ID_FIELD]: `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}`,
                    [MESSAGE_USER_ID_FIELD]: user.id,
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
    };

    // 파일만 있는지 확인 (주소 복사, 채팅방 공유용)
    const hasFiles = capturedTargetItems.some((i) => i.type !== DRIVE_TYPE_FOLDER && i[DRIVE_STORAGE_PATH_FIELD]);

    return (
        <>
            <ContextMenu onOpenChange={handleOpenChange}>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onSelect={handleOpen}>
                        <FolderOpen className="mr-2 h-4 w-4" />
                        {FIRE_DRIVE_LOCALE.ACTIONS.OPEN}
                    </ContextMenuItem>

                    {canPreview && (
                        <ContextMenuItem onSelect={handlePreview}>
                            <Eye className="mr-2 h-4 w-4" />
                            {FIRE_DRIVE_LOCALE.ACTIONS.PREVIEW}
                        </ContextMenuItem>
                    )}

                    {/* 다운로드 가능한 파일이 있을 때만 표시 */}
                    {hasFiles && (
                        <ContextMenuItem onSelect={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            {capturedTargetItems.filter((i) => i.type !== DRIVE_TYPE_FOLDER).length > 1
                                ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.DOWNLOAD_FILES(
                                      capturedTargetItems.filter((i) => i.type !== DRIVE_TYPE_FOLDER).length
                                  )
                                : FIRE_DRIVE_LOCALE.ACTIONS.DOWNLOAD}
                        </ContextMenuItem>
                    )}

                    {/* 채팅방에 공유 - 파일만, channelId가 있을 때만 */}
                    {hasFiles && channelId && (
                        <ContextMenuItem onSelect={handleShareToChat}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            {FIRE_DRIVE_LOCALE.ACTIONS.SHARE_TO_CHAT}
                        </ContextMenuItem>
                    )}

                    <ContextMenuSeparator />

                    {/* 이름 변경은 단일 선택일 때만 */}
                    {capturedTargetItems.length === 1 && (
                        <ContextMenuItem onSelect={handleRename}>
                            <Edit className="mr-2 h-4 w-4" />
                            {FIRE_DRIVE_LOCALE.ACTIONS.RENAME}
                        </ContextMenuItem>
                    )}

                    <ContextMenuItem onSelect={handleMove}>
                        <FolderInput className="mr-2 h-4 w-4" />
                        {capturedTargetItems.length > 1
                            ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.MOVE_ITEMS(capturedTargetItems.length)
                            : FIRE_DRIVE_LOCALE.ACTIONS.MOVE}
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem onSelect={handleDelete} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {capturedTargetItems.length > 1
                            ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.DELETE_ITEMS(capturedTargetItems.length)
                            : FIRE_DRIVE_LOCALE.ACTIONS.DELETE}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <FireDriveRenameDialog item={item} open={renameOpen} onOpenChange={setRenameOpen} />
            <FireDriveMoveDialog items={capturedTargetItems} open={moveOpen} onOpenChange={setMoveOpen} />
            <FireDriveDeleteDialog items={capturedTargetItems} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </>
    );
}
