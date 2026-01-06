import { MAX_FILE_SIZE, FIRE_DRIVE_LOCALE } from '../settings';
import { FireDriveUploadTask } from '../settings';
import { uploadFile } from '../api';
import { formatFileSize } from '../utils';
import { UploadTask } from 'firebase/storage';
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

const AUTO_CLEAR_DELAY = 3000; // 완료 후 3초 뒤 자동 제거

interface UseFireDriveUploadOptions {
    channelId: string;
    parentId: string | null;
    userId: string;
    onComplete?: (fileId: string) => void;
    onError?: (error: Error) => void;
}

export default function useFireDriveUpload({
    channelId,
    parentId,
    userId,
    onComplete,
    onError,
}: UseFireDriveUploadOptions) {
    const [uploadTasks, setUploadTasks] = useState<FireDriveUploadTask[]>([]);
    const uploadTaskRefs = useRef<Map<string, UploadTask>>(new Map());

    const uploadSingleFile = useCallback(
        async (file: File) => {
            const taskId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // 파일 크기 초과 시 에러 상태로 즉시 표시 + 토스트 알림
            if (file.size > MAX_FILE_SIZE) {
                const maxSizeStr = formatFileSize(MAX_FILE_SIZE);
                const errorMessage = FIRE_DRIVE_LOCALE.UPLOAD.FILE_TOO_LARGE(maxSizeStr);

                // 토스트 알림
                toast.error(errorMessage, {
                    description: file.name,
                });

                // 업로드 UI에 에러 표시
                setUploadTasks((prev) => [
                    ...prev,
                    {
                        id: taskId,
                        fileName: file.name,
                        progress: 0,
                        status: 'error',
                        error: errorMessage,
                    },
                ]);
                onError?.(new Error(errorMessage));
                return;
            }

            setUploadTasks((prev) => [
                ...prev,
                {
                    id: taskId,
                    fileName: file.name,
                    progress: 0,
                    status: 'uploading',
                },
            ]);

            const { uploadTask, fileId } = uploadFile({
                channelId,
                parentId,
                file,
                userId,
                onProgress: (progress) => {
                    setUploadTasks((prev) =>
                        prev.map((task) =>
                            task.id === taskId ? { ...task, progress } : task
                        )
                    );
                },
                onComplete: () => {
                    setUploadTasks((prev) =>
                        prev.map((task) =>
                            task.id === taskId
                                ? { ...task, status: 'completed', progress: 100 }
                                : task
                        )
                    );
                    onComplete?.(fileId);
                },
                onError: (error) => {
                    setUploadTasks((prev) =>
                        prev.map((task) =>
                            task.id === taskId
                                ? { ...task, status: 'error', error: error.message }
                                : task
                        )
                    );
                    onError?.(error);
                },
            });

            uploadTaskRefs.current.set(taskId, uploadTask);
        },
        [channelId, parentId, userId, onComplete, onError]
    );

    const uploadFiles = useCallback(
        async (files: File[]) => {
            for (const file of files) {
                await uploadSingleFile(file);
            }
        },
        [uploadSingleFile]
    );

    const cancelUpload = useCallback((taskId: string) => {
        const uploadTask = uploadTaskRefs.current.get(taskId);
        if (uploadTask) {
            uploadTask.cancel();
            uploadTaskRefs.current.delete(taskId);
            setUploadTasks((prev) => prev.filter((task) => task.id !== taskId));
        }
    }, []);

    const clearCompletedUploads = useCallback(() => {
        setUploadTasks((prev) =>
            prev.filter((task) => task.status !== 'completed')
        );
    }, []);

    // 에러 항목 수동 제거
    const dismissError = useCallback((taskId: string) => {
        setUploadTasks((prev) => prev.filter((task) => task.id !== taskId));
    }, []);

    // 완료된 항목 자동 제거 (3초 후)
    useEffect(() => {
        const completedTasks = uploadTasks.filter(
            (task) => task.status === 'completed'
        );

        if (completedTasks.length === 0) return;

        const timers = completedTasks.map((task) =>
            setTimeout(() => {
                setUploadTasks((prev) => prev.filter((t) => t.id !== task.id));
            }, AUTO_CLEAR_DELAY)
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [uploadTasks]);

    return {
        uploadTasks,
        uploadFile: uploadSingleFile,
        uploadFiles,
        cancelUpload,
        clearCompletedUploads,
        dismissError,
        isUploading: uploadTasks.some((task) => task.status === 'uploading'),
    };
}
