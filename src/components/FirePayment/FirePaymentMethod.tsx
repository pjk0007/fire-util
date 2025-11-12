import FirePaymentMethodBody from '@/components/FirePayment/FirePaymentMethod/FirePaymentMethodBody';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import requestBilling from '@/lib/FirePayment/apis/requestBilling';
import useCallbackPaymentMethod from '@/lib/FirePayment/hooks/useCallbackPaymentMethod';
import usePaymentMethod from '@/lib/FirePayment/hooks/usePaymentMethod';
import { FIRE_PAYMENT_LOCALE } from '@/lib/FirePayment/settings';
import { RefreshCw } from 'lucide-react';

export default function FirePaymentMethod() {
    const { user } = useFireAuth();
    const { error, isLoading, paymentMethod, refetch } = usePaymentMethod(
        user?.[USER_ID_FIELD]
    );
    useCallbackPaymentMethod({
        onSuccess: () => {
            refetch();
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <p className="w-full text-foreground text-xl font-semibold leading-7">
                        {FIRE_PAYMENT_LOCALE.PAYMENT_METHOD_TITLE}
                    </p>
                    <Button
                        variant={'outline'}
                        onClick={() => {
                            if (!user) return;
                            requestBilling(user[USER_ID_FIELD]);
                        }}
                    >
                        <RefreshCw className="w-4 h-4" />
                        {FIRE_PAYMENT_LOCALE.CHANGE_PAYMENT_METHOD}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FirePaymentMethodBody
                    isLoading={isLoading}
                    error={error}
                    paymentMethod={paymentMethod}
                />
            </CardContent>
        </Card>
    );
}
