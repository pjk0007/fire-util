import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SURVEY_TEMPLATES_COLLECTION } from '../settings/constants';

export async function deleteTemplate(templateId: string): Promise<void> {
    const docRef = doc(db, SURVEY_TEMPLATES_COLLECTION, templateId);
    await deleteDoc(docRef);
}
