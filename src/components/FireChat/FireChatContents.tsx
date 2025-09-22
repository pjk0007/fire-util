import { useFireChatChannel } from '@/components/provider/FireChatChannelProvider';
import FireChatImageDialog from '@/components/FireChat/FireChatDialog/FireChatImageDialog';
import { useAuth } from '@/components/provider/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CHANNEL_ID_FIELD,
    CHANNEL_NAME_FIELD,
    FcMessage,
    FcMessageFile,
    FcMessageImage,
    LOCALE,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_FILE_SIZE_FIELD,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
} from '@/lib/FireChat/settings';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import { formatSizeString } from '@/lib/FireChat/utils/sizeformat';
import { formatDateString } from '@/lib/FireChat/utils/timeformat';
import truncateFilenameMiddle from '@/lib/FireChat/utils/truncateFilenameMiddle';
import { Download, ImagesIcon } from 'lucide-react';
import Image from 'next/image';
import useListMessages from '@/lib/FireChat/hooks/useListMessages';
import useListFiles from '@/lib/FireChat/hooks/useListFiles';

export default function FireChatContents({
    defatultTab = 'image',
}: {
    defatultTab?: 'image' | 'file';
}) {
    const { channel } = useFireChatChannel();
    const { imageMessages, fileMessages } = useListFiles({
        channelId: channel?.[CHANNEL_ID_FIELD],
    });
    const reversedImageMessages = [...imageMessages].reverse();
    const reversedFileMessages = [...fileMessages].reverse();
    return (
        <div className="w-full h-full flex flex-col">
            <div className="py-4 px-8 border-b flex gap-4 items-center">
                <p className="text-lg font-bold ">채팅방 서랍</p>
                <div className="text-sm text-muted-foreground">
                    {channel?.[CHANNEL_NAME_FIELD]}
                </div>
            </div>
            <div className="py-4 pl-12">
                <Tabs className="w-full" defaultValue={defatultTab}>
                    <TabsList className="h-8 w-full border-b justify-start rounded-none bg-transparent p-0">
                        <div className="w-40 flex gap-2 h-8">
                            <TabsTrigger value="image" asChild>
                                <div
                                    style={{
                                        height: '32px',
                                        margin: 0,
                                        borderRadius: 0,
                                        borderLeft: 'none',
                                        borderTop: 'none',
                                        borderRight: 'none',
                                        boxShadow: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                    className="data-[state=active]:border-black data-[state=inactive]:border-transparent border-b"
                                >
                                    사진
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="file" asChild>
                                <div
                                    style={{
                                        height: '32px',
                                        margin: 0,
                                        borderRadius: 0,
                                        borderLeft: 'none',
                                        borderTop: 'none',
                                        borderRight: 'none',
                                        boxShadow: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                    className="data-[state=active]:border-black data-[state=inactive]:border-transparent border-b"
                                >
                                    파일
                                </div>
                            </TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent value="image">
                        <ScrollArea className="h-[calc(100vh-120px)] w-full">
                            <div className="h-full flex flex-wrap">
                                {reversedImageMessages.map((msg, index) => {
                                    const message =
                                        msg as FcMessage<FcMessageImage>;
                                    const content = msg?.[
                                        MESSAGE_CONTENTS_FIELD
                                    ]?.[0] as FcMessageImage;
                                    const before =
                                        index > 0
                                            ? reversedImageMessages[index - 1]
                                            : null;

                                    const beforeTime =
                                        before?.[MESSAGE_CREATED_AT_FIELD];
                                    const currentTime =
                                        msg?.[MESSAGE_CREATED_AT_FIELD];
                                    const isNewMonth =
                                        currentTime &&
                                        `${beforeTime
                                            ?.toDate()
                                            .getFullYear()}-${beforeTime
                                            ?.toDate()
                                            .getMonth()}` !==
                                            `${currentTime
                                                .toDate()
                                                .getFullYear()}-${currentTime
                                                .toDate()
                                                .getMonth()}`;

                                    return (
                                        <>
                                            {isNewMonth && (
                                                <div className="text-sm text-muted-foreground mt-4 ml-2 w-full">
                                                    {currentTime
                                                        .toDate()
                                                        .toLocaleDateString(
                                                            undefined,
                                                            {
                                                                year: 'numeric',
                                                                month: 'long',
                                                            }
                                                        )}
                                                </div>
                                            )}
                                            <FireChatImageDialog
                                                defaultIdx={0}
                                                dialogTitle={`${formatDateString(
                                                    msg[
                                                        MESSAGE_CREATED_AT_FIELD
                                                    ]
                                                )}`}
                                                images={message[
                                                    MESSAGE_CONTENTS_FIELD
                                                ].map(
                                                    (img) =>
                                                        img[
                                                            MESSAGE_CONTENT_URL_FIELD
                                                        ] as string
                                                )}
                                                key={index}
                                            >
                                                <div className="relative">
                                                    <Image
                                                        src={
                                                            content[
                                                                MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD
                                                            ] ||
                                                            content[
                                                                MESSAGE_CONTENT_URL_FIELD
                                                            ]
                                                        }
                                                        alt={
                                                            content[
                                                                MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD
                                                            ] ||
                                                            content[
                                                                MESSAGE_CONTENT_URL_FIELD
                                                            ]
                                                        }
                                                        width={128}
                                                        height={128}
                                                        priority={index < 4}
                                                        className="w-32 h-32 object-cover m-2 rounded border hover:border-muted-foreground/40 border-transparent"
                                                    />
                                                    {message[
                                                        MESSAGE_CONTENTS_FIELD
                                                    ].length > 1 && (
                                                        <ImagesIcon
                                                            className="absolute right-4 bottom-4 bg-foreground/40 text-white p-0.5 rounded-xs"
                                                            size={16}
                                                        />
                                                    )}
                                                </div>
                                            </FireChatImageDialog>
                                        </>
                                    );
                                })}
                                {reversedFileMessages.length === 0 && (
                                    <div className="text-sm text-muted-foreground p-4">
                                        {LOCALE.NO_IMAGES}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="file">
                        <ScrollArea className="h-[calc(100vh-120px)] w-full">
                            <div className="h-full flex flex-wrap">
                                {reversedFileMessages.map((msg, index) => {
                                    const content = msg?.[
                                        MESSAGE_CONTENTS_FIELD
                                    ]?.[0] as FcMessageFile;
                                    const before =
                                        index > 0
                                            ? reversedFileMessages[index - 1]
                                            : null;

                                    const beforeTime =
                                        before?.[MESSAGE_CREATED_AT_FIELD];
                                    const currentTime =
                                        msg?.[MESSAGE_CREATED_AT_FIELD];
                                    const isNewMonth =
                                        currentTime &&
                                        `${beforeTime
                                            ?.toDate()
                                            .getFullYear()}-${beforeTime
                                            ?.toDate()
                                            .getMonth()}` !==
                                            `${currentTime
                                                .toDate()
                                                .getFullYear()}-${currentTime
                                                .toDate()
                                                .getMonth()}`;

                                    return (
                                        <>
                                            {isNewMonth && (
                                                <div className="text-sm text-muted-foreground mt-4 ml-2 w-full">
                                                    {currentTime
                                                        .toDate()
                                                        .toLocaleDateString(
                                                            undefined,
                                                            {
                                                                year: 'numeric',
                                                                month: 'long',
                                                            }
                                                        )}
                                                </div>
                                            )}
                                            <FileCard
                                                key={index}
                                                fileUrl={
                                                    content[
                                                        MESSAGE_CONTENT_URL_FIELD
                                                    ]
                                                }
                                                fileName={
                                                    content[
                                                        MESSAGE_CONTENT_FILE_NAME_FIELD
                                                    ]
                                                }
                                                fileSize={
                                                    content[
                                                        MESSAGE_CONTENT_FILE_SIZE_FIELD
                                                    ]
                                                }
                                            />
                                        </>
                                    );
                                })}
                                {imageMessages.length === 0 && (
                                    <div className="text-sm text-muted-foreground p-4">
                                        {LOCALE.NO_FILES}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function FileCard({
    fileUrl,
    fileName,
    fileSize,
}: {
    fileUrl: string;
    fileName?: string;
    fileSize?: number;
}) {
    const fileExt =
        fileName?.split('.').pop()?.toLowerCase().slice(0, 4) || 'FILE';
    return (
        <Card className="m-2 p-4 w-52 h-40 rounded-sm gap-2 hover:shadow-md transition-transform flex flex-col">
            <div className="px-2 py-1 w-fit bg-muted text-muted-foreground flex items-center justify-center rounded font-bold text-xs">
                {fileExt}
            </div>
            <div className="break-all line-clamp-2 text-sm">
                {truncateFilenameMiddle(fileName || 'unknown', 30)}
            </div>
            <div className="flex justify-between mt-auto items-end">
                <div className="text-xs text-muted-foreground">
                    {formatSizeString(fileSize || 0)}
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        downloadFileFromUrl(fileUrl, fileName || 'unknown')
                    }
                >
                    <Download className="w-4 h-4 text-primary" />
                </Button>
            </div>
        </Card>
    );
}
