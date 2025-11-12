import getPaymentMethod from '@/lib/FirePayment/apis/getPaymentMethod';
import {
    FIRE_PAYMENT_LOCALE,
    IFirePaymentMethod,
} from '@/lib/FirePayment/settings';
import { useQuery } from '@tanstack/react-query';

export default function usePaymentMethod(userId?: string) {
    if (!userId) {
        return {
            paymentMethod: null,
            isLoading: false,
            error: null,
        };
    }

    const {
        data: paymentMethod,
        isLoading,
        error,
    } = useQuery<IFirePaymentMethod | null>({
        queryKey: ['paymentMethod', userId],
        queryFn: async () => {
            if (!userId) return null;
            try {
                const payment = await getPaymentMethod(userId);
                return payment || null;
            } catch (error) {
                console.error(
                    FIRE_PAYMENT_LOCALE.ERROR_FETCHING_PAYMENT_METHOD,
                    error
                );
                return null;
            }
        },
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });

    return { paymentMethod, isLoading, error };
}
