import { useFireDrive } from "../../contexts";
import {
    FireDriveItem as FireDriveItemType,
    FIRE_DRIVE_LOCALE,
    DRIVE_TYPE_FOLDER,
    DRIVE_NAME_FIELD,
    DRIVE_SIZE_FIELD,
    DRIVE_MIME_TYPE_FIELD,
    DRIVE_CREATED_AT_FIELD,
} from "../../settings";
import { moveItems } from "../../api";
import { useLongPress, useTouchDevice } from "../../hooks";
import { Folder } from "lucide-react";
import FireDriveItemContextMenu from "./FireDriveItemContextMenu";
import { FireDriveItemActionSheet } from "../FireDriveBottomSheet";
import { getFileIcon, formatFileSize } from "../../utils";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface FireDriveItemProps {
    item: FireDriveItemType;
    view: "grid" | "list";
}

export default function FireDriveItem({ item, view }: FireDriveItemProps) {
    const { openItem, toggleSelectItem, isSelected, selectedItems, items, channelId, clearSelection, isSelectionMode, enterSelectionMode } = useFireDrive();
    const selected = isSelected(item);
    const isFolder = item.type === DRIVE_TYPE_FOLDER;
    const [isDragOver, setIsDragOver] = useState(false);
    const [actionSheetOpen, setActionSheetOpen] = useState(false);
    const [actionSheetItems, setActionSheetItems] = useState<FireDriveItemType[]>([]);
    const isTouch = useTouchDevice();

    // 롱프레스 훅 사용
    const { triggered: longPressTriggered, handlers: longPressHandlers } = useLongPress({
        onLongPress: () => {
            if (isSelectionMode) {
                // 선택 모드: 롱프레스로 바텀시트 열기
                const targetItems = selected && selectedItems.length > 1 ? [...selectedItems] : [item];
                setActionSheetItems(targetItems);
                setActionSheetOpen(true);
            } else {
                // 일반 모드: 롱프레스로 선택 모드 진입
                enterSelectionMode(item);
            }
        },
    });

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();

        // 롱프레스 후 클릭 이벤트 무시
        if (longPressTriggered.current) {
            longPressTriggered.current = false;
            return;
        }

        // Ctrl/Cmd/Shift 클릭 → 다중 선택
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
            toggleSelectItem(item, true);
            return;
        }

        if (isTouch) {
            // 모바일 선택 모드일 때: 탭으로 선택/해제
            if (isSelectionMode) {
                toggleSelectItem(item, true);
            } else {
                // 일반 모드: 싱글 탭으로 바로 열기
                openItem(item);
            }
        } else {
            // 데스크톱: 싱글 클릭으로 선택
            toggleSelectItem(item, false);
        }
    }, [isTouch, item, openItem, toggleSelectItem, isSelectionMode]);

    // 데스크톱: 더블클릭으로 열기
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        if (isTouch) return; // 모바일에서는 무시
        e.stopPropagation();
        openItem(item);
    }, [isTouch, item, openItem]);

    // 드래그 시작
    const handleDragStart = (e: React.DragEvent) => {
        // 현재 아이템이 선택되어 있으면 선택된 모든 아이템을 드래그, 아니면 현재 아이템만
        const dragItems = selected ? selectedItems : [item];
        e.dataTransfer.setData("application/json", JSON.stringify(dragItems.map(i => i.id)));
        e.dataTransfer.effectAllowed = "move";

        // 드래그 이미지 커스텀 (선택된 개수 표시)
        if (dragItems.length > 1) {
            const dragImage = document.createElement("div");
            dragImage.className = "bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium shadow-lg";
            dragImage.textContent = FIRE_DRIVE_LOCALE.DRAG.ITEMS(dragItems.length);
            dragImage.style.position = "absolute";
            dragImage.style.top = "-1000px";
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, 0, 0);
            setTimeout(() => document.body.removeChild(dragImage), 0);
        }
    };

    // 폴더 위에 드래그 오버
    const handleDragOver = (e: React.DragEvent) => {
        if (!isFolder) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    // 폴더에 드롭
    const handleDrop = async (e: React.DragEvent) => {
        if (!isFolder || !channelId) return;
        e.preventDefault();
        setIsDragOver(false);

        try {
            const data = e.dataTransfer.getData("application/json");
            // 빈 데이터면 무시 (외부 파일 드래그 시)
            if (!data) return;

            const itemIds: string[] = JSON.parse(data);

            // 자기 자신에게 드롭하는 경우 무시
            if (itemIds.includes(item.id)) return;

            // 드래그된 아이템들 찾기 (선택된 항목 또는 전체 items에서)
            let itemsToMove = selectedItems.filter(i => itemIds.includes(i.id));
            if (itemsToMove.length === 0) {
                // 선택 안된 단일 아이템 드래그의 경우 전체 items에서 찾기
                itemsToMove = items.filter(i => itemIds.includes(i.id));
            }

            if (itemsToMove.length > 0) {
                const result = await moveItems(channelId, itemsToMove, item.id);
                if (result.failedCount > 0) {
                    if (result.successCount > 0) {
                        toast.warning(FIRE_DRIVE_LOCALE.ERRORS.MOVE_PARTIAL_FAILED(result.successCount, result.failedCount));
                    } else {
                        toast.error(FIRE_DRIVE_LOCALE.ERRORS.MOVE_FAILED);
                    }
                }
                clearSelection();
            }
        } catch {
            // JSON 파싱 실패 시 무시 (외부 파일 드래그 등)
        }
    };

    const Icon = isFolder ? Folder : getFileIcon(item[DRIVE_MIME_TYPE_FIELD]);

    const formatDate = (timestamp: FireDriveItemType["createdAt"]) => {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // 폴더일 때 드롭 대상 스타일
    const dropTargetClass = isDragOver ? "ring-2 ring-primary bg-primary/20" : "";

    if (view === "grid") {
        return (
            <>
                <FireDriveItemContextMenu item={item}>
                    <div
                        data-item-id={item.id}
                        className={`
                            flex flex-col items-center p-4 rounded-lg cursor-pointer
                            hover:bg-accent transition-colors
                            ${selected ? "bg-accent ring-2 ring-primary" : ""}
                            ${dropTargetClass}
                        `}
                        onClick={handleClick}
                        onDoubleClick={handleDoubleClick}
                        {...longPressHandlers}
                        draggable={!isTouch}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Icon className={`h-12 w-12 mb-2 ${isFolder ? "text-yellow-500" : "text-blue-500"}`} />
                        <span className="text-sm text-center line-clamp-2 w-full">{item[DRIVE_NAME_FIELD]}</span>
                        {!isFolder && item[DRIVE_SIZE_FIELD] && (
                            <span className="text-xs text-muted-foreground">{formatFileSize(item[DRIVE_SIZE_FIELD])}</span>
                        )}
                    </div>
                </FireDriveItemContextMenu>

                {/* 모바일 바텀시트 */}
                {isTouch && (
                    <FireDriveItemActionSheet
                        items={actionSheetItems}
                        open={actionSheetOpen}
                        onOpenChange={setActionSheetOpen}
                    />
                )}
            </>
        );
    }

    // List view
    return (
        <>
            <FireDriveItemContextMenu item={item}>
                <div
                    data-item-id={item.id}
                    className={`
                        flex items-center gap-4 px-4 py-3 cursor-pointer
                        transition-colors border-l-2 max-w-full
                        ${selected
                            ? "bg-primary/10 border-l-primary"
                            : "border-l-transparent hover:bg-accent/50"
                        }
                        ${dropTargetClass}
                    `}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    {...longPressHandlers}
                    draggable={!isTouch}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Icon className={`h-5 w-5 shrink-0 ${isFolder ? "text-yellow-500" : "text-blue-500"}`} />
                    <span className="flex-1 w-0 line-clamp-1">{item[DRIVE_NAME_FIELD]}</span>
                    {/* 모바일에서 크기/날짜 숨김 */}
                    <span className="hidden sm:block w-24 text-right text-sm text-muted-foreground">
                        {!isFolder && item[DRIVE_SIZE_FIELD] ? formatFileSize(item[DRIVE_SIZE_FIELD]) : "-"}
                    </span>
                    <span className="hidden md:block w-32 text-right text-sm text-muted-foreground">
                        {formatDate(item[DRIVE_CREATED_AT_FIELD])}
                    </span>
                </div>
            </FireDriveItemContextMenu>

            {/* 모바일 바텀시트 */}
            {isTouch && (
                <FireDriveItemActionSheet
                    items={actionSheetItems}
                    open={actionSheetOpen}
                    onOpenChange={setActionSheetOpen}
                />
            )}
        </>
    );
}
