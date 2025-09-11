import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Badge } from '@/components/ui/badge';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    FcMessage,
    FcMessageImage,
    LOCALE,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
} from '@/lib/FireChat/settings';
import { formatDateString } from '@/lib/FireChat/utils/timeformat';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function FireChatMessageImages<
    M extends FcMessage<FcMessageImage>
>({ message }: { message: M }) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const { selectedChannel } = useFireChat();

    const totalImages = message[MESSAGE_CONTENTS_FIELD].length;
    if (totalImages === 0) {
        return <div></div>;
    }
    const remainder = totalImages % 3;

    useEffect(() => {
        if (!api) {
            return;
        }
        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });

        return () => {
            api.off('select', () => {});
            api.destroy();
        };
    }, [api]);

    const senderUser = selectedChannel?.participants.find(
        (p) => p.id === message['userId']
    );
    if (!senderUser) return <div></div>;

    return (
        <div className={cn('grid grid-cols-6 gap-2')}>
            {message[MESSAGE_CONTENTS_FIELD].map((img, idx) => {
                let colSpan = 'col-span-2';
                if (totalImages === 1) {
                    colSpan = 'col-span-6';
                } else if (remainder === 1) {
                    if (idx >= totalImages - 4) {
                        colSpan = 'col-span-3';
                    } else {
                        colSpan = 'col-span-2';
                    }
                } else if (remainder === 2) {
                    if (idx >= totalImages - 2) {
                        colSpan = 'col-span-3';
                    } else {
                        colSpan = 'col-span-2';
                    }
                } else {
                    colSpan = 'col-span-2';
                }
                return (
                    <Dialog key={idx}>
                        <DialogTrigger
                            asChild
                            onClick={() => {
                                setCurrent(idx);
                            }}
                        >
                            <Image
                                width={150}
                                height={150}
                                key={idx}
                                src={
                                    img[
                                        MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD
                                    ] ?? img[MESSAGE_CONTENT_URL_FIELD]
                                }
                                className={cn(
                                    'rounded-xs object-cover object-top',
                                    {
                                        'h-[320px] w-full min-w-[200px] cursor-pointer':
                                            colSpan === 'col-span-6',
                                        'w-[160px] h-[160px] cursor-pointer':
                                            colSpan === 'col-span-3',
                                        'w-[100px] h-[100px] cursor-pointer':
                                            colSpan === 'col-span-2',
                                    },
                                    colSpan
                                )}
                                alt={`image-${idx}`}
                            />
                        </DialogTrigger>
                        <DialogContent className="px-0 pt-4 pb-2 gap-2">
                            <DialogHeader className="text-sm px-4">
                                <DialogTitle>
                                    {senderUser.name},{' '}
                                    {formatDateString(
                                        message[MESSAGE_CREATED_AT_FIELD]
                                    )}
                                </DialogTitle>
                                <DialogDescription />
                            </DialogHeader>
                            <Carousel
                                setApi={setApi}
                                onLoad={() => {
                                    setTimeout(() => {
                                        api?.scrollTo(idx, true);
                                    }, 1);
                                }}
                                className="group bg-muted  border-t border-b"
                            >
                                <CarouselContent className="max-h-[80vh]">
                                    {message[MESSAGE_CONTENTS_FIELD].map(
                                        (img, i) => (
                                            <CarouselItem key={i}>
                                                <ScrollArea className="h-full">
                                                    <Image
                                                        width={800}
                                                        height={800}
                                                        src={
                                                            img[
                                                                MESSAGE_CONTENT_URL_FIELD
                                                            ]
                                                        }
                                                        alt={`image-${i}`}
                                                        className="w-full object-contain my-auto"
                                                    />
                                                </ScrollArea>
                                            </CarouselItem>
                                        )
                                    )}
                                </CarouselContent>
                                <CarouselPrevious
                                    className="invisible group-hover:visible"
                                    style={{
                                        left: 12,
                                    }}
                                />
                                <CarouselNext
                                    className="invisible group-hover:visible"
                                    style={{
                                        right: 12,
                                    }}
                                />
                                <Badge className="invisible group-hover:visible bg-black/60 text-white absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl">
                                    <ImageIcon />
                                    {current + 1} / {totalImages}
                                </Badge>
                            </Carousel>
                            <DialogFooter className="px-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                console.log(
                                                    img[
                                                        MESSAGE_CONTENT_URL_FIELD
                                                    ]
                                                );
                                            }}
                                        >
                                            <Download className="text-foreground/80" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="top">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                disabled={totalImages < 2}
                                                onClick={async () => {
                                                    for (const img of message[
                                                        MESSAGE_CONTENTS_FIELD
                                                    ]) {
                                                        const type = img[
                                                            MESSAGE_CONTENT_URL_FIELD
                                                        ].split('?')
                                                            .at(0)
                                                            ?.split('.')
                                                            .at(-1);
                                                        await downloadFileFromUrl(
                                                            img[
                                                                MESSAGE_CONTENT_URL_FIELD
                                                            ],
                                                            `${
                                                                senderUser.name
                                                            }-${message[
                                                                MESSAGE_CREATED_AT_FIELD
                                                            ].toDate().getTime()}.${type}`
                                                        );
                                                    }
                                                }}
                                            >
                                                {
                                                    LOCALE.MESSAGE
                                                        .DOWNLOAD_ALL_IMAGE
                                                }
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    const img =
                                                        message[
                                                            MESSAGE_CONTENTS_FIELD
                                                        ][current];
                                                    const type = img[
                                                        MESSAGE_CONTENT_URL_FIELD
                                                    ].split('?')
                                                        .at(0)
                                                        ?.split('.')
                                                        .at(-1);
                                                    await downloadFileFromUrl(
                                                        img[
                                                            MESSAGE_CONTENT_URL_FIELD
                                                        ],
                                                        `${
                                                            senderUser.name
                                                        }-${message[
                                                            MESSAGE_CREATED_AT_FIELD
                                                        ].toDate().getTime()}.${type}`
                                                    );
                                                }}
                                            >
                                                {
                                                    LOCALE.MESSAGE
                                                        .DOWNLOAD_ONE_IMAGE
                                                }
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                );
            })}
        </div>
    );
}
