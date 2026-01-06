import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FireDriveItem,
    FIRE_DRIVE_LOCALE,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_MIME_TYPE_FIELD,
    DRIVE_NAME_FIELD,
    DRIVE_SIZE_FIELD,
    DRIVE_CREATED_AT_FIELD,
    DRIVE_TYPE_FILE,
} from '../settings';
import { downloadFile, getFileUrl } from '../api';
import { isImage, isPdf } from '../utils';

interface UseFireDriveSidePanelOptions {
    previewItem: FireDriveItem | null;
    setPreviewItem: (item: FireDriveItem | null) => void;
    items?: FireDriveItem[];
}

/**
 * 사이드 패널 로직을 처리하는 훅
 */
export default function useFireDriveSidePanel({
    previewItem,
    setPreviewItem,
    items = [],
}: UseFireDriveSidePanelOptions) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const isOpen = !!previewItem;

    // 파일만 필터링 (폴더 제외)
    const files = useMemo(
        () => items.filter((item) => item.type === DRIVE_TYPE_FILE),
        [items]
    );

    // 현재 파일의 인덱스
    const currentIndex = useMemo(() => {
        if (!previewItem) return -1;
        return files.findIndex((f) => f.id === previewItem.id);
    }, [files, previewItem]);

    // 이전/다음 파일 존재 여부
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex >= 0 && currentIndex < files.length - 1;

    // 이전 파일로 이동
    const goToPrev = useCallback(() => {
        if (hasPrev) {
            setPreviewItem(files[currentIndex - 1]);
        }
    }, [hasPrev, files, currentIndex, setPreviewItem]);

    // 다음 파일로 이동
    const goToNext = useCallback(() => {
        if (hasNext) {
            setPreviewItem(files[currentIndex + 1]);
        }
    }, [hasNext, files, currentIndex, setPreviewItem]);

    // 이미지 URL 로드
    useEffect(() => {
        if (!previewItem) {
            setImageUrl(null);
            return;
        }

        const storagePath = previewItem[DRIVE_STORAGE_PATH_FIELD];
        const mimeType = previewItem[DRIVE_MIME_TYPE_FIELD];

        if (storagePath && isImage(mimeType)) {
            setIsLoadingImage(true);
            getFileUrl(storagePath)
                .then(setImageUrl)
                .catch((error) => {
                    console.error('Failed to load image:', error);
                    setImageUrl(null);
                })
                .finally(() => setIsLoadingImage(false));
        } else {
            setImageUrl(null);
        }
    }, [previewItem]);

    // 파일 정보 추출
    const mimeType = previewItem?.[DRIVE_MIME_TYPE_FIELD];
    const storagePath = previewItem?.[DRIVE_STORAGE_PATH_FIELD];
    const fileName = previewItem?.[DRIVE_NAME_FIELD] ?? '';
    const fileSize = previewItem?.[DRIVE_SIZE_FIELD];
    const createdAt = previewItem?.[DRIVE_CREATED_AT_FIELD];

    const handleDownload = async () => {
        if (storagePath) {
            await downloadFile(storagePath, fileName);
        }
    };

    const handleClose = () => {
        setPreviewItem(null);
    };

    const handleOpenInNewTab = async () => {
        if (storagePath) {
            const url = await getFileUrl(storagePath);
            window.open(url, '_blank');
        }
    };

    const formatDate = (timestamp: typeof createdAt) => {
        if (!timestamp) return '-';
        const date = timestamp.toDate();
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getFileTypeLabel = () => {
        if (!mimeType) return FIRE_DRIVE_LOCALE.FILE_TYPES.FILE;
        if (isImage(mimeType)) return FIRE_DRIVE_LOCALE.FILE_TYPES.IMAGE;
        if (isPdf(mimeType)) return FIRE_DRIVE_LOCALE.FILE_TYPES.PDF;
        if (mimeType.startsWith('video/')) return FIRE_DRIVE_LOCALE.FILE_TYPES.VIDEO;
        if (mimeType.startsWith('audio/')) return FIRE_DRIVE_LOCALE.FILE_TYPES.AUDIO;
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FIRE_DRIVE_LOCALE.FILE_TYPES.SPREADSHEET;
        if (mimeType.includes('document') || mimeType.includes('word')) return FIRE_DRIVE_LOCALE.FILE_TYPES.DOCUMENT;
        if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return FIRE_DRIVE_LOCALE.FILE_TYPES.PRESENTATION;
        return FIRE_DRIVE_LOCALE.FILE_TYPES.FILE;
    };

    const canPreviewFullscreen = storagePath && (isImage(mimeType) || isPdf(mimeType));

    return {
        isOpen,
        imageUrl,
        isLoadingImage,
        mimeType,
        storagePath,
        fileName,
        fileSize,
        createdAt,
        handleDownload,
        handleClose,
        handleOpenInNewTab,
        formatDate,
        getFileTypeLabel,
        canPreviewFullscreen,
        // 파일 네비게이션
        hasPrev,
        hasNext,
        goToPrev,
        goToNext,
        currentIndex,
        totalFiles: files.length,
    };
}
