import { db } from '@/lib/firebase';
import {
    FIRE_PAYMENT_LOCALE,
    PAYMENT_DOC_PATH,
    TOSS_SECRET_KEY,
} from '@/lib/FirePayment/settings';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useCallbackPaymentMethod({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const router = useRouter();
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');

        if (!status) return;

        if (status === 'fail') {
            const code = params.get('code');
            const message = params.get('message');
            console.log({ status, code, message });

            alert(`${FIRE_PAYMENT_LOCALE.ERROR.TITLE}: ${message}`);
        } else if (status === 'success') {
            const customerKey = params.get('customerKey');
            const authKey = params.get('authKey');
            console.log({ status, customerKey, authKey });

            fetch(
                'https://api.tosspayments.com/v1/billing/authorizations/issue',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Basic ${btoa(`${TOSS_SECRET_KEY}:`)}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        authKey,
                        customerKey,
                    }),
                }
            )
                .then(async (res) => {
                    if (res.status === 200) {
                        const data = await res.json();
                        await setDoc(
                            doc(db, PAYMENT_DOC_PATH(customerKey!)),
                            data
                        );
                        alert(FIRE_PAYMENT_LOCALE.SUCCESS_MESSAGE);
                        if (onSuccess) {
                            onSuccess();
                        }
                    } else {
                        const errorData = await res.json();
                        console.error(
                            FIRE_PAYMENT_LOCALE.ERROR_FETCHING_PAYMENT_METHOD,
                            errorData
                        );
                        alert(
                            `${FIRE_PAYMENT_LOCALE.ERROR.TITLE}: ${errorData.message}`
                        );
                    }
                })
                .catch((error) => {
                    console.error(
                        FIRE_PAYMENT_LOCALE.ERROR_FETCHING_PAYMENT_METHOD,
                        error
                    );
                    alert(
                        `${FIRE_PAYMENT_LOCALE.ERROR.TITLE}: ${error.message}`
                    );
                });
        }
        // Remove query parameters from URL
        const { status: _status, code: _code, message: _message, customerKey: _customerKey, authKey: _authKey, ...rest } =
            router.query;
        void _status;
        void _code;
        void _message;
        void _customerKey;
        void _authKey;
        router.replace({
            pathname: router.pathname,
            query: rest,
        });
    }, [router, onSuccess]);
}
