import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_TEMPLATES_COLLECTION,
    TEMPLATE_ID_FIELD,
    TEMPLATE_TITLE_FIELD,
    TEMPLATE_DESCRIPTION_FIELD,
    TEMPLATE_TYPE_FIELD,
    TEMPLATE_IS_REQUIRED_FIELD,
    TEMPLATE_OPTIONS_FIELD,
    TEMPLATE_RATING_CONFIG_FIELD,
    TEMPLATE_TARGET_TYPES_FIELD,
    TEMPLATE_IS_ACTIVE_FIELD,
    TEMPLATE_ORDER_FIELD,
    TEMPLATE_CREATED_BY_FIELD,
    TEMPLATE_CREATED_AT_FIELD,
    TEMPLATE_UPDATED_AT_FIELD,
    TEMPLATE_ALLOW_OTHER_FIELD,
} from '../settings/constants';
import type { SurveyTemplateFormData, SurveyTemplate, SurveyOption } from '../settings/types';

interface CreateTemplateParams {
    data: SurveyTemplateFormData;
    createdBy: string;
    order?: number;
}

export async function createTemplate({
    data,
    createdBy,
    order = 0,
}: CreateTemplateParams): Promise<SurveyTemplate> {
    const collectionRef = collection(db, SURVEY_TEMPLATES_COLLECTION);
    const docRef = doc(collectionRef);
    const id = docRef.id;

    // 옵션 배열 변환 (string[] -> SurveyOption[])
    const options: SurveyOption[] | null = data.options
        ? data.options.map((label, index) => ({ label, order: index }))
        : null;

    const template = {
        [TEMPLATE_ID_FIELD]: id,
        [TEMPLATE_TITLE_FIELD]: data.title,
        [TEMPLATE_DESCRIPTION_FIELD]: data.description || null,
        [TEMPLATE_TYPE_FIELD]: data.type,
        [TEMPLATE_IS_REQUIRED_FIELD]: data.isRequired,
        [TEMPLATE_OPTIONS_FIELD]: options,
        [TEMPLATE_RATING_CONFIG_FIELD]: data.ratingConfig || null,
        [TEMPLATE_ALLOW_OTHER_FIELD]: data.allowOther || false,
        [TEMPLATE_TARGET_TYPES_FIELD]: data.targetTypes,
        [TEMPLATE_IS_ACTIVE_FIELD]: data.isActive,
        [TEMPLATE_ORDER_FIELD]: order,
        [TEMPLATE_CREATED_BY_FIELD]: createdBy,
        [TEMPLATE_CREATED_AT_FIELD]: serverTimestamp(),
        [TEMPLATE_UPDATED_AT_FIELD]: serverTimestamp(),
    };

    await setDoc(docRef, template);

    return template as unknown as SurveyTemplate;
}
