import { useFireDrive } from '../../contexts';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { createFolder } from '../../api';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

interface FireDriveNewFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function FireDriveNewFolderDialog({
    open,
    onOpenChange,
}: FireDriveNewFolderDialogProps) {
    const { channelId, currentFolderId } = useFireDrive();
    const { user } = useFireAuth();
    const [name, setName] = useState(FIRE_DRIVE_LOCALE.DIALOG.NEW_FOLDER_DEFAULT_NAME);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!channelId || !user?.id || !name.trim()) return;

        try {
            setIsLoading(true);
            await createFolder(channelId, currentFolderId, name.trim(), user.id);
            setName(FIRE_DRIVE_LOCALE.DIALOG.NEW_FOLDER_DEFAULT_NAME);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to create folder:', error);
            toast.error(FIRE_DRIVE_LOCALE.ERRORS.CREATE_FOLDER_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading && name.trim()) {
            handleCreate();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {FIRE_DRIVE_LOCALE.DIALOG.NEW_FOLDER_TITLE}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Label htmlFor="folder-name">
                        {FIRE_DRIVE_LOCALE.DIALOG.NEW_FOLDER_PLACEHOLDER}
                    </Label>
                    <Input
                        id="folder-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="mt-2"
                        autoFocus
                        onFocus={(e) => e.target.select()}
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {FIRE_DRIVE_LOCALE.BUTTONS.CANCEL}
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={isLoading || !name.trim()}
                    >
                        {FIRE_DRIVE_LOCALE.BUTTONS.CREATE}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
