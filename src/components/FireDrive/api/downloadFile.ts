import { storage } from '@/lib/firebase';
import { ref, getDownloadURL, getBlob } from 'firebase/storage';

// blob 방식으로 다운로드할 확장자 (용량이 작은 파일들)
const BLOB_DOWNLOAD_EXTENSIONS = [
    // Images
    'jpeg',
    'jpg',
    'png',
    'gif',
    'webp',
    'svg',
    'tiff',
    'bmp',
    'heic',
    'ico',
    // Documents
    'pdf',
    // Media
    'mp3',
    'mp4',
    'wav',
    'webm',
    'ogg',
    'm4a',
    'mov',
    'avi',
];

function getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export default async function downloadFile(
    storagePath: string,
    fileName: string
): Promise<void> {
    const storageRef = ref(storage, storagePath);
    const extension = getFileExtension(fileName);

    // 작은 파일은 blob으로 다운로드 (진정한 다운로드)
    if (BLOB_DOWNLOAD_EXTENSIONS.includes(extension)) {
        let blobUrl: string | null = null;
        try {
            const blob = await getBlob(storageRef);
            blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        } catch (error) {
            // blob 실패 시 새 탭 방식으로 fallback
            console.warn('Blob download failed, falling back to new tab:', error);
        } finally {
            // 메모리 누수 방지: blobUrl이 생성된 경우 항상 해제
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        }
    }

    // 큰 파일이나 blob 실패 시 새 탭에서 열기
    const url = await getDownloadURL(storageRef);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function getFileUrl(storagePath: string): Promise<string> {
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
}
