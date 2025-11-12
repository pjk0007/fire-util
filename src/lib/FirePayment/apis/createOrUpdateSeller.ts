import { db } from '@/lib/firebase';
import {
    FIRE_PAYMENT_LOCALE,
    IFireSeller,
    SELLER_DOC_PATH,
    TOSS_ENCRYPT_KEY,
    TOSS_SECRET_KEY,
} from '@/lib/FirePayment/settings';
import { decrypt } from '@/lib/FirePayment/utils/decrypt';
import { encrypt } from '@/lib/FirePayment/utils/encrypt';
import { doc, setDoc } from 'firebase/firestore';

export default async function createOrUpdateSeller(
    seller: Omit<IFireSeller, 'id' | 'status'> &
        Partial<Pick<IFireSeller, 'id' | 'status'>>
) {
    const encryptedRequestBody = await encrypt(
        JSON.stringify(seller),
        TOSS_ENCRYPT_KEY
    );
    const url = `https://api.tosspayments.com/v2/sellers${
        seller.id ? `/${seller.id}` : ''
    }`;
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Basic ${btoa(`${TOSS_SECRET_KEY}:`)}`,
            'Content-Type': 'text/plain',
            'TossPayments-api-security-mode': 'ENCRYPTION',
        },
        body: encryptedRequestBody,
    };

    try {
        const response = await fetch(url, options);
        const data = await response.text();
        const decryptedData = await decrypt(data, TOSS_ENCRYPT_KEY);
        
        const parsedData = JSON.parse(decryptedData);

        if (parsedData.error) {
            throw new Error(parsedData.error.message);
        }

        const sellerResult = parsedData.entityBody;

        await setDoc(
            doc(db, SELLER_DOC_PATH(sellerResult.metadata.userId)),
            sellerResult
        );

        // Handle the successful response here
        // For example, you can return the parsed data or perform further actions
        return {
            ok: true,
            message: FIRE_PAYMENT_LOCALE.SUCCESS_SELLER_MESSAGE,
        };
    } catch (error) {
        // Handle errors here
        return {
            ok: false,
            message: error,
        };
    }
}
