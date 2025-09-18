import { useFireChatChannel } from '@/components/FireChat/FireChatChannelProvider';
import { useAuth } from '@/components/provider/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
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
import truncateFilenameMiddle from '@/lib/FireChat/utils/truncateFilenameMiddle';
import Image from 'next/image';

export default function FireChatContents({
    defatultTab = 'image',
}: {
    defatultTab?: 'image' | 'file';
}) {
    const { fileMessages, imageMessages, channel } = useFireChatChannel();
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
                        <div className="w-80 flex gap-2 h-8">
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

                                    if (isNewMonth) {
                                        return (
                                            <>
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
                                                    className="w-32 h-32 object-cover m-2 rounded"
                                                />
                                            </>
                                        );
                                    }
                                    return (
                                        <Image
                                            key={index}
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
                                            className="w-32 h-32 object-cover m-2 rounded"
                                        />
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

                                    if (isNewMonth) {
                                        return (
                                            <>
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
                                    }
                                    return (
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
        <Card className="m-2 p-4 w-52 h-48 rounded-sm gap-2">
            <div className="w-10 h-8 bg-muted text-muted-foreground flex items-center justify-center rounded font-bold">
                {fileExt}
            </div>
            <div className="font-medium break-all line-clamp-2">
                {truncateFilenameMiddle(fileName || 'unknown', 30)}
            </div>
            <div className="text-sm text-muted-foreground">
                {formatSizeString(fileSize || 0)}
            </div>
            <Button
                variant="outline"
                size="sm"
                className="mt-auto"
                onClick={() =>
                    downloadFileFromUrl(fileUrl, fileName || 'unknown')
                }
            >
                다운로드
            </Button>
        </Card>
    );
}
