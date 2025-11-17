import FireSellerFormDialog from '@/components/FirePayment/FireSeller/FireSellerFormDialog';
import FireSellerStatus from '@/components/FirePayment/FireSeller/FireSellerStatus';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    BANK_LIST,
    FIRE_PAYMENT_LOCALE,
    IFireSeller,
} from '@/lib/FirePayment/settings';
import { ReceiptText } from 'lucide-react';

export default function FireSellerBody({
    isLoading,
    error,
    seller,
    refetch,
}: {
    isLoading: boolean;
    error: Error | null;
    seller?: IFireSeller | null;
    refetch?: () => void;
}) {
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
                {FIRE_PAYMENT_LOCALE.ERROR_FETCHING_SELLER}
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="w-full h-full flex flex-col border border-dashed rounded-[10px] p-6 gap-6 justify-center items-center">
                <div className="border rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-2">
                    <ReceiptText className="w-8 h-8" />
                </div>
                <p className="font-medium leading-normal">
                    {FIRE_PAYMENT_LOCALE.NO_SELLER}
                </p>
                <FireSellerFormDialog
                    seller={seller || undefined}
                    onSuccess={() => refetch?.()}
                >
                    <Button>{FIRE_PAYMENT_LOCALE.ADD_SELLER}</Button>
                </FireSellerFormDialog>
            </div>
        );
    }

    /**
     * type IFireSellerStatus =
    | 'APPROVAL_REQUIRED'
    | 'PARTIALLY_APPROVED'
    | 'KYC_REQUIRED'
    | 'APPROVED';
     */
    const status = seller.status;
    const businessType = seller.businessType;
    const company = seller.company;
    const individual = seller.individual;
    const account = seller.account;

    const displayName =
        businessType !== 'INDIVIDUAL'
            ? company?.name
            : individual?.name || '미등록';

    const displayDetail =
        businessType !== 'INDIVIDUAL'
            ? `${company?.representativeName} · ${company?.businessRegistrationNumber}`
            : `${individual?.email || ''} · ${individual?.phone || ''}`;

    const businessTypeLabel =
        businessType === 'CORPORATION'
            ? '법인사업자'
            : businessType === 'INDIVIDUAL_BUSINESS'
            ? '개인사업자'
            : '개인';

    const bankName = account.bankCode;
    const accountInfo = `${account.accountNumber} (${account.holderName})`;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FireSellerStatus status={status} />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-base">{displayName}</p>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                            {businessTypeLabel}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {displayDetail}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                        {/* 정산 계좌 */}
                        {FIRE_PAYMENT_LOCALE.SELLER_FORM.SETTLEMENT_ACCOUNT}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                            {BANK_LIST.find((bank) => bank.code === bankName)
                                ?.name || bankName}
                        </p>
                        <span className="text-muted-foreground">·</span>
                        <p className="text-sm text-muted-foreground">
                            {accountInfo}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
