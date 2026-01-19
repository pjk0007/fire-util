import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_TEMPLATES_COLLECTION,
    TEMPLATE_TARGET_TYPES_FIELD,
    TEMPLATE_IS_ACTIVE_FIELD,
    TEMPLATE_ORDER_FIELD,
} from '../settings/constants';
import type { SurveyTemplate, SurveyType } from '../settings/types';

interface UseFireSurveyByTypeResult {
    templates: SurveyTemplate[];
    isLoading: boolean;
    error: Error | null;
}

/**
 * 특정 surveyType에 해당하는 활성화된 템플릿(질문) 목록을 실시간으로 조회
 * 클라이언트 앱에서 설문 폼을 렌더링할 때 사용
 */
export function useFireSurveyByType(
    surveyType: SurveyType | null
): UseFireSurveyByTypeResult {
    const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!surveyType) {
            setTemplates([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const q = query(
            collection(db, SURVEY_TEMPLATES_COLLECTION),
            where(TEMPLATE_TARGET_TYPES_FIELD, 'array-contains', surveyType),
            where(TEMPLATE_IS_ACTIVE_FIELD, '==', true),
            orderBy(TEMPLATE_ORDER_FIELD, 'asc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as SurveyTemplate[];
                setTemplates(data);
                setIsLoading(false);
            },
            (err) => {
                console.error('useFireSurveyByType error:', err);
                setError(err);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [surveyType]);

    return { templates, isLoading, error };
}
