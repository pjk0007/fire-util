import { useFireDrive } from '../../contexts';
import { useFireDriveDropzone } from '../../hooks';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { Upload } from 'lucide-react';
import { ReactNode } from 'react';

interface FireDriveUploadDropzoneProps {
    children: ReactNode;
}

export default function FireDriveUploadDropzone({
    children,
}: FireDriveUploadDropzoneProps) {
    const { uploadFiles } = useFireDrive();
    const { isDragging, handlers } = useFireDriveDropzone({ uploadFiles });

    return (
        <div className="relative flex-1 overflow-auto" {...handlers}>
            {children}

            {isDragging && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center z-50">
                    <Upload className="h-12 w-12 text-primary mb-4" />
                    <p className="text-lg font-medium text-primary">
                        {FIRE_DRIVE_LOCALE.DRAG_DROP_HINT}
                    </p>
                </div>
            )}
        </div>
    );
}
