import { useFireDrive } from '../../contexts';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { useFireDriveSidePanel } from '../../hooks';
import { isImage, isPdf, formatFileSize } from '../../utils';
import { Button } from '@/components/ui/button';
import { Download, X, FileText, Image, File, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FireDriveSidePanel() {
    const { previewItem, setPreviewItem, items } = useFireDrive();

    const {
        isOpen,
        imageUrl,
        isLoadingImage,
        mimeType,
        fileName,
        fileSize,
        createdAt,
        handleDownload,
        handleClose,
        handleOpenInNewTab,
        formatDate,
        getFileTypeLabel,
        canPreviewFullscreen,
        hasPrev,
        hasNext,
        goToPrev,
        goToNext,
        currentIndex,
        totalFiles,
    } = useFireDriveSidePanel({ previewItem, setPreviewItem, items });

    if (!previewItem) {
        return null;
    }

    const getFileTypeIcon = () => {
        if (isImage(mimeType)) {
            return <Image className="h-6 w-6 text-blue-500" />;
        }
        if (isPdf(mimeType)) {
            return <FileText className="h-6 w-6 text-red-500" />;
        }
        return <File className="h-6 w-6 text-gray-500" />;
    };

    return (
        <div
            className={cn(
                'fixed top-0 right-0 h-full w-[400px] bg-background border-l shadow-lg z-50',
                'transform transition-transform duration-200 ease-out',
                isOpen ? 'translate-x-0' : 'translate-x-full'
            )}
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileTypeIcon()}
                    <span className="font-medium truncate">{fileName}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleDownload} title={FIRE_DRIVE_LOCALE.ACTIONS.DOWNLOAD}>
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* 미리보기 영역 */}
            <div className="p-4 border-b">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {isLoadingImage ? (
                        <div className="animate-pulse text-muted-foreground">{FIRE_DRIVE_LOCALE.PREVIEW.LOADING}</div>
                    ) : imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={fileName}
                            className="w-full h-full object-contain"
                        />
                    ) : isPdf(mimeType) ? (
                        <FileText className="h-16 w-16 text-red-400" />
                    ) : (
                        <File className="h-16 w-16 text-muted-foreground" />
                    )}

                    {/* 이전/다음 파일 네비게이션 */}
                    {totalFiles > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-background disabled:opacity-30"
                                onClick={goToPrev}
                                disabled={!hasPrev}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-background disabled:opacity-30"
                                onClick={goToNext}
                                disabled={!hasNext}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </>
                    )}
                </div>

                {/* 파일 인덱스 표시 */}
                {totalFiles > 1 && (
                    <div className="text-center text-xs text-muted-foreground mt-2">
                        {currentIndex + 1} / {totalFiles}
                    </div>
                )}
            </div>

            {/* 파일 세부정보 */}
            <div className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">{FIRE_DRIVE_LOCALE.FILE_INFO.TITLE}</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{FIRE_DRIVE_LOCALE.FILE_INFO.TYPE}</span>
                        <span>{getFileTypeLabel()}</span>
                    </div>
                    {fileSize && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{FIRE_DRIVE_LOCALE.FILE_INFO.SIZE}</span>
                            <span>{formatFileSize(fileSize)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{FIRE_DRIVE_LOCALE.FILE_INFO.CREATED_AT}</span>
                        <span>{formatDate(createdAt)}</span>
                    </div>
                    {mimeType && (
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{FIRE_DRIVE_LOCALE.FILE_INFO.MIME_TYPE}</span>
                            <span className="truncate ml-4 text-right">{mimeType}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 전체 화면 미리보기 버튼 (이미지/PDF) */}
            {canPreviewFullscreen && (
                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleOpenInNewTab}
                    >
                        {FIRE_DRIVE_LOCALE.PREVIEW.OPEN_IN_NEW_TAB}
                    </Button>
                </div>
            )}
        </div>
    );
}
