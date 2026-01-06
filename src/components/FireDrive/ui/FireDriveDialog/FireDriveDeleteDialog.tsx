import { useFireDrive } from '../../contexts';
import {
    FIRE_DRIVE_LOCALE,
    FireDriveItem,
    DRIVE_NAME_FIELD,
    DRIVE_TYPE_FOLDER,
} from '../../settings';
import { deleteItem, deleteItems } from '../../api';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface FireDriveDeleteDialogProps {
    items: FireDriveItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

export default function FireDriveDeleteDialog({
    items,
    open,
    onOpenChange,
    onDeleted,
}: FireDriveDeleteDialogProps) {
    const { channelId } = useFireDrive();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!channelId || items.length === 0) return;

        try {
            setIsLoading(true);
            if (items.length === 1) {
                await deleteItem(channelId, items[0]);
            } else {
                const result = await deleteItems(channelId, items);
                if (result.failedCount > 0) {
                    if (result.successCount > 0) {
                        toast.warning(FIRE_DRIVE_LOCALE.ERRORS.DELETE_PARTIAL_FAILED(result.successCount, result.failedCount));
                    } else {
                        toast.error(FIRE_DRIVE_LOCALE.ERRORS.DELETE_FAILED);
                    }
                }
            }
            onDeleted?.();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to delete item(s):', error);
            toast.error(FIRE_DRIVE_LOCALE.ERRORS.DELETE_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    const getDescription = () => {
        if (items.length === 0) return '';

        if (items.length > 1) {
            return FIRE_DRIVE_LOCALE.DIALOG.DELETE_MULTIPLE_CONFIRM(items.length);
        }

        const item = items[0];
        const isFolder = item.type === DRIVE_TYPE_FOLDER;
        return isFolder
            ? FIRE_DRIVE_LOCALE.DIALOG.DELETE_FOLDER_CONFIRM(item[DRIVE_NAME_FIELD])
            : FIRE_DRIVE_LOCALE.DIALOG.DELETE_FILE_CONFIRM(item[DRIVE_NAME_FIELD]);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {FIRE_DRIVE_LOCALE.DIALOG.DELETE_TITLE}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {getDescription()}
                        <br />
                        <span className="text-destructive font-medium">
                            {FIRE_DRIVE_LOCALE.DIALOG.DELETE_WARNING}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        {FIRE_DRIVE_LOCALE.BUTTONS.CANCEL}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {FIRE_DRIVE_LOCALE.BUTTONS.DELETE}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
