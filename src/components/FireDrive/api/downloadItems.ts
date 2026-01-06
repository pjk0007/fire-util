import {
    FireDriveItem,
    DRIVE_TYPE_FOLDER,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_NAME_FIELD,
    FIRE_DRIVE_LOCALE,
} from '../settings';
import downloadFile from './downloadFile';
import { toast } from 'sonner';

interface DownloadResult {
    successCount: number;
    failedCount: number;
}

/**
 * 여러 아이템을 다운로드하고 결과에 따라 toast 표시
 * - 폴더는 제외하고 파일만 다운로드
 * - 개별 파일마다 try-catch로 처리하여 일부 실패해도 나머지 진행
 * - 여러 파일 다운로드 시 브라우저 차단 방지를 위해 딜레이 적용
 */
export default async function downloadItems(
    items: FireDriveItem[]
): Promise<DownloadResult> {
    // 다운로드 가능한 파일만 필터링 (폴더 제외)
    const downloadableItems = items.filter(
        (item) =>
            item.type !== DRIVE_TYPE_FOLDER && item[DRIVE_STORAGE_PATH_FIELD]
    );

    let successCount = 0;
    let failedCount = 0;

    for (const item of downloadableItems) {
        try {
            await downloadFile(
                item[DRIVE_STORAGE_PATH_FIELD]!,
                item[DRIVE_NAME_FIELD]
            );
            successCount++;
        } catch (error) {
            console.error(
                'Failed to download file:',
                item[DRIVE_NAME_FIELD],
                error
            );
            failedCount++;
        }

        // 여러 파일일 경우 약간의 딜레이 (브라우저 차단 방지)
        if (downloadableItems.length > 1) {
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
    }

    // 결과에 따라 toast 표시
    if (failedCount > 0) {
        if (successCount > 0) {
            // 일부 성공, 일부 실패
            toast.warning(
                FIRE_DRIVE_LOCALE.ERRORS.DOWNLOAD_PARTIAL_FAILED(
                    successCount,
                    failedCount
                )
            );
        } else {
            // 전체 실패
            toast.error(FIRE_DRIVE_LOCALE.ERRORS.DOWNLOAD_FAILED);
        }
    }

    return { successCount, failedCount };
}
