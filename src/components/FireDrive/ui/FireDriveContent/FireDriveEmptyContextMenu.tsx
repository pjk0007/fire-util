import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { useFireDrive } from '../../contexts';
import { useTouchDevice } from '../../hooks';
import { FolderPlus, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import FireDriveNewFolderDialog from '../FireDriveDialog/FireDriveNewFolderDialog';

interface FireDriveEmptyContextMenuProps {
    children: React.ReactNode;
}

export default function FireDriveEmptyContextMenu({
    children,
}: FireDriveEmptyContextMenuProps) {
    const { uploadFiles } = useFireDrive();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const isTouch = useTouchDevice();

    // 모바일에서는 ContextMenu 비활성화 (롱프레스 충돌 방지)
    if (isTouch) {
        return <>{children}</>;
    }

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
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => setNewFolderOpen(true)}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        {FIRE_DRIVE_LOCALE.NEW_FOLDER}
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        {FIRE_DRIVE_LOCALE.UPLOAD_FILE}
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

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
