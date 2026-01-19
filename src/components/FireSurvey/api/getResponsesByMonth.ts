import { db } from '@/lib/firebase';
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { SURVEY_RESPONSES_COLLECTION } from '../settings/constants';
import type { SurveyResponse } from '../settings/types';

export async function getResponsesByMonth(
    year: number,
    month: number
): Promise<SurveyResponse[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const responsesQuery = query(
        collection(db, SURVEY_RESPONSES_COLLECTION),
        where('submittedAt', '>=', Timestamp.fromDate(startDate)),
        where('submittedAt', '<=', Timestamp.fromDate(endDate)),
        orderBy('submittedAt', 'desc')
    );

    const snapshot = await getDocs(responsesQuery);

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as SurveyResponse[];
}
