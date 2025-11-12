import getSeller from '@/lib/FirePayment/apis/getSeller';
import {
    FIRE_PAYMENT_LOCALE,
    IFireSeller,
} from '@/lib/FirePayment/settings';
import { useQuery } from '@tanstack/react-query';

export default function useSeller(userId?: string) {
    const {
        data: seller,
        isLoading,
        error,
        refetch,
    } = useQuery<IFireSeller | null>({
        queryKey: ['seller', userId],
        queryFn: async () => {
            if (!userId) return null;
            try {
                const seller = await getSeller(userId);
                return seller || null;
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

    return { seller, isLoading, error, refetch };
}
