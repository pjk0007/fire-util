import { db } from '@/lib/firebase';
import {
    IFirePaymentMethod,
    PAYMENT_DOC_PATH,
} from '@/lib/FirePayment/settings';
import { doc, getDoc } from 'firebase/firestore';

export default async function getPaymentMethod(userId: string) {
    const paymentMethod = await getDoc(doc(db, PAYMENT_DOC_PATH(userId)));

    if (paymentMethod.exists()) {
        return paymentMethod.data() as IFirePaymentMethod;
    } else {
        return undefined;
    }
}
