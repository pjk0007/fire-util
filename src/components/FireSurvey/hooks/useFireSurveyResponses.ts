import { useState, useEffect, useMemo } from 'react';
import { subscribeToResponses } from '../api/getResponses';
import type { SurveyResponse, ResponseFilters } from '../settings/types';

interface UseFireSurveyResponsesReturn {
    responses: SurveyResponse[];
    isLoading: boolean;
    error: Error | null;
}

export function useFireSurveyResponses(
    filters?: ResponseFilters
): UseFireSurveyResponsesReturn {
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const startTime = useMemo(() => filters?.startDate?.getTime(), [filters?.startDate]);
    const endTime = useMemo(() => filters?.endDate?.getTime(), [filters?.endDate]);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const unsubscribe = subscribeToResponses((data) => {
            setResponses(data);
            setIsLoading(false);
        }, filters);

        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters?.templateId, filters?.surveyType, startTime, endTime]);

    return { responses, isLoading, error };
}
