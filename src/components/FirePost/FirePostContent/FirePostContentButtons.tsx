import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { FIRE_POST_LOCALE } from '@/lib/FirePost/settings';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function FirePostContentButtons({
    editable,
    isChanged,
    onSave,
    onDelete,
    onClickGoBack,
}: {
    editable: boolean;
    isChanged?: boolean;
    onSave: () => void;
    onDelete?: () => void;
    onClickGoBack: () => void;
}) {
    return (
        <div className="w-full flex justify-between items-center">
            <Button
                variant={'ghost'}
                size={'sm'}
                style={{
                    paddingLeft: 1,
                    paddingRight: 8,
                }}
                onClick={onClickGoBack}
            >
                <ChevronLeft size={16} />
                {FIRE_POST_LOCALE.BACK_BUTTON}
            </Button>
            {editable && (
                <div className="flex gap-2">
                    {onDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={'destructive'}>
                                    {FIRE_POST_LOCALE.DELETE_BUTTON}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        {FIRE_POST_LOCALE.DELETE_TITLE}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {FIRE_POST_LOCALE.DELETE_DESCRIPTION}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        {FIRE_POST_LOCALE.CANCEL_BUTTON}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={onDelete}
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                    >
                                        {FIRE_POST_LOCALE.DELETE_BUTTON}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Button disabled={!isChanged} onClick={onSave}>
                        {FIRE_POST_LOCALE.SAVE_BUTTON}
                    </Button>
                </div>
            )}
        </div>
    );
}
