import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_TEMPLATES_COLLECTION,
    TEMPLATE_TARGET_TYPES_FIELD,
    TEMPLATE_IS_ACTIVE_FIELD,
    TEMPLATE_ORDER_FIELD,
} from '../settings/constants';
import type { SurveyTemplate, SurveyType } from '../settings/types';

/**
 * 특정 surveyType에 해당하는 활성화된 템플릿(질문) 목록 조회
 * 클라이언트 앱에서 설문 폼을 렌더링할 때 사용
 */
export async function getActiveTemplatesByType(
    surveyType: SurveyType
): Promise<SurveyTemplate[]> {
    const q = query(
        collection(db, SURVEY_TEMPLATES_COLLECTION),
        where(TEMPLATE_TARGET_TYPES_FIELD, 'array-contains', surveyType),
        where(TEMPLATE_IS_ACTIVE_FIELD, '==', true),
        orderBy(TEMPLATE_ORDER_FIELD, 'asc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as SurveyTemplate[];
}
