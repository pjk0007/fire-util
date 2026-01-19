import { doc, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    SURVEY_TEMPLATES_COLLECTION,
    TEMPLATE_ORDER_FIELD,
    TEMPLATE_UPDATED_AT_FIELD,
} from '../settings/constants';

interface OrderUpdate {
    id: string;
    order: number;
}

export async function updateTemplateOrder(updates: OrderUpdate[]): Promise<void> {
    const batch = writeBatch(db);
    const now = Timestamp.now();

    for (const update of updates) {
        const docRef = doc(db, SURVEY_TEMPLATES_COLLECTION, update.id);
        batch.update(docRef, {
            [TEMPLATE_ORDER_FIELD]: update.order,
            [TEMPLATE_UPDATED_AT_FIELD]: now,
        });
    }

    await batch.commit();
}
