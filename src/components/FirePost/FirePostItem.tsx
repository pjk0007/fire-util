import { FireUser } from '@/lib/FireAuth/settings';
import {
    FIRE_POST_LOCALE,
    FirePost,
    POST_CATEGORIES_FIELD,
    POST_CREATED_AT_FIELD,
    POST_IS_PINNED_FIELD,
    POST_IS_SECRET_FIELD,
    POST_TITLE_FIELD,
    POST_VIEWS_FIELD,
} from '@/lib/FirePost/settings';
import { Pin } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface FirePostItemProps<U extends FireUser> {
    post: FirePost<U>;
    onClick?: () => void;
}

export default function FirePostItem<U extends FireUser>({
    post,
    onClick,
}: FirePostItemProps<U>) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left p-4 border rounded-lg hover:bg-accent transition-colors"
        >
            <div className="flex items-start gap-3">
                {post?.[POST_IS_PINNED_FIELD] && (
                    <Pin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">
                            {post?.[POST_TITLE_FIELD] ?? ''}
                        </h3>
                        {post?.[POST_IS_SECRET_FIELD] && (
                            <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                                {FIRE_POST_LOCALE.POST_SECRET}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                            {format(
                                post?.[POST_CREATED_AT_FIELD]?.toDate() ??
                                    new Date(),
                                'yyyy.MM.dd',
                                {
                                    locale: ko,
                                }
                            )}
                        </span>
                        <span>
                            {FIRE_POST_LOCALE.VIEW}{' '}
                            {post?.[POST_VIEWS_FIELD] ?? 0}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}
