import { Card } from '@/components/ui/card';
import {
    CHANNEL_COLLECTION,
    FcMessage,
    FcMessageContent,
    FcMessageFile,
    LOCALE,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
} from '@/lib/FireChat/settings';
import { ChevronRight, Download, File } from 'lucide-react';
import truncateFilenameMiddle from '@/lib/FireChat/utils/truncateFilenameMiddle';
import { Button } from '@/components/ui/button';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import { memo } from 'react';

function FireChatChannelRoomSidebarFiles<
    M extends FcMessage<T>,
    T extends FcMessageContent
>({ fileMessages, channelId }: { fileMessages: M[]; channelId: string }) {
    return (
        <Card className="gap-0 p-2">
            <div className="flex flex-col p-2 gap-2">
                <div className="flex gap-2 items-center">
                    <File className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold tracking-tight">
                        {LOCALE.FILE}
                    </h2>
                </div>
                {fileMessages.length > 0 ? (
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                        {[...fileMessages]
                            .reverse()
                            .slice(0, 4)
                            .map((msg, index) => {
                                const message = msg as FcMessage<FcMessageFile>;

                                return (
                                    <Button
                                        size={'sm'}
                                        variant={'ghost'}
                                        key={index}
                                        onClick={async () => {
                                            await downloadFileFromUrl(
                                                message[
                                                    MESSAGE_CONTENTS_FIELD
                                                ][0][
                                                    MESSAGE_CONTENT_URL_FIELD
                                                ] as string,
                                                message[
                                                    MESSAGE_CONTENTS_FIELD
                                                ][0][
                                                    MESSAGE_CONTENT_FILE_NAME_FIELD
                                                ] as string
                                            );
                                        }}
                                    >
                                        <span className="text-sm font-medium text-foreground transition-colors line-clamp-1">
                                            {truncateFilenameMiddle(
                                                message[
                                                    MESSAGE_CONTENTS_FIELD
                                                ][0][
                                                    MESSAGE_CONTENT_FILE_NAME_FIELD
                                                ] ?? '',
                                                20
                                            )}
                                        </span>
                                        <Download className="w-4 h-4 text-primary ml-auto" />
                                    </Button>
                                );
                            })}
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground text-center py-6">
                        {LOCALE.NO_FILES}
                    </span>
                )}
            </div>
            {fileMessages.length > 4 && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                        const width = 800;
                        const height = 600;
                        const left =
                            window.screenX + (window.outerWidth - width) / 2;
                        const top =
                            window.screenY + (window.outerHeight - height) / 2;
                        window.open(
                            `windows/${CHANNEL_COLLECTION}/${channelId}/contents?tab=file`,
                            '_blank',
                            `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
                        );
                    }}
                >
                    {LOCALE.SIDEBAR.MORE}{' '}
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            )}
        </Card>
    );
}

export default memo(FireChatChannelRoomSidebarFiles);
