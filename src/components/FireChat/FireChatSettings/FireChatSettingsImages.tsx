import FireImageViewDialog from '@/components/FireUI/FireImageViewDialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
    FireMessage,
    FireMessageContent,
    FireMessageImage,
    FIRE_CHAT_LOCALE,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENT_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { CHANNEL_COLLECTION } from '@/lib/FireChannel/settings';
import { FireUser } from '@/lib/FireAuth/settings';
import { localeDateString } from '@/lib/FireUtil/timeformat';
import { ImagesIcon } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';

function FireChatSettingsImages<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser
>({
    imageMessages,
    channelId,
    participants,
}: {
    imageMessages: M[];
    channelId: string;
    participants: U[];
}) {
    return (
        <div className="flex flex-col gap-4">
            {imageMessages.length > 0 ? (
                <div className="gap-0.5 py-1 w-full grid grid-cols-3">
                    {[...imageMessages]
                        .reverse()
                        .slice(0, 12)
                        .map((msg, index) => {
                            const message = msg as FireMessage<FireMessageImage>;
                            const senderUser = participants.find(
                                (p) => p.id === message[MESSAGE_USER_ID_FIELD]
                            );
                            return (
                                <FireImageViewDialog
                                    defaultIdx={0}
                                    dialogTitle={`${
                                        senderUser?.name || FIRE_CHAT_LOCALE.UNKNOWN
                                    }, ${localeDateString(
                                        message[MESSAGE_CREATED_AT_FIELD]
                                    )}`}
                                    images={message[MESSAGE_CONTENTS_FIELD].map(
                                        (img) =>
                                            img[
                                                MESSAGE_CONTENT_URL_FIELD
                                            ] as string
                                    )}
                                    key={index}
                                >
                                    <AspectRatio ratio={1 / 1}>
                                        <Image
                                            width={130}
                                            height={130}
                                            src={
                                                message[
                                                    MESSAGE_CONTENTS_FIELD
                                                ][0]?.[
                                                    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD
                                                ] ||
                                                message[
                                                    MESSAGE_CONTENTS_FIELD
                                                ][0]?.[
                                                    MESSAGE_CONTENT_URL_FIELD
                                                ] ||
                                                ''
                                            }
                                            alt="Image"
                                            className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80 border"
                                        />
                                        {message[MESSAGE_CONTENTS_FIELD]
                                            .length > 1 && (
                                            <ImagesIcon
                                                className="absolute left-2 bottom-2 bg-foreground/40 text-white p-0.5 rounded-xs"
                                                size={16}
                                            />
                                        )}
                                    </AspectRatio>
                                </FireImageViewDialog>
                            );
                        })}
                </div>
            ) : (
                <span className="text-sm text-muted-foreground text-center py-2">
                    {FIRE_CHAT_LOCALE.NO_IMAGES}
                </span>
            )}

            {imageMessages.length > 12 && (
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
                            `/windows/${CHANNEL_COLLECTION}/${channelId}/contents?tab=image`,
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

export default memo(FireChatSettingsImages);
