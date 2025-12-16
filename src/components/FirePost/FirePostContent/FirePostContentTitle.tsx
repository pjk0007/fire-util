import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FIRE_POST_LOCALE } from '@/lib/FirePost/settings';
import { cn } from '@/lib/utils';
import { LockKeyhole, Pin } from 'lucide-react';

export default function FirePostContentTitle({
    isPinned,
    setIsPinned,
    isSecret,
    setIsSecret,
    title,
    setTitle,
    editable,
    isNew,
}: {
    isPinned: boolean;
    setIsPinned: (pinned: boolean) => void;
    isSecret: boolean;
    setIsSecret: (secret: boolean) => void;

    title: string;
    setTitle: (title: string) => void;
    editable: boolean;
    isNew: boolean;
}) {
    return (
        <div className="flex items-center gap-2 mb-3">
            {editable ? (
                <div className="flex">
                    <Pin
                        className={cn('cursor-pointer', {
                            'text-primary': isPinned,
                            'text-muted-foreground': !isPinned,
                        })}
                        onClick={() => setIsPinned(!isPinned)}
                    />
                    <LockKeyhole
                        className={cn('ml-2 cursor-pointer', {
                            'text-muted-foreground': !isSecret,
                            'text-red-500': isSecret,
                        })}
                        onClick={() => setIsSecret(!isSecret)}
                    />
                </div>
            ) : (
                <div className="flex">
                    {isPinned && <Pin className={'text-primary'} />}
                    {isSecret && <LockKeyhole className={'text-primary'} />}
                </div>
            )}
            {editable ? (
                <div className="w-full">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={FIRE_POST_LOCALE.TITLE_PLACEHOLDER}
                        className="text-2xl font-bold focus:outline-none focus:ring-0 bg-transparent w-full"
                    />
                </div>
            ) : (
                <h1 className="flex items-center gap-1 text-2xl font-bold flex-1">
                    {title ? title : <Skeleton className="h-8 w-80" />}
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
                </h1>
            )}
        </div>
    );
}
