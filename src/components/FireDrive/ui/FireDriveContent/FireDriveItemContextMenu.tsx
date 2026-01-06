import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    FireDriveItem,
    FIRE_DRIVE_LOCALE,
    DRIVE_TYPE_FOLDER,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_MIME_TYPE_FIELD,
} from '../../settings';
import { downloadItems } from '../../api';
import { useTouchDevice } from '../../hooks';
import { isPreviewable } from '../../utils';
import {
    Download,
    Edit,
    FolderInput,
    Trash2,
    Eye,
    FolderOpen,
} from 'lucide-react';
import { useState } from 'react';
import { useFireDrive } from '../../contexts';
import FireDriveRenameDialog from '../FireDriveDialog/FireDriveRenameDialog';
import FireDriveMoveDialog from '../FireDriveDialog/FireDriveMoveDialog';
import FireDriveDeleteDialog from '../FireDriveDialog/FireDriveDeleteDialog';

interface FireDriveItemContextMenuProps {
    item: FireDriveItem;
    children: React.ReactNode;
}

export default function FireDriveItemContextMenu({
    item,
    children,
}: FireDriveItemContextMenuProps) {
    const { openItem, setPreviewItem, selectedItems, isSelected } = useFireDrive();
    const [renameOpen, setRenameOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [capturedTargetItems, setCapturedTargetItems] = useState<FireDriveItem[]>([item]);
    const isTouch = useTouchDevice();

    // 모바일에서는 ContextMenu 비활성화 (롱프레스 충돌 방지)
    if (isTouch) {
        return <>{children}</>;
    }

    // 컨텍스트 메뉴 열릴 때 targetItems 캡처
    const handleOpenChange = (open: boolean) => {
        if (open) {
            const currentIsMulti = isSelected(item) && selectedItems.length > 1;
            setCapturedTargetItems(currentIsMulti ? [...selectedItems] : [item]);
        }
    };

    const isFolder = item.type === DRIVE_TYPE_FOLDER;
    const canPreview = !isFolder && isPreviewable(item[DRIVE_MIME_TYPE_FIELD]);

    const handleOpen = () => {
        openItem(item);
    };

    const handleDownload = async () => {
        await downloadItems(capturedTargetItems);
    };

    const handlePreview = () => {
        if (canPreview) {
            setPreviewItem(item);
        }
    };

    return (
        <>
            <ContextMenu onOpenChange={handleOpenChange}>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={handleOpen}>
                        <FolderOpen className="mr-2 h-4 w-4" />
                        {FIRE_DRIVE_LOCALE.ACTIONS.OPEN}
                    </ContextMenuItem>

                    {canPreview && (
                        <ContextMenuItem onClick={handlePreview}>
                            <Eye className="mr-2 h-4 w-4" />
                            {FIRE_DRIVE_LOCALE.ACTIONS.PREVIEW}
                        </ContextMenuItem>
                    )}

                    {/* 다운로드 가능한 파일이 있을 때만 표시 */}
                    {capturedTargetItems.some(
                        (i) => i.type !== DRIVE_TYPE_FOLDER && i[DRIVE_STORAGE_PATH_FIELD]
                    ) && (
                        <ContextMenuItem onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            {capturedTargetItems.filter((i) => i.type !== DRIVE_TYPE_FOLDER).length > 1
                                ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.DOWNLOAD_FILES(capturedTargetItems.filter((i) => i.type !== DRIVE_TYPE_FOLDER).length)
                                : FIRE_DRIVE_LOCALE.ACTIONS.DOWNLOAD}
                        </ContextMenuItem>
                    )}

                    <ContextMenuSeparator />

                    {/* 이름 변경은 단일 선택일 때만 */}
                    {capturedTargetItems.length === 1 && (
                        <ContextMenuItem onClick={() => setRenameOpen(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {FIRE_DRIVE_LOCALE.ACTIONS.RENAME}
                        </ContextMenuItem>
                    )}

                    <ContextMenuItem onClick={() => setMoveOpen(true)}>
                        <FolderInput className="mr-2 h-4 w-4" />
                        {capturedTargetItems.length > 1
                            ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.MOVE_ITEMS(capturedTargetItems.length)
                            : FIRE_DRIVE_LOCALE.ACTIONS.MOVE}
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {capturedTargetItems.length > 1
                            ? FIRE_DRIVE_LOCALE.CONTEXT_MENU.DELETE_ITEMS(capturedTargetItems.length)
                            : FIRE_DRIVE_LOCALE.ACTIONS.DELETE}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <FireDriveRenameDialog
                item={item}
                open={renameOpen}
                onOpenChange={setRenameOpen}
            />
            <FireDriveMoveDialog
                items={capturedTargetItems}
                open={moveOpen}
                onOpenChange={setMoveOpen}
            />
            <FireDriveDeleteDialog
                items={capturedTargetItems}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
}
