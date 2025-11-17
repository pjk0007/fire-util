import Tiptap from '@/components/Tiptap/Tiptap';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FireUser } from '@/lib/FireAuth/settings';
import useFirePost from '@/lib/FirePost/hooks/useFirePost';
import {
    FIRE_POST_LOCALE,
    POST_CONTENT_FIELD,
    POST_CREATED_AT_FIELD,
    POST_ID_FIELD,
    POST_IS_PINNED_FIELD,
    POST_IS_SECRET_FIELD,
    POST_TITLE_FIELD,
    POST_VIEWS_FIELD,
} from '@/lib/FirePost/settings';
import { ChevronLeft, Eye, LockKeyhole, Pin } from 'lucide-react';

export default function FirePostContent<U extends FireUser>({
    postId,
}: {
    postId: string;
}) {
    const { post } = useFirePost<U>(postId);
    const createdAt = post?.[POST_CREATED_AT_FIELD]?.toDate() ?? new Date();

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="border-b p-6">
                <div className="flex items-center gap-2 mb-3">
                    <Button
                        variant={'ghost'}
                        size={'icon-sm'}
                        onClick={() => window.history.back()}
                        className='p-0'
                    >
                        <ChevronLeft />
                    </Button>
                    {post?.[POST_IS_PINNED_FIELD] && (
                        <Pin className="w-5 h-5 text-primary shrink-0 mt-1" />
                    )}
                    {post?.[POST_IS_SECRET_FIELD] && (
                        <LockKeyhole className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <h1 className="text-2xl font-bold flex-1">
                        {post?.[POST_TITLE_FIELD]}
                    </h1>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>
                            {FIRE_POST_LOCALE.VIEW}{' '}
                            {post?.[POST_VIEWS_FIELD] ?? 0}
                        </span>
                    </div>
                    <span>
                        {/* {format(createdAt, 'yyyy.MM.dd HH:mm', { locale: ko })} */}
                        {Intl.DateTimeFormat('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(createdAt)}
                    </span>
                </div>
            </div>

            {/* Content */}
            {/* <ScrollArea className="flex-1">
                <div className="p-6">
                    {post?.[POST_IS_SECRET_FIELD] ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            {FIRE_POST_LOCALE.POST_SECRET}
                        </div>
                    ) : (
                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: post?.[POST_CONTENT_FIELD] ?? '',
                            }}
                        />
                    )}
                </div>
            </ScrollArea> */}
            {post && (
                <Tiptap
                    defaultContent={post?.[POST_CONTENT_FIELD] ?? ''}
                    id={post[POST_ID_FIELD]}
                    editable={true}
                />
            )}
        </div>
    );
}
