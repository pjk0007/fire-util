import { useState, useCallback } from 'react';

interface UseFireDriveDropzoneOptions {
    uploadFiles: (files: File[]) => void;
}

/**
 * 파일 드래그앤드롭 업로드 로직을 처리하는 훅
 */
export default function useFireDriveDropzone({
    uploadFiles,
}: UseFireDriveDropzoneOptions) {
    const [isDragging, setIsDragging] = useState(false);

    // 내부 아이템 드래그인지 확인 (폴더로 이동)
    const isInternalDrag = useCallback((e: React.DragEvent) => {
        return e.dataTransfer.types.includes('application/json');
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // 내부 드래그(폴더 이동)일 때는 업로드 UI 표시 안함
        if (!isInternalDrag(e)) {
            setIsDragging(true);
        }
    }, [isInternalDrag]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // 자식 요소로 이동할 때는 무시
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
            return;
        }
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        // 내부 드래그일 때는 이벤트 전파를 막지 않음 (폴더로 드롭 가능하게)
        if (isInternalDrag(e)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
    }, [isInternalDrag]);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            // 내부 드래그일 때는 처리하지 않음 (FireDriveItem에서 처리)
            if (isInternalDrag(e)) {
                setIsDragging(false);
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                uploadFiles(files);
            }
        },
        [uploadFiles, isInternalDrag]
    );

    return {
        isDragging,
        handlers: {
            onDragEnter: handleDragEnter,
            onDragLeave: handleDragLeave,
            onDragOver: handleDragOver,
            onDrop: handleDrop,
        },
    };
}
