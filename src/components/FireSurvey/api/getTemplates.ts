import {
    collection,
    query,
    orderBy,
    getDocs,
    onSnapshot,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_TEMPLATES_COLLECTION,
    TEMPLATE_ORDER_FIELD,
    TEMPLATE_CREATED_AT_FIELD,
} from '../settings/constants';
import type { SurveyTemplate } from '../settings/types';

export async function getTemplates(): Promise<SurveyTemplate[]> {
    const collectionRef = collection(db, SURVEY_TEMPLATES_COLLECTION);
    const q = query(
        collectionRef,
        orderBy(TEMPLATE_ORDER_FIELD, 'asc'),
        orderBy(TEMPLATE_CREATED_AT_FIELD, 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as SurveyTemplate);
}

export function subscribeToTemplates(
    callback: (templates: SurveyTemplate[]) => void
): Unsubscribe {
    const collectionRef = collection(db, SURVEY_TEMPLATES_COLLECTION);
    const q = query(
        collectionRef,
        orderBy(TEMPLATE_ORDER_FIELD, 'asc'),
        orderBy(TEMPLATE_CREATED_AT_FIELD, 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const templates = snapshot.docs.map((doc) => doc.data() as SurveyTemplate);
        callback(templates);
    });
}
