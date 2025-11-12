import { Badge } from '@/components/ui/badge';
import {
    FIRE_PAYMENT_LOCALE,
    FIRE_SELLER_STATUS_BACKGROUND_COLORS,
    FIRE_SELLER_STATUS_TEXT_COLORS,
    IFireSeller,
} from '@/lib/FirePayment/settings';

export default function FireSellerStatus({
    status,
}: {
    status: IFireSeller['status'];
}) {
    return (
        <Badge
            style={{
                backgroundColor: FIRE_SELLER_STATUS_BACKGROUND_COLORS[status],
                color: FIRE_SELLER_STATUS_TEXT_COLORS[status],
            }}
        >
            {FIRE_PAYMENT_LOCALE.STATUS[status]}
        </Badge>
    );
}
