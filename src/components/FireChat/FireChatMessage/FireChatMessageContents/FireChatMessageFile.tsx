import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FcMessage, FcMessageFile } from '@/lib/FireChat/settings';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import { formatSizeString } from '@/lib/FireChat/utils/sizeformat';
import { ArrowDownToLine } from 'lucide-react';
import { useState } from 'react';

export default function FireChatMessageFile<
    M extends FcMessage<FcMessageFile>
>({ message }: { message: M }) {
    const [isDownloading, setIsDownloading] = useState(false);

    return (
        <Card className="p-3 max-w-64 md:max-w-80 gap-2">
            <div className="flex gap-4">
                <div className="flex-1 text-sm line-clamp-2">
                    {message.contents?.[0]?.name}
                </div>
                <Button
                    variant="outline"
                    className="rounded-full"
                    style={{padding:8, width:42, height:42}}
                    onClick={async () => {
                        setIsDownloading(true);
                        await downloadFileFromUrl(
                            message.contents?.[0]?.url || '',
                            message.contents?.[0]?.name || 'file'
                        );
                        setIsDownloading(false);
                    }}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <div className="w-4 h-4 border-2 border-foreground/40 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ArrowDownToLine className='w-6 h-6' />
                    )}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                {formatSizeString(message.contents?.[0]?.size ?? 0)}
            </p>
        </Card>
    );
}
