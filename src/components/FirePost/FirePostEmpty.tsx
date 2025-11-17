import {
    FIRE_POST_LOCALE,
    POST_TYPE_FAQ,
    POST_TYPE_NOTICE,
    PostType,
} from '@/lib/FirePost/settings';
import { Bell, MessageCircleQuestion, HelpCircle } from 'lucide-react';

interface FirePostEmptyProps {
    type: PostType;
}

export default function FirePostEmpty({ type }: FirePostEmptyProps) {
    const getIcon = () => {
        switch (type) {
            case POST_TYPE_NOTICE:
                return <Bell className="w-6 h-6 text-muted-foreground" />;
            case POST_TYPE_FAQ:
                return <HelpCircle className="w-6 h-6 text-muted-foreground" />;
        }
    };

    const getMessage = () => {
        switch (type) {
            case POST_TYPE_NOTICE:
                return FIRE_POST_LOCALE.EMPTY_NOTICE;
            case POST_TYPE_FAQ:
                return FIRE_POST_LOCALE.EMPTY_FAQ;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">{getIcon()}</div>
            <p className="text-muted-foreground">{getMessage()}</p>
        </div>
    );
}
