import { useMemo } from 'react';
import { useFireSurveyTemplates } from './useFireSurveyTemplates';
import type { SurveyTemplate } from '../settings/types';

interface UseFireSurveyTemplateReturn {
    template: SurveyTemplate | null;
    isLoading: boolean;
    error: Error | null;
}

export function useFireSurveyTemplate(
    templateId: string | null
): UseFireSurveyTemplateReturn {
    const { templates, isLoading, error } = useFireSurveyTemplates();

    const template = useMemo(() => {
        if (!templateId) return null;
        return templates.find((t) => t.id === templateId) || null;
    }, [templates, templateId]);

    return { template, isLoading, error };
}
