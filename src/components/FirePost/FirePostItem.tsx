import { Badge } from '@/components/ui/badge';
import {
    FIRE_POST_LOCALE,
    FirePost,
    POST_CREATED_AT_FIELD,
    POST_IS_PINNED_FIELD,
    POST_IS_SECRET_FIELD,
    POST_TITLE_FIELD,
} from '@/lib/FirePost/settings';
import { LockKeyhole, Pin } from 'lucide-react';

interface FirePostItemProps<U> {
    post: FirePost<U>;
    onClick?: () => void;
}

export default function FirePostItem<U>({
    post,
    onClick,
}: FirePostItemProps<U>) {
    const createdAt = post[POST_CREATED_AT_FIELD].toDate();
    const now = new Date();
    // Check if the post is new (created within the last 24 hours)
    const isNew = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60) < 24;

    return (
        <button
            onClick={onClick}
            className="w-full text-left px-2 py-2 rounded-lg hover:bg-accent transition-colors"
        >
            <div className="flex-1 items-center min-w-0 flex justify-between">
                <div className="flex justify-between items-center gap-2 mb-1">
                    {post?.[POST_IS_PINNED_FIELD] && (
                        <Pin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    )}
                    {post?.[POST_IS_SECRET_FIELD] && (
                        <LockKeyhole className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}

                    {post?.[POST_IS_SECRET_FIELD] ? (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                            {FIRE_POST_LOCALE.POST_SECRET}
                        </span>
                    ) : (
                        <h3 className="flex items-center gap-1 font-semibold text-sm line-clamp-2 break-all">
                            {post?.[POST_TITLE_FIELD] ?? ''}
                            {isNew && (
                                <Badge
                                    variant={'destructive'}
                                    className="w-3.5 h-3.5 p-1 rounded-full flex items-center justify-center shrink-0"
                                    style={{
                                        fontSize: 8,
                                    }}
                                >
                                    N
                                </Badge>
                            )}
                        </h3>
                    )}
                </div>
                <div className="items-center justify-end gap-3 text-xs text-muted-foreground text-wrap w-60 md:flex hidden">
                    {Intl.DateTimeFormat('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).format(
                        post?.[POST_CREATED_AT_FIELD]?.toDate() ?? new Date()
                    )}
                </div>
            </div>
        </button>
    );
}
