import { useState, useEffect, useMemo } from 'react';
import { FireDriveItem, DRIVE_TYPE_FOLDER, DRIVE_TYPE_FILE, FIRE_DRIVE_LOCALE } from '../settings';
import { moveItem, moveItems, wouldCreateCycle } from '../api';
import useFireDriveItems from './useFireDriveItems';
import useFireDriveBreadcrumb from './useFireDriveBreadcrumb';
import { toast } from 'sonner';

interface UseFireDriveMoveDialogOptions {
    channelId: string | null | undefined;
    items: FireDriveItem[];
    onSuccess: () => void;
}

/**
 * 이동 다이얼로그 로직을 처리하는 훅
 */
export default function useFireDriveMoveDialog({
    channelId,
    items,
    onSuccess,
}: UseFireDriveMoveDialogOptions) {
    const [currentBrowseFolderId, setCurrentBrowseFolderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [disabledFolderIds, setDisabledFolderIds] = useState<Set<string>>(new Set());

    const { items: folderItems } = useFireDriveItems({
        channelId: channelId ?? undefined,
        parentId: currentBrowseFolderId,
    });

    // 브레드크럼 (현재 탐색 중인 폴더 경로)
    const { breadcrumb } = useFireDriveBreadcrumb(channelId ?? undefined, currentBrowseFolderId);

    // 이동할 아이템 ID 목록
    const itemIds = useMemo(() => items.map((i) => i.id), [items]);

    // 이동할 폴더들의 ID 집합 (순환 참조 검사용)
    const movingFolderIds = useMemo(
        () => new Set(items.filter((i) => i.type === DRIVE_TYPE_FOLDER).map((i) => i.id)),
        [items]
    );

    // 폴더 목록이 변경될 때마다 순환 참조 검사
    useEffect(() => {
        if (!channelId || movingFolderIds.size === 0) {
            setDisabledFolderIds(new Set());
            return;
        }

        const checkCycles = async () => {
            const disabled = new Set<string>();

            for (const folder of folderItems) {
                if (folder.type !== DRIVE_TYPE_FOLDER) continue;

                // 각 이동할 폴더에 대해 순환 참조 검사
                for (const movingId of movingFolderIds) {
                    if (await wouldCreateCycle(channelId, movingId, folder.id)) {
                        disabled.add(folder.id);
                        break;
                    }
                }
            }

            setDisabledFolderIds(disabled);
        };

        checkCycles().catch((error) => {
            console.error('Failed to check cycles:', error);
            // 순환 참조 검사 실패는 크리티컬하지 않으므로 경고만 표시
            toast.warning(FIRE_DRIVE_LOCALE.ERRORS.FOLDER_CHECK_FAILED);
        });
    }, [channelId, folderItems, movingFolderIds]);

    // 폴더 필터링: 자기 자신 및 순환 참조 폴더 제외
    const folders = useMemo(
        () => folderItems.filter(
            (f) =>
                f.type === DRIVE_TYPE_FOLDER &&
                !itemIds.includes(f.id) &&
                !disabledFolderIds.has(f.id)
        ),
        [folderItems, itemIds, disabledFolderIds]
    );

    // 파일 목록 (선택 불가, 표시만)
    const files = useMemo(
        () => folderItems.filter(
            (f) => f.type === DRIVE_TYPE_FILE && !itemIds.includes(f.id)
        ),
        [folderItems, itemIds]
    );

    const handleMove = async () => {
        if (!channelId || items.length === 0) return;

        try {
            setIsLoading(true);
            if (items.length === 1) {
                await moveItem(channelId, items[0].id, currentBrowseFolderId);
                onSuccess();
            } else {
                const result = await moveItems(channelId, items, currentBrowseFolderId);
                if (result.failedCount > 0) {
                    if (result.successCount > 0) {
                        toast.warning(FIRE_DRIVE_LOCALE.ERRORS.MOVE_PARTIAL_FAILED(result.successCount, result.failedCount));
                    } else {
                        toast.error(FIRE_DRIVE_LOCALE.ERRORS.MOVE_FAILED);
                    }
                }
                onSuccess();
            }
        } catch (error) {
            console.error('Failed to move item:', error);
            toast.error(FIRE_DRIVE_LOCALE.ERRORS.MOVE_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFolderClick = (folder: FireDriveItem) => {
        setCurrentBrowseFolderId(folder.id);
    };

    const handleGoToRoot = () => {
        setCurrentBrowseFolderId(null);
    };

    const handleGoBack = () => {
        const parentIndex = breadcrumb.length - 2;
        if (parentIndex >= 0) {
            setCurrentBrowseFolderId(breadcrumb[parentIndex].id);
        } else {
            handleGoToRoot();
        }
    };

    return {
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
    };
}
