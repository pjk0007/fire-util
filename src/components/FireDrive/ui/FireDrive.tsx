import { FireDriveProvider, useFireDrive } from '../contexts';
import FireDriveHeader from './FireDriveHeader/FireDriveHeader';
import FireDriveContent from './FireDriveContent/FireDriveContent';
import FireDriveUploadDropzone from './FireDriveUpload/FireDriveUploadDropzone';
import FireDriveUploadProgress from './FireDriveUpload/FireDriveUploadProgress';
import FireDrivePreviewDialog from './FireDrivePreview/FireDrivePreviewDialog';
import FireDriveDeleteDialog from './FireDriveDialog/FireDriveDeleteDialog';
import { useState, useEffect } from 'react';

interface FireDriveProps {
    channelId?: string;
}

function FireDriveInner() {
    const { selectedItems, clearSelection } = useFireDrive();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Delete 키 이벤트 리스너
    useEffect(() => {
        const handleDeleteRequest = () => {
            if (selectedItems.length > 0) {
                setDeleteDialogOpen(true);
            }
        };

        window.addEventListener('firedrive:delete-request', handleDeleteRequest);
        return () => {
            window.removeEventListener('firedrive:delete-request', handleDeleteRequest);
        };
    }, [selectedItems.length]);

    const handleDeleted = () => {
        clearSelection();
    };

    return (
        <div className="flex flex-col h-full">
            <FireDriveHeader />
            <FireDriveUploadDropzone>
                <FireDriveContent />
            </FireDriveUploadDropzone>
            <FireDriveUploadProgress />
            <FireDrivePreviewDialog />
            <FireDriveDeleteDialog
                items={selectedItems}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onDeleted={handleDeleted}
            />
        </div>
    );
}

export default function FireDrive({ channelId }: FireDriveProps) {
    return (
        <FireDriveProvider channelId={channelId}>
            <FireDriveInner />
        </FireDriveProvider>
    );
}
