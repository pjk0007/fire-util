import FirePaymentMethod from '@/components/FirePayment/FirePaymentMethod';
import FireSeller from '@/components/FirePayment/FireSeller';

export default function profile() {
    return (
        <div className="p-4 w-full flex flex-col gap-4">
            <FirePaymentMethod />
            <FireSeller />
        </div>
    );
}
