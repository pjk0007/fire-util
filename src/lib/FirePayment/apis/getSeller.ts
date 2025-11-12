import { db } from '@/lib/firebase';
import { IFireSeller, SELLER_DOC_PATH } from '@/lib/FirePayment/settings';
import { doc, getDoc } from 'firebase/firestore';

export default async function getSeller(userId: string) {
    const seller = await getDoc(doc(db, SELLER_DOC_PATH(userId)));

    if (seller.exists()) {
        return seller.data() as IFireSeller;
    } else {
        return undefined;
    }
}
