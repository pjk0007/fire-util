import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_TEMPLATES_COLLECTION,
    TEMPLATE_TITLE_FIELD,
    TEMPLATE_DESCRIPTION_FIELD,
    TEMPLATE_TYPE_FIELD,
    TEMPLATE_IS_REQUIRED_FIELD,
    TEMPLATE_OPTIONS_FIELD,
    TEMPLATE_RATING_CONFIG_FIELD,
    TEMPLATE_TARGET_TYPES_FIELD,
    TEMPLATE_IS_ACTIVE_FIELD,
    TEMPLATE_ORDER_FIELD,
    TEMPLATE_UPDATED_AT_FIELD,
    TEMPLATE_ALLOW_OTHER_FIELD,
} from '../settings/constants';
import type { SurveyTemplateFormData, SurveyOption } from '../settings/types';

interface UpdateTemplateParams {
    templateId: string;
    data: Partial<SurveyTemplateFormData> & { order?: number };
}

export async function updateTemplate({
    templateId,
    data,
}: UpdateTemplateParams): Promise<void> {
    const docRef = doc(db, SURVEY_TEMPLATES_COLLECTION, templateId);

    const updateData: Record<string, unknown> = {
        [TEMPLATE_UPDATED_AT_FIELD]: serverTimestamp(),
    };

    if (data.title !== undefined) {
        updateData[TEMPLATE_TITLE_FIELD] = data.title;
    }
    if (data.description !== undefined) {
        updateData[TEMPLATE_DESCRIPTION_FIELD] = data.description || null;
    }
    if (data.type !== undefined) {
        updateData[TEMPLATE_TYPE_FIELD] = data.type;
    }
    if (data.isRequired !== undefined) {
        updateData[TEMPLATE_IS_REQUIRED_FIELD] = data.isRequired;
    }
    if (data.options !== undefined) {
        const options: SurveyOption[] | null = data.options
            ? data.options.map((label, index) => ({ label, order: index }))
            : null;
        updateData[TEMPLATE_OPTIONS_FIELD] = options;
    }
    if (data.ratingConfig !== undefined) {
        updateData[TEMPLATE_RATING_CONFIG_FIELD] = data.ratingConfig || null;
    }
    if (data.targetTypes !== undefined) {
        updateData[TEMPLATE_TARGET_TYPES_FIELD] = data.targetTypes;
    }
    if (data.isActive !== undefined) {
        updateData[TEMPLATE_IS_ACTIVE_FIELD] = data.isActive;
    }
    if (data.order !== undefined) {
        updateData[TEMPLATE_ORDER_FIELD] = data.order;
    }
    if (data.allowOther !== undefined) {
        updateData[TEMPLATE_ALLOW_OTHER_FIELD] = data.allowOther;
    }

    await updateDoc(docRef, updateData);
}
