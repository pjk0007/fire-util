import { useFireDrive } from '../../contexts';
import { useFireDriveSidePanel } from '../../hooks';
import {
    FIRE_DRIVE_LOCALE,
    DRIVE_NAME_FIELD,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_MIME_TYPE_FIELD,
} from '../../settings';
import { Button } from '@/components/ui/button';
import { Download, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadFile, getFileUrl } from '../../api';
import { isImage, isPdf, getFileIcon } from '../../utils';
import { useEffect, useState } from 'react';

export default function FireDrivePreviewDialog() {
    const { previewItem, setPreviewItem, items } = useFireDrive();
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        hasPrev,
        hasNext,
        goToPrev,
        goToNext,
        currentIndex,
        totalFiles,
    } = useFireDriveSidePanel({ previewItem, setPreviewItem, items });

    // 파일 URL 로드
    useEffect(() => {
        if (!previewItem) {
            setFileUrl(null);
            return;
        }

        const storagePath = previewItem[DRIVE_STORAGE_PATH_FIELD];
        if (storagePath) {
            setIsLoading(true);
            getFileUrl(storagePath)
                .then(setFileUrl)
                .catch((error) => {
                    console.error('Failed to load file:', error);
                    setFileUrl(null);
                })
                .finally(() => setIsLoading(false));
        }
    }, [previewItem]);

    if (!previewItem) {
        return null;
    }

    const mimeType = previewItem[DRIVE_MIME_TYPE_FIELD];
    const storagePath = previewItem[DRIVE_STORAGE_PATH_FIELD];
    const fileName = previewItem[DRIVE_NAME_FIELD];

    const handleDownload = async () => {
        if (storagePath) {
            await downloadFile(storagePath, fileName);
        }
    };

    const handleClose = () => {
        setPreviewItem(null);
    };

    const renderPreview = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-10 w-10 animate-spin text-white/70" />
                </div>
            );
        }

        if (!fileUrl) {
            const FileIcon = getFileIcon(mimeType);
            return (
                <div className="flex flex-col items-center justify-center h-full text-white/70">
                    <FileIcon className="h-24 w-24 mb-4 opacity-70" />
                    <p className="text-lg font-medium mb-2 text-white">{fileName}</p>
                    <p className="text-sm mb-4">{FIRE_DRIVE_LOCALE.PREVIEW.UNSUPPORTED}</p>
                    <Button variant="secondary" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        {FIRE_DRIVE_LOCALE.PREVIEW.DOWNLOAD_TO_OPEN}
                    </Button>
                </div>
            );
        }

        if (isImage(mimeType)) {
            return (
                <div className="flex items-center justify-center h-full p-4">
                    <img
                        src={fileUrl}
                        alt={fileName}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            );
        }

        if (isPdf(mimeType)) {
            return (
                <iframe
                    src={`${fileUrl}#toolbar=1&navpanes=0`}
                    className="w-full h-full border-0 bg-white"
                    title="PDF Preview"
                />
            );
        }

        // 미리보기 불가능한 파일 - 파일 타입에 맞는 아이콘 표시
        const FileIcon = getFileIcon(mimeType);
        return (
            <div className="flex flex-col items-center justify-center h-full text-white/70">
                <FileIcon className="h-24 w-24 mb-4 opacity-70" />
                <p className="text-lg font-medium mb-2 text-white">{fileName}</p>
                <p className="text-sm mb-4">{FIRE_DRIVE_LOCALE.PREVIEW.UNSUPPORTED}</p>
                <Button variant="secondary" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    {FIRE_DRIVE_LOCALE.PREVIEW.DOWNLOAD_TO_OPEN}
                </Button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
            {/* 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/60">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="text-white hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                    <span className="font-medium truncate text-white">{fileName}</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="text-white hover:bg-white/20"
                >
                    <Download className="h-4 w-4 mr-2" />
                    {FIRE_DRIVE_LOCALE.ACTIONS.DOWNLOAD}
                </Button>
            </div>

            {/* 미리보기 영역 */}
            <div className="flex-1 overflow-auto relative">
                {renderPreview()}

                {/* 이전/다음 파일 네비게이션 */}
                {totalFiles > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white bg-white/20 hover:bg-white/40 disabled:opacity-30"
                            onClick={goToPrev}
                            disabled={!hasPrev}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 text-white bg-white/20 hover:bg-white/40 disabled:opacity-30"
                            onClick={goToNext}
                            disabled={!hasNext}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    </>
                )}
            </div>

            {/* 파일 인덱스 표시 */}
            {totalFiles > 1 && (
                <div className="text-center text-sm text-white/70 py-2 bg-black/60">
                    {currentIndex + 1} / {totalFiles}
                </div>
            )}
        </div>
    );
}
