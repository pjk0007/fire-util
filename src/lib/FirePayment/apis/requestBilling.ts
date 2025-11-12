import {
    FIRE_PAYMENT_LOCALE,
    TOSS_CLIENT_KEY,
} from '@/lib/FirePayment/settings';
import { loadTossPayments } from '@tosspayments/payment-sdk';

export default async function requestBilling(userId: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('status', 'success');
    const successRedirectUrl = url.toString();
    
    url.searchParams.set('status', 'fail');
    const failRedirectUrl = url.toString();
    
    const tp = await loadTossPayments(TOSS_CLIENT_KEY);
    try {
        await tp.requestBillingAuth('카드', {
            customerKey: userId,
            successUrl: successRedirectUrl,
            failUrl: failRedirectUrl,
        });
    } catch (error: any) {
        console.log(error);
        
        if (error.code === 'USER_CANCEL') {
            // 결제 고객이 결제창을 닫았을 때 에러 처리
            alert(FIRE_PAYMENT_LOCALE.ERROR.USER_CANCEL);
        } else if (error.code === 'INVALID_CARD_COMPANY') {
            // 유효하지 않은 카드 코드에 대한 에러 처리
            alert(FIRE_PAYMENT_LOCALE.ERROR.INVALID_CARD_COMPANY);
        }
    }
}
