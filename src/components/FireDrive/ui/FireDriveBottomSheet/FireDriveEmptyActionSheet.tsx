import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { useFireDrive } from '../../contexts';
import { FolderPlus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import FireDriveNewFolderDialog from '../FireDriveDialog/FireDriveNewFolderDialog';
import ActionButton from './ActionButton';

interface FireDriveEmptyActionSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function FireDriveEmptyActionSheet({
    open,
    onOpenChange,
}: FireDriveEmptyActionSheetProps) {
    const { uploadFiles } = useFireDrive();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newFolderOpen, setNewFolderOpen] = useState(false);

    const handleNewFolder = () => {
        onOpenChange(false);
        setTimeout(() => setNewFolderOpen(true), 100);
    };

    const handleUpload = () => {
        onOpenChange(false);
        setTimeout(() => fileInputRef.current?.click(), 100);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadFiles(Array.from(files));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className="rounded-t-xl pb-8">
                    <SheetHeader className="pb-2">
                        <SheetTitle className="text-left">
                            {FIRE_DRIVE_LOCALE.BOTTOM_SHEET.SELECT_ACTION}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-1 mt-2">
                        <ActionButton
                            icon={FolderPlus}
                            label={FIRE_DRIVE_LOCALE.NEW_FOLDER}
                            onClick={handleNewFolder}
                        />
                        <ActionButton
                            icon={Upload}
                            label={FIRE_DRIVE_LOCALE.UPLOAD_FILE}
                            onClick={handleUpload}
                        />
                    </div>
                </SheetContent>
            </Sheet>

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
        </>
    );
}
