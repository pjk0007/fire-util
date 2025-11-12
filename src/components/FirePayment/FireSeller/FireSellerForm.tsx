import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { USER_ID_FIELD } from '@/lib/FireAuth/settings';
import createOrUpdateSeller from '@/lib/FirePayment/apis/createOrUpdateSeller';
import {
    BANK_LIST,
    FIRE_PAYMENT_LOCALE,
    IFireSeller,
} from '@/lib/FirePayment/settings';
import { useState } from 'react';
import { toast } from 'sonner';

interface FireSellerFormProps {
    seller?: IFireSeller;
    onSuccess?: () => void;
}

export default function FireSellerForm({
    seller,
    onSuccess,
}: FireSellerFormProps) {
    const { user } = useFireAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [businessType, setBusinessType] = useState<
        'INDIVIDUAL' | 'INDIVIDUAL_BUSINESS' | 'CORPORATION'
    >(seller?.businessType || 'INDIVIDUAL');

    // Individual fields
    const [individualName, setIndividualName] = useState(
        seller?.individual?.name || ''
    );
    const [individualEmail, setIndividualEmail] = useState(
        seller?.individual?.email || ''
    );
    const [individualPhone, setIndividualPhone] = useState(
        seller?.individual?.phone || ''
    );

    // Company fields
    const [companyName, setCompanyName] = useState(seller?.company?.name || '');
    const [representativeName, setRepresentativeName] = useState(
        seller?.company?.representativeName || ''
    );
    const [businessRegistrationNumber, setBusinessRegistrationNumber] =
        useState(seller?.company?.businessRegistrationNumber || '');
    const [companyEmail, setCompanyEmail] = useState(
        seller?.company?.email || ''
    );
    const [companyPhone, setCompanyPhone] = useState(
        seller?.company?.phone || ''
    );

    // Account fields
    const [bankCode, setBankCode] = useState(seller?.account.bankCode || '');
    const [accountNumber, setAccountNumber] = useState(
        seller?.account.accountNumber || ''
    );
    const [holderName, setHolderName] = useState(
        seller?.account.holderName || ''
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error(FIRE_PAYMENT_LOCALE.SELLER_FORM.LOGIN_REQUIRED);
            return;
        }

        if (!bankCode) {
            toast.error(FIRE_PAYMENT_LOCALE.SELLER_FORM.BANK_PLACEHOLDER);
            return;
        }

        setIsSubmitting(true);

        try {
            const sellerData: Omit<IFireSeller, 'id' | 'status'> &
                Partial<Pick<IFireSeller, 'id' | 'status'>> = {
                refSellerId: seller?.refSellerId || `seller_${Date.now()}`,
                businessType,
                individual:
                    businessType === 'INDIVIDUAL'
                        ? {
                              name: individualName,
                              email: individualEmail,
                              phone: individualPhone.replaceAll('-', ''),
                          }
                        : null,
                company:
                    businessType !== 'INDIVIDUAL'
                        ? {
                              name: companyName,
                              representativeName,
                              businessRegistrationNumber:
                                  businessRegistrationNumber.replaceAll(
                                      '-',
                                      ''
                                  ),
                              email: companyEmail,
                              phone: companyPhone.replaceAll('-', ''),
                          }
                        : null,
                account: {
                    bankCode,
                    accountNumber: accountNumber.replaceAll('-', ''),
                    holderName,
                },
                metadata: {
                    userId: user[USER_ID_FIELD],
                },
            };

            if (seller?.id) {
                sellerData.id = seller.id;
            }

            const result = await createOrUpdateSeller(sellerData);

            if (result.ok) {
                toast.success(String(result.message));
                onSuccess?.();
            } else {
                toast.error(String(result.message));
            }
        } catch (error) {
            toast.error(FIRE_PAYMENT_LOCALE.SELLER_FORM.REGISTRATION_ERROR);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Type Selection */}
            <div className="space-y-2">
                <Label htmlFor="businessType">
                    {FIRE_PAYMENT_LOCALE.SELLER_FORM.BUSINESS_TYPE}
                </Label>
                <Select
                    value={businessType}
                    onValueChange={(value) =>
                        setBusinessType(
                            value as
                                | 'INDIVIDUAL'
                                | 'INDIVIDUAL_BUSINESS'
                                | 'CORPORATION'
                        )
                    }
                    disabled={!!seller}
                >
                    <SelectTrigger id="businessType">
                        <SelectValue
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .BUSINESS_TYPE_PLACEHOLDER
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INDIVIDUAL">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.INDIVIDUAL}
                        </SelectItem>
                        <SelectItem value="INDIVIDUAL_BUSINESS">
                            {
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .INDIVIDUAL_BUSINESS
                            }
                        </SelectItem>
                        <SelectItem value="CORPORATION">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.CORPORATION}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Individual Fields */}
            {businessType === 'INDIVIDUAL' && (
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm">
                        {FIRE_PAYMENT_LOCALE.SELLER_FORM.INDIVIDUAL_INFO}
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="individualName">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.NAME}
                        </Label>
                        <Input
                            id="individualName"
                            value={individualName}
                            onChange={(e) => setIndividualName(e.target.value)}
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM.NAME_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="individualEmail">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.EMAIL}
                        </Label>
                        <Input
                            id="individualEmail"
                            type="email"
                            value={individualEmail}
                            onChange={(e) => setIndividualEmail(e.target.value)}
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .EMAIL_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="individualPhone">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.PHONE}
                        </Label>
                        <Input
                            id="individualPhone"
                            type="tel"
                            value={individualPhone}
                            onChange={(e) => setIndividualPhone(e.target.value)}
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .PHONE_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                </div>
            )}

            {/* Company Fields */}
            {businessType !== 'INDIVIDUAL' && (
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold text-sm">
                        {FIRE_PAYMENT_LOCALE.SELLER_FORM.COMPANY_INFO}
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="companyName">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.COMPANY_NAME}
                        </Label>
                        <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .COMPANY_NAME_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="representativeName">
                            {
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .REPRESENTATIVE_NAME
                            }
                        </Label>
                        <Input
                            id="representativeName"
                            value={representativeName}
                            onChange={(e) =>
                                setRepresentativeName(e.target.value)
                            }
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM.NAME_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="businessRegistrationNumber">
                            {
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .BUSINESS_REGISTRATION_NUMBER
                            }
                        </Label>
                        <Input
                            id="businessRegistrationNumber"
                            value={businessRegistrationNumber}
                            onChange={(e) =>
                                setBusinessRegistrationNumber(e.target.value)
                            }
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .BUSINESS_REGISTRATION_NUMBER_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyEmail">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.EMAIL}
                        </Label>
                        <Input
                            id="companyEmail"
                            type="email"
                            value={companyEmail}
                            onChange={(e) => setCompanyEmail(e.target.value)}
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .COMPANY_EMAIL_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyPhone">
                            {FIRE_PAYMENT_LOCALE.SELLER_FORM.PHONE}
                        </Label>
                        <Input
                            id="companyPhone"
                            type="tel"
                            value={companyPhone}
                            onChange={(e) => setCompanyPhone(e.target.value)}
                            placeholder={
                                FIRE_PAYMENT_LOCALE.SELLER_FORM
                                    .COMPANY_PHONE_PLACEHOLDER
                            }
                            required
                        />
                    </div>
                </div>
            )}

            {/* Account Fields */}
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-sm">
                    {FIRE_PAYMENT_LOCALE.SELLER_FORM.SETTLEMENT_ACCOUNT}
                </h3>
                <div className="space-y-2">
                    <Label htmlFor="bankCode">
                        {FIRE_PAYMENT_LOCALE.SELLER_FORM.BANK}
                    </Label>
                    <Select value={bankCode} onValueChange={setBankCode}>
                        <SelectTrigger id="bankCode">
                            <SelectValue
                                placeholder={
                                    FIRE_PAYMENT_LOCALE.SELLER_FORM
                                        .BANK_PLACEHOLDER
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {BANK_LIST.map((bank) => (
                                <SelectItem key={bank.code} value={bank.code}>
                                    {bank.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="accountNumber">
                        {FIRE_PAYMENT_LOCALE.SELLER_FORM.ACCOUNT_NUMBER}
                    </Label>
                    <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder={
                            FIRE_PAYMENT_LOCALE.SELLER_FORM
                                .ACCOUNT_NUMBER_PLACEHOLDER
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="holderName">
                        {FIRE_PAYMENT_LOCALE.SELLER_FORM.HOLDER_NAME}
                    </Label>
                    <Input
                        id="holderName"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        placeholder={
                            FIRE_PAYMENT_LOCALE.SELLER_FORM.NAME_PLACEHOLDER
                        }
                        required
                    />
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                    ? FIRE_PAYMENT_LOCALE.SELLER_FORM.SUBMITTING
                    : seller
                    ? FIRE_PAYMENT_LOCALE.SELLER_FORM.UPDATE
                    : FIRE_PAYMENT_LOCALE.SELLER_FORM.SUBMIT}
            </Button>
        </form>
    );
}
