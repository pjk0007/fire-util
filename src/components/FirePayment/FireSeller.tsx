import FireSellerBody from '@/components/FirePayment/FireSeller/FireSellerBody';
import FireSellerFormDialog from '@/components/FirePayment/FireSeller/FireSellerFormDialog';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import useSeller from '@/lib/FirePayment/hooks/useSeller';
import { FIRE_PAYMENT_LOCALE } from '@/lib/FirePayment/settings';
import { RefreshCw } from 'lucide-react';

export default function FireSeller() {
    const { user } = useFireAuth();
    const { error, isLoading, seller, refetch } = useSeller(
        user?.[USER_ID_FIELD]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between">
                    <p className="w-full text-foreground text-xl font-semibold leading-7">
                        {FIRE_PAYMENT_LOCALE.SELLER_TITLE}
                    </p>
                    <FireSellerFormDialog
                        seller={seller || undefined}
                        onSuccess={() => refetch()}
                    >
                        <Button variant={'outline'}>
                            <RefreshCw className="w-4 h-4" />{' '}
                            {FIRE_PAYMENT_LOCALE.CHANGE_SELLER}
                        </Button>
                    </FireSellerFormDialog>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FireSellerBody
                    isLoading={isLoading}
                    error={error}
                    seller={seller}
                    refetch={refetch}
                />
            </CardContent>
        </Card>
    );
}
