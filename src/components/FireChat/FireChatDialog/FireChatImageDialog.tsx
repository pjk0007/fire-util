import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LOCALE } from '@/lib/FireChat/settings';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import { Download, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function FireChatImageDialog({
    children,
    dialogTitle,
    defaultIdx,
    images,
}: {
    children: React.ReactNode;
    dialogTitle?: string;
    defaultIdx: number;
    images: string[];
}) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

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

    useEffect(() => {
        setCurrent(defaultIdx);
    }, [defaultIdx]);

    const totalImages = images.length;

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="px-0 pt-4 pb-2 gap-2">
                <DialogHeader className="text-sm px-4">
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <Carousel
                    setApi={setApi}
                    onLoad={() => {
                        setTimeout(() => {
                            api?.scrollTo(current, true);
                        }, 1);
                    }}
                    className="group bg-muted  border-t border-b"
                >
                    <CarouselContent className="max-h-[80vh]">
                        {images.map((img, i) => (
                            <CarouselItem key={i}>
                                <ScrollArea className="h-full">
                                    <Image
                                        width={800}
                                        height={800}
                                        src={img}
                                        alt={`image-${i}`}
                                        className="w-full object-contain my-auto"
                                    />
                                </ScrollArea>
                            </CarouselItem>
                        ))}
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
                            <Button variant="ghost">
                                <Download className="text-foreground/80" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top">
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    disabled={totalImages < 2}
                                    onClick={async () => {
                                        for (const img of images) {
                                            const storagePath = new URL(
                                                img
                                            ).pathname
                                                .split('/')
                                                .at(-1);
                                            const decoded = decodeURIComponent(
                                                storagePath || ''
                                            );
                                            const fileName = decoded
                                                .split('/')
                                                .at(-1);
                                            const type = fileName
                                                ?.split('.')
                                                .at(-1);
                                            await downloadFileFromUrl(
                                                img,
                                                fileName ||
                                                    `image-${new Date().getTime()}.${type}`
                                            );
                                        }
                                    }}
                                >
                                    {LOCALE.MESSAGE.DOWNLOAD_ALL_IMAGE}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={async () => {
                                        const img = images[current];
                                        const storagePath = new URL(
                                            img
                                        ).pathname
                                            .split('/')
                                            .at(-1);
                                        const decoded = decodeURIComponent(
                                            storagePath || ''
                                        );
                                        const fileName = decoded
                                            .split('/')
                                            .at(-1);
                                        const type = fileName
                                            ?.split('.')
                                            .at(-1);

                                        await downloadFileFromUrl(
                                            img,
                                            fileName ||
                                                `image-${new Date().getTime()}.${type}`
                                        );
                                    }}
                                >
                                    {LOCALE.MESSAGE.DOWNLOAD_ONE_IMAGE}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
