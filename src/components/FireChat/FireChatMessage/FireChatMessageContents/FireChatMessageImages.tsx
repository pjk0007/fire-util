import {
    FcMessage,
    FcMessageImage,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
} from '@/lib/FireChat/settings';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function FireChatMessageImages<
    M extends FcMessage<FcMessageImage>
>({ message, isMine }: { message: M; isMine: boolean }) {
    const totalImages = message[MESSAGE_CONTENTS_FIELD].length;
    if (totalImages === 0) {
        return <div></div>;
    }
    const remainder = totalImages % 3;
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
                    } else{
                        colSpan = 'col-span-2';
                    }
                } else {
                    colSpan = 'col-span-2';
                }
                return (
                    <Image
                        width={150}
                        height={150}
                        key={idx}
                        src={
                            img[MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD] ??
                            img[MESSAGE_CONTENT_URL_FIELD]
                        }
                        className={cn('w-full h-auto rounded-xs', colSpan)}
                        alt={`image-${idx}`}
                    />
                );
            })}
        </div>
    );
}
