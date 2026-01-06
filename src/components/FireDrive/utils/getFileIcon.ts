import {
    File,
    FileImage,
    FileVideo,
    FileAudio,
    FileText,
    FileCode,
    FileArchive,
    FileSpreadsheet,
    Presentation,
    LucideIcon,
} from 'lucide-react';

// 브라우저에서 렌더링 가능한 이미지 포맷
const BROWSER_SUPPORTED_IMAGES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/ico',
    'image/x-icon',
    'image/avif',
];

export default function getFileIcon(mimeType?: string): LucideIcon {
    if (!mimeType) return File;

    if (mimeType.startsWith('image/')) return FileImage;
    if (mimeType.startsWith('video/')) return FileVideo;
    if (mimeType.startsWith('audio/')) return FileAudio;
    if (mimeType.startsWith('text/')) return FileText;
    if (mimeType.includes('pdf')) return FileText;
    if (
        mimeType.includes('zip') ||
        mimeType.includes('rar') ||
        mimeType.includes('tar') ||
        mimeType.includes('7z') ||
        mimeType.includes('gzip')
    )
        return FileArchive;
    if (mimeType.includes('sheet') || mimeType.includes('excel'))
        return FileSpreadsheet;
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
        return Presentation;
    if (
        mimeType.includes('javascript') ||
        mimeType.includes('json') ||
        mimeType.includes('xml') ||
        mimeType.includes('html') ||
        mimeType.includes('css')
    )
        return FileCode;

    return File;
}

export function isPreviewable(mimeType?: string): boolean {
    if (!mimeType) return false;
    return BROWSER_SUPPORTED_IMAGES.includes(mimeType) || mimeType === 'application/pdf';
}

export function isImage(mimeType?: string): boolean {
    if (!mimeType) return false;
    return BROWSER_SUPPORTED_IMAGES.includes(mimeType);
}

export function isPdf(mimeType?: string): boolean {
    if (!mimeType) return false;
    return mimeType === 'application/pdf';
}
