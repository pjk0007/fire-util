import { Timestamp } from 'firebase/firestore';
import {
    DRIVE_ID_FIELD,
    DRIVE_NAME_FIELD,
    DRIVE_TYPE_FIELD,
    DRIVE_PARENT_ID_FIELD,
    DRIVE_STORAGE_PATH_FIELD,
    DRIVE_SIZE_FIELD,
    DRIVE_MIME_TYPE_FIELD,
    DRIVE_CREATED_BY_FIELD,
    DRIVE_CREATED_AT_FIELD,
    DRIVE_UPDATED_AT_FIELD,
    DRIVE_TYPE_FOLDER,
    DRIVE_TYPE_FILE,
} from './constants';

export type DriveItemType = typeof DRIVE_TYPE_FOLDER | typeof DRIVE_TYPE_FILE;

export interface FireDriveItem {
    [DRIVE_ID_FIELD]: string;
    [DRIVE_NAME_FIELD]: string;
    [DRIVE_TYPE_FIELD]: DriveItemType;
    [DRIVE_PARENT_ID_FIELD]: string | null;
    [DRIVE_STORAGE_PATH_FIELD]?: string;
    [DRIVE_SIZE_FIELD]?: number;
    [DRIVE_MIME_TYPE_FIELD]?: string;
    [DRIVE_CREATED_BY_FIELD]: string;
    [DRIVE_CREATED_AT_FIELD]: Timestamp;
    [DRIVE_UPDATED_AT_FIELD]: Timestamp;
}

export interface FireDriveFolder extends FireDriveItem {
    [DRIVE_TYPE_FIELD]: typeof DRIVE_TYPE_FOLDER;
}

export interface FireDriveFile extends FireDriveItem {
    [DRIVE_TYPE_FIELD]: typeof DRIVE_TYPE_FILE;
    [DRIVE_STORAGE_PATH_FIELD]: string;
    [DRIVE_SIZE_FIELD]: number;
    [DRIVE_MIME_TYPE_FIELD]: string;
}

// Upload progress tracking
export interface FireDriveUploadTask {
    id: string;
    fileName: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

// Navigation state
export interface FireDriveNavigationState {
    currentFolderId: string | null;
    breadcrumb: FireDriveItem[];
}
