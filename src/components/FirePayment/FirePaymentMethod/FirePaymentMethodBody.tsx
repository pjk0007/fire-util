import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import requestBilling from '@/lib/FirePayment/apis/requestBilling';
import usePaymentMethod from '@/lib/FirePayment/hooks/usePaymentMethod';
import { FIRE_PAYMENT_LOCALE } from '@/lib/FirePayment/settings';
import { ReceiptText } from 'lucide-react';

export default function FirePaymentMethodBody() {
    const { user } = useFireAuth();

    const { error, isLoading, paymentMethod } = usePaymentMethod(
        user?.[USER_ID_FIELD]
    );

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-sm text-destructive p-4 border border-destructive/20 rounded-lg">
                {FIRE_PAYMENT_LOCALE.ERROR_FETCHING_PAYMENT_METHOD}
            </div>
        );
    }

    if (!paymentMethod || !paymentMethod.card) {
        return (
            <div className="w-full h-full flex flex-col border border-dashed rounded-[10px] p-6 gap-6 justify-center items-center">
                <div className="border rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-2">
                    <ReceiptText className="w-8 h-8" />
                </div>
                <p className="font-medium leading-normal">
                    {FIRE_PAYMENT_LOCALE.NO_PAYMENT_METHOD}
                </p>
                <Button
                    onClick={() => {
                        if (!user) return;
                        requestBilling(user[USER_ID_FIELD]);
                    }}
                >
                    {FIRE_PAYMENT_LOCALE.ADD_PAYMENT_METHOD}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex items-center gap-3">
                <div className="text-xs font-bold flex items-center justify-center">
                    {paymentMethod.cardCompany}
                </div>
                <div>
                    <p className="font-medium">
                        {paymentMethod.card?.cardType ?? ''}
                        {paymentMethod.method} ({paymentMethod.card.ownerType})
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {paymentMethod.card.number}
                    </p>
                </div>
            </div>
        </div>
    );
}
