import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Card } from '@/components/ui/card';
import {
    FcMessage,
    FcMessageFile,
    LOCALE,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
} from '@/lib/FireChat/settings';
import { ChevronRight, Download, File } from 'lucide-react';
import truncateFilenameMiddle from '@/lib/FireChat/utils/truncateFilenameMiddle';
import { Button } from '@/components/ui/button';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';

export default function FireChatChannelSidebarFiles() {
    const { messages } = useFireChat();
    const fileMessages = messages
        .filter(
            (msg) =>
                msg[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_FILE &&
                msg[MESSAGE_CONTENTS_FIELD] &&
                msg[MESSAGE_CONTENTS_FIELD].length > 0
        )
        .reverse();

    return (
        <Card className="gap-0 p-2">
            <div className="flex flex-col p-2 gap-2">
                <div className="flex gap-2 items-center">
                    <File className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold tracking-tight">
                        {LOCALE.SIDEBAR.FILE}
                    </h2>
                </div>
                {fileMessages.length > 0 ? (
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                        {fileMessages.slice(0, 4).map((msg, index) => {
                            const message = msg as FcMessage<FcMessageFile>;

                            return (
                                <Button
                                    size={'sm'}
                                    variant={'ghost'}
                                    key={index}
                                    onClick={async () => {
                                        await downloadFileFromUrl(
                                            message[MESSAGE_CONTENTS_FIELD][0][
                                                MESSAGE_CONTENT_URL_FIELD
                                            ] as string,
                                            message[MESSAGE_CONTENTS_FIELD][0][
                                                MESSAGE_CONTENT_FILE_NAME_FIELD
                                            ] as string
                                        );
                                    }}
                                >
                                    <span className="text-sm font-medium text-foreground transition-colors line-clamp-1">
                                        {truncateFilenameMiddle(
                                            message[MESSAGE_CONTENTS_FIELD][0][
                                                MESSAGE_CONTENT_FILE_NAME_FIELD
                                            ] ?? '',
                                            30
                                        )}
                                    </span>
                                    <Download className="w-4 h-4 text-primary ml-auto" />
                                </Button>
                            );
                        })}
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground text-center py-6">
                        {LOCALE.SIDEBAR.NO_FILES}
                    </span>
                )}
            </div>
            {fileMessages.length > 4 && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-center"
                >
                    더보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            )}
        </Card>
    );
}
