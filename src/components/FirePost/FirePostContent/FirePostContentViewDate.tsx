import { FIRE_POST_LOCALE } from '@/lib/FirePost/settings';
import { Timestamp } from 'firebase/firestore';
import { Eye } from 'lucide-react';

export default function FirePostContentViewDate({
    viewCount,
    createdAt,
}: {
    viewCount?: number;
    createdAt?: Timestamp;
}) {
    return (
        <div className="flex items-center gap-4 text-sm text-muted-foreground md:ml-auto">
            <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>
                    {FIRE_POST_LOCALE.VIEW} {viewCount ?? 0}
                </span>
            </div>
            <span>
                {/* {format(createdAt, 'yyyy.MM.dd HH:mm', { locale: ko })} */}
                {createdAt &&
                    Intl.DateTimeFormat('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(createdAt.toDate())}
            </span>
        </div>
    );
}
