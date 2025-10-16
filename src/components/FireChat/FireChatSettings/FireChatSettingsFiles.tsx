import {
    FireMessage,
    FireMessageContent,
    FireMessageFile,
    FIRE_CHAT_LOCALE,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_FILE_SIZE_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
} from '@/lib/FireChat/settings';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { Download } from 'lucide-react';
import truncateFilenameMiddle from '@/lib/FireUtil/truncateFilenameMiddle';
import { Button } from '@/components/ui/button';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import { memo } from 'react';
import { formatSizeString } from '@/lib/FireUtil/sizeformat';
import { cn } from '@/lib/utils';

function FireChatSettingsFiles<
    M extends FireMessage<T>,
    T extends FireMessageContent
>({ fileMessages, channelId }: { fileMessages: M[]; channelId: string }) {
    return (
        <div className="flex flex-col gap-4">
            {fileMessages.length > 0 ? (
                <div className="flex flex-col gap-1 overflow-y-auto">
                    {[...fileMessages]
                        .reverse()
                        .slice(0, 8)
                        .map((msg, index) => {
                            const message = msg as FireMessage<FireMessageFile>;

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        `py-2.5 px-3 flex items-center group/file`,
                                        {
                                            'border-t': index !== 0,
                                        }
                                    )}
                                >
                                    <div className="text-sm font-medium text-foreground transition-colors line-clamp-1">
                                        {truncateFilenameMiddle(
                                            message[MESSAGE_CONTENTS_FIELD][0][
                                                MESSAGE_CONTENT_FILE_NAME_FIELD
                                            ] ?? '',
                                            20
                                        )}
                                        <span className="text-sm text-muted-foreground ml-2">
                                            {formatSizeString(
                                                message[
                                                    MESSAGE_CONTENTS_FIELD
                                                ][0][
                                                    MESSAGE_CONTENT_FILE_SIZE_FIELD
                                                ] ?? 0
                                            )}
                                        </span>
                                    </div>
                                    <Button
                                        className={`ml-auto w-8 h-8 md:group-hover/file:visible md:invisible`}
                                        variant="outline"
                                        onClick={async () => {
                                            console.log(
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
                                        <Download className="w-4 h-4 " />
                                    </Button>
                                </div>
                            );
                        })}
                </div>
            ) : (
                <span className="text-sm text-muted-foreground text-center py-6">
                    {FIRE_CHAT_LOCALE.NO_FILES}
                </span>
            )}

            {fileMessages.length > 8 && (
                <Button
                    size="sm"
                    variant="secondary"
                    className="w-full justify-center"
                    onClick={() => {
                        const width = 800;
                        const height = 600;
                        const left =
                            window.screenX + (window.outerWidth - width) / 2;
                        const top =
                            window.screenY + (window.outerHeight - height) / 2;
                        window.open(
                            `/windows/${CHANNEL_COLLECTION}/${channelId}/contents?tab=file`,
                            '_blank',
                            `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
                        );
                    }}
                >
                    {FIRE_CHAT_LOCALE.SIDEBAR.MORE}
                </Button>
            )}
        </div>
    );
}

export default memo(FireChatSettingsFiles);
