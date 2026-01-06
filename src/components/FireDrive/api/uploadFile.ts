import { db, storage } from '@/lib/firebase';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import {
    DRIVE_COLLECTION,
    DRIVE_ID_FIELD,
    DRIVE_NAME_FIELD,
    DRIVE_TYPE_FIELD,
    DRIVE_TYPE_FILE,
    DRIVE_PARENT_ID_FIELD,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_SIZE_FIELD,
    DRIVE_MIME_TYPE_FIELD,
    DRIVE_CREATED_BY_FIELD,
    DRIVE_CREATED_AT_FIELD,
    DRIVE_UPDATED_AT_FIELD,
} from '../settings';
import { FireDriveFile } from '../settings';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, UploadTask } from 'firebase/storage';
import { sanitizeFileName } from '../utils';

interface UploadFileOptions {
    channelId: string;
    parentId: string | null;
    file: File;
    userId: string;
    onProgress?: (progress: number) => void;
    onComplete?: (fileId: string) => void;
    onError?: (error: Error) => void;
}

export default function uploadFile({
    channelId,
    parentId,
    file,
    userId,
    onProgress,
    onComplete,
    onError,
}: UploadFileOptions): { uploadTask: UploadTask; fileId: string } {
    const fileId = `file-${crypto.randomUUID()}`;
    const safeName = sanitizeFileName(file.name);
    const storagePath = `${CHANNEL_COLLECTION}/${channelId}/${DRIVE_COLLECTION}/${fileId}/${safeName}`;

    const storageRef = ref(storage, storagePath);
    const metadata = { contentType: file.type };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
        },
        (error) => {
            onError?.(error);
        },
        async () => {
            try {
                await createFileDocument(
                    channelId,
                    fileId,
                    parentId,
                    file,
                    storagePath,
                    userId
                );
                onComplete?.(fileId);
            } catch (error) {
                onError?.(error as Error);
            }
        }
    );

    return { uploadTask, fileId };
}

export async function createFileDocument(
    channelId: string,
    fileId: string,
    parentId: string | null,
    file: File,
    storagePath: string,
    userId: string
): Promise<void> {
    const fileRef = doc(
        db,
        CHANNEL_COLLECTION,
        channelId,
        DRIVE_COLLECTION,
        fileId
    );

    const fileDoc: FireDriveFile = {
        [DRIVE_ID_FIELD]: fileId,
        [DRIVE_NAME_FIELD]: file.name,
        [DRIVE_TYPE_FIELD]: DRIVE_TYPE_FILE,
        [DRIVE_PARENT_ID_FIELD]: parentId,
        [DRIVE_STORAGE_PATH_FIELD]: storagePath,
        [DRIVE_SIZE_FIELD]: file.size,
        [DRIVE_MIME_TYPE_FIELD]: file.type || 'application/octet-stream',
        [DRIVE_CREATED_BY_FIELD]: userId,
        [DRIVE_CREATED_AT_FIELD]: Timestamp.now(),
        [DRIVE_UPDATED_AT_FIELD]: Timestamp.now(),
    };

    await setDoc(fileRef, fileDoc);
}
