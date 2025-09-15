import { useFireChat } from '@/components/FireChat/FireChatProvider';
import {
    FcMessage,
    FcMessageImage,
    LOCALE,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { formatDateString } from '@/lib/FireChat/utils/timeformat';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import FireChatImageDialog from '@/components/FireChat/FireChatDialog/FireChatImageDialog';

export default function FireChatMessageImages<
    M extends FcMessage<FcMessageImage>
>({ message }: { message: M }) {
    const { selectedChannel } = useFireChat();

    const totalImages = message[MESSAGE_CONTENTS_FIELD].length;
    if (totalImages === 0) {
        return <div></div>;
    }
    const remainder = totalImages % 3;

    const senderUser = selectedChannel?.participants.find(
        (p) => p.id === message[MESSAGE_USER_ID_FIELD]
    );
    if (!senderUser) return <div></div>;

    return (
        <div className={cn('grid grid-cols-6 gap-2 max-w-64 md:max-w-full')}>
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
                    <FireChatImageDialog
                        idx={idx}
                        dialogTitle={`${senderUser.name}, ${formatDateString(
                            message[MESSAGE_CREATED_AT_FIELD]
                        )}`}
                        images={message[MESSAGE_CONTENTS_FIELD].map(
                            (img) => img[MESSAGE_CONTENT_URL_FIELD] as string
                        )}
                        key={idx}
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
                    </FireChatImageDialog>
                );
            })}
        </div>
    );
}
