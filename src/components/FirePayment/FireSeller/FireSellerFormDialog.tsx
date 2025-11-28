import FireSellerForm from '@/components/FirePayment/FireSeller/FireSellerForm';
import FireScrollArea from '@/components/FireUI/FireScrollArea';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { FIRE_PAYMENT_LOCALE, IFireSeller } from '@/lib/FirePayment/settings';
import { ReactNode, useState } from 'react';

export default function FireSellerFormDialog({
    seller,
    onSuccess,
    children,
}: {
    seller?: IFireSeller;
    onSuccess?: () => void;
    children?: ReactNode;
}) {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="md:h-fit md:max-h-[calc(100vh-8rem)] h-full overflow-hidden flex flex-col">
                <DialogTitle>
                    {FIRE_PAYMENT_LOCALE.SELLER_FORM.TITLE}
                </DialogTitle>
                <FireScrollArea className="flex-1">
                    <FireSellerForm
                        seller={seller || undefined}
                        onSuccess={() => {
                            onSuccess?.();
                            setOpen(false);
                        }}
                    />
                </FireScrollArea>
            </DialogContent>
        </Dialog>
    );
}
