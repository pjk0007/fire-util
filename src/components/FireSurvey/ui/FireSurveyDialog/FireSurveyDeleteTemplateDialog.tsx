import { useState } from 'react';
import { toast } from 'sonner';
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
import { deleteTemplate } from '../../api/deleteTemplate';
import { FIRE_SURVEY_LOCALE } from '../../settings/constants';
import type { SurveyTemplate } from '../../settings/types';

interface FireSurveyDeleteTemplateDialogProps {
    template: SurveyTemplate;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FireSurveyDeleteTemplateDialog({
    template,
    open,
    onOpenChange,
}: FireSurveyDeleteTemplateDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteTemplate(template.id);
            toast.success(FIRE_SURVEY_LOCALE.SUCCESS.DELETED);
            onOpenChange(false);
        } catch {
            toast.error(FIRE_SURVEY_LOCALE.ERRORS.DELETE_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {FIRE_SURVEY_LOCALE.TEMPLATE.DELETE}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <span className="block">
                            {FIRE_SURVEY_LOCALE.CONFIRM.DELETE_TEMPLATE(template.title)}
                        </span>
                        <span className="block text-destructive">
                            {FIRE_SURVEY_LOCALE.CONFIRM.DELETE_TEMPLATE_WARNING}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {FIRE_SURVEY_LOCALE.BUTTONS.CANCEL}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {FIRE_SURVEY_LOCALE.BUTTONS.DELETE}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
