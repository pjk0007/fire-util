import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_RESPONSES_COLLECTION,
    RESPONSE_ID_FIELD,
    RESPONSE_TEMPLATE_ID_FIELD,
    RESPONSE_TEMPLATE_TITLE_FIELD,
    RESPONSE_SURVEY_TYPE_FIELD,
    RESPONSE_USER_ID_FIELD,
    RESPONSE_USER_NAME_FIELD,
    RESPONSE_USER_EMAIL_FIELD,
    RESPONSE_ANSWER_FIELD,
    RESPONSE_SUBMITTED_AT_FIELD,
    RESPONSE_CREATED_AT_FIELD,
} from '../settings/constants';
import type { SurveyResponse, SurveyAnswer, SurveyType } from '../settings/types';

interface SubmitResponseParams {
    templateId: string;
    templateTitle: string;
    surveyType: SurveyType;
    userId: string;
    userName?: string;
    userEmail?: string;
    answer: SurveyAnswer;
}

export async function submitResponse({
    templateId,
    templateTitle,
    surveyType,
    userId,
    userName,
    userEmail,
    answer,
}: SubmitResponseParams): Promise<SurveyResponse> {
    const collectionRef = collection(db, SURVEY_RESPONSES_COLLECTION);
    const docRef = doc(collectionRef);
    const id = docRef.id;

    const response = {
        [RESPONSE_ID_FIELD]: id,
        [RESPONSE_TEMPLATE_ID_FIELD]: templateId,
        [RESPONSE_TEMPLATE_TITLE_FIELD]: templateTitle,
        [RESPONSE_SURVEY_TYPE_FIELD]: surveyType,
        [RESPONSE_USER_ID_FIELD]: userId,
        [RESPONSE_USER_NAME_FIELD]: userName || null,
        [RESPONSE_USER_EMAIL_FIELD]: userEmail || null,
        [RESPONSE_ANSWER_FIELD]: answer,
        [RESPONSE_SUBMITTED_AT_FIELD]: serverTimestamp(),
        [RESPONSE_CREATED_AT_FIELD]: serverTimestamp(),
    };

    await setDoc(docRef, response);

    return response as unknown as SurveyResponse;
}
