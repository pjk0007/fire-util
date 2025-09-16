import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SendingFile } from '@/lib/FireChat/hooks/useFireChatSender';
import useFireChatSendingFile from '@/lib/FireChat/hooks/useFireChatSendingFile';
import { LOCALE } from '@/lib/FireChat/settings';
import { formatSizeString } from '@/lib/FireChat/utils/sizeformat';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export default function FireChatSendingFile({
    sendingFile,
}: {
    sendingFile: SendingFile;
}) {
    const file = sendingFile.files?.[0];
    if (!file) return null;

    const { progress, error, isCompleted, cancelUpload } =
        useFireChatSendingFile({
            file,
            channelId: sendingFile.channelId,
        });

    if (isCompleted) return null;

    return (
        <div className={cn('flex w-full gap-4 justify-end')}>
            <div className={cn('flex flex-col max-w-[78%] gap-2 items-end')}>
                <Card className="p-3 max-w-64 md:max-w-80 gap-2">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 text-sm line-clamp-2">
                            {file.name}
                        </div>
                        <Button
                            className="rounded-full flex items-center justify-center bg-muted border"
                            style={{ width: 42, height: 42 }}
                            onClick={cancelUpload}
                            variant={'outline'}
                        >
                            <X />
                        </Button>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {LOCALE.MESSAGE.SIZE}:{' '}
                        {formatSizeString(file.size ?? 0)}
                    </p>
                    {error && (
                        <p className="text-xs text-destructive mt-1">{error}</p>
                    )}
                </Card>
            </div>
        </div>
    );
}
