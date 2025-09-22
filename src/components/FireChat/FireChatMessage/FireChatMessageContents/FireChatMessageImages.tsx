import { useFireChat } from '@/components/FireChat/FireChatProvider';
import {
    FcMessage,
    FcMessageImage,
    FcUser,
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
import getImageColSpan from '@/lib/FireChat/utils/getImageColSpan';

export default function FireChatMessageImages<
    M extends FcMessage<FcMessageImage>,
    U extends FcUser
>({ message, participants }: { message: M; participants: U[] }) {
    const totalImages = message[MESSAGE_CONTENTS_FIELD].length;
    if (totalImages === 0) {
        return <div></div>;
    }

    const senderUser = participants.find(
        (p) => p.id === message[MESSAGE_USER_ID_FIELD]
    );
    if (!senderUser) return <div></div>;

    return (
        <div className={cn('grid grid-cols-6 gap-2 max-w-64 md:max-w-full')}>
            {message[MESSAGE_CONTENTS_FIELD].map((img, idx) => {
                const colSpan = getImageColSpan(totalImages, idx);
                return (
                    <FireChatImageDialog
                        defaultIdx={idx}
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
                                'border border-muted rounded-xs object-cover object-top',
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
