import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    onSnapshot,
    type Unsubscribe,
    type QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_RESPONSES_COLLECTION,
    RESPONSE_TEMPLATE_ID_FIELD,
    RESPONSE_SURVEY_TYPE_FIELD,
    RESPONSE_SUBMITTED_AT_FIELD,
} from '../settings/constants';
import type { SurveyResponse, ResponseFilters } from '../settings/types';

function buildQueryConstraints(filters?: ResponseFilters): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    if (filters?.templateId) {
        constraints.push(where(RESPONSE_TEMPLATE_ID_FIELD, '==', filters.templateId));
    }
    if (filters?.surveyType) {
        constraints.push(where(RESPONSE_SURVEY_TYPE_FIELD, '==', filters.surveyType));
    }
    if (filters?.startDate) {
        constraints.push(where(RESPONSE_SUBMITTED_AT_FIELD, '>=', filters.startDate));
    }
    if (filters?.endDate) {
        constraints.push(where(RESPONSE_SUBMITTED_AT_FIELD, '<=', filters.endDate));
    }

    constraints.push(orderBy(RESPONSE_SUBMITTED_AT_FIELD, 'desc'));

    return constraints;
}

export async function getResponses(
    filters?: ResponseFilters
): Promise<SurveyResponse[]> {
    const collectionRef = collection(db, SURVEY_RESPONSES_COLLECTION);
    const constraints = buildQueryConstraints(filters);
    const q = query(collectionRef, ...constraints);

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as SurveyResponse);
}

export function subscribeToResponses(
    callback: (responses: SurveyResponse[]) => void,
    filters?: ResponseFilters
): Unsubscribe {
    const collectionRef = collection(db, SURVEY_RESPONSES_COLLECTION);
    const constraints = buildQueryConstraints(filters);
    const q = query(collectionRef, ...constraints);

    return onSnapshot(q, (snapshot) => {
        const responses = snapshot.docs.map((doc) => doc.data() as SurveyResponse);
        callback(responses);
    });
}

export async function getResponsesByTemplate(
    templateId: string
): Promise<SurveyResponse[]> {
    return getResponses({ templateId });
}
