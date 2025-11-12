import FirePaymentMethod from '@/components/FirePayment/FirePaymentMethod';
import FireSeller from '@/components/FirePayment/FireSeller';
import useCallbackPaymentMethod from '@/lib/FirePayment/hooks/useCallbackPaymentMethod';

export default function profile() {
    useCallbackPaymentMethod();

    return (
        <div className="p-4 w-full flex flex-col gap-4">
            <FirePaymentMethod />
            <FireSeller />
        </div>
    );
}
