import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface UploadedFile {
    name: string;
    url: string;
}

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'databases/{databaseId}/files')
 * @returns Object containing the file name and download URL
 */
export async function uploadFile(
    file: File,
    path: string
): Promise<UploadedFile> {
    // Create a unique filename to avoid collisions
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${sanitizedFileName}`;
    const fullPath = `${path}/${fileName}`;

    // Create a storage reference
    const storageRef = ref(storage, fullPath);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return {
        name: file.name, // Use original file name for display
        url: downloadURL,
    };
}

/**
 * Upload multiple files to Firebase Storage
 * @param files - Array of files to upload
 * @param path - The storage path (e.g., 'databases/{databaseId}/files')
 * @returns Array of objects containing file names and download URLs
 */
export async function uploadFiles(
    files: File[],
    path: string
): Promise<UploadedFile[]> {
    const uploadPromises = files.map((file) => uploadFile(file, path));
    return Promise.all(uploadPromises);
}
