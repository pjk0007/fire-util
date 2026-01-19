import { ClipboardList } from 'lucide-react';
import { FIRE_SURVEY_LOCALE } from '../../settings/constants';

export function FireSurveyTemplateEmpty() {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{FIRE_SURVEY_LOCALE.TEMPLATE.EMPTY}</h3>
            <p className="text-sm text-muted-foreground mt-1">
                {FIRE_SURVEY_LOCALE.TEMPLATE.CREATE_FIRST}
            </p>
        </div>
    );
}
