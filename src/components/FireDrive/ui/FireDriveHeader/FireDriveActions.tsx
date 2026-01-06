import { useFireDrive } from '../../contexts';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { Button } from '@/components/ui/button';
import { FolderPlus, Upload, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import FireDriveNewFolderDialog from '../FireDriveDialog/FireDriveNewFolderDialog';
import FireDriveDeleteDialog from '../FireDriveDialog/FireDriveDeleteDialog';

export default function FireDriveActions() {
    const { uploadFiles, selectedItems, clearSelection } = useFireDrive();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadFiles(Array.from(files));
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {selectedItems.length > 0 && (
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                    onClick={() => setDeleteOpen(true)}
                    title={FIRE_DRIVE_LOCALE.ACTIONS.DELETE}
                >
                    <Trash2 className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">
                        {FIRE_DRIVE_LOCALE.ACTIONS.DELETE}
                    </span>
                </Button>
            )}

            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                onClick={() => setNewFolderOpen(true)}
                title={FIRE_DRIVE_LOCALE.NEW_FOLDER}
            >
                <FolderPlus className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">
                    {FIRE_DRIVE_LOCALE.NEW_FOLDER}
                </span>
            </Button>

            <Button
                variant="default"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                onClick={() => fileInputRef.current?.click()}
                title={FIRE_DRIVE_LOCALE.UPLOAD_FILE}
            >
                <Upload className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">
                    {FIRE_DRIVE_LOCALE.UPLOAD_FILE}
                </span>
            </Button>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
            />

            <FireDriveNewFolderDialog
                open={newFolderOpen}
                onOpenChange={setNewFolderOpen}
            />

            <FireDriveDeleteDialog
                items={selectedItems}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleted={clearSelection}
            />
        </div>
    );
}
