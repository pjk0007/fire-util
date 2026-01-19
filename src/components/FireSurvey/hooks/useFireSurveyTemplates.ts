import { useState, useEffect } from 'react';
import { subscribeToTemplates } from '../api/getTemplates';
import type { SurveyTemplate } from '../settings/types';

interface UseFireSurveyTemplatesReturn {
    templates: SurveyTemplate[];
    isLoading: boolean;
    error: Error | null;
}

export function useFireSurveyTemplates(): UseFireSurveyTemplatesReturn {
    const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const unsubscribe = subscribeToTemplates((data) => {
            setTemplates(data);
            setIsLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return { templates, isLoading, error };
}
