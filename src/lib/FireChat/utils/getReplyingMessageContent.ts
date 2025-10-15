import {
    FireMessage,
    FireMessageContent,
    FireMessageFile,
    FireMessageImage,
    FireMessageText,
    FIRE_CHAT_LOCALE,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_TEXT,
} from '@/lib/FireChat/settings';
import { FireUser } from '@/lib/FireAuth/settings';

export default function getReplyingMessageContent({
    replyingMessage,
    participants,
}: {
    replyingMessage?: FireMessage<FireMessageContent> | null;
    participants: FireUser[];
}) {
    const replyingMessageUser = participants.find(
        (p) => p.id === replyingMessage?.userId
    );
    let replyingMessageContent = '';
    let replyingMessageThumbnail = '';
    if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE) {
        const imageMessage = replyingMessage as FireMessage<FireMessageImage>;
        replyingMessageContent = FIRE_CHAT_LOCALE.IMAGE;
        replyingMessageThumbnail =
            imageMessage[MESSAGE_CONTENTS_FIELD][0][
                MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD
            ] ?? '';
    } else if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_FILE) {
        const fileMessage = replyingMessage as FireMessage<FireMessageFile>;
        replyingMessageContent =
            FIRE_CHAT_LOCALE.FILE +
            ': ' +
            (fileMessage[MESSAGE_CONTENTS_FIELD][0][
                MESSAGE_CONTENT_FILE_NAME_FIELD
            ] ?? FIRE_CHAT_LOCALE.FILE);
    } else if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_TEXT) {
        const textMessage = replyingMessage as FireMessage<FireMessageText>;
        if (
            !textMessage[MESSAGE_CONTENTS_FIELD] ||
            textMessage[MESSAGE_CONTENTS_FIELD].length === 0
        ) {
            replyingMessageContent = FIRE_CHAT_LOCALE.UNKNOWN;
        } else {
            replyingMessageContent =
                textMessage[MESSAGE_CONTENTS_FIELD][0]?.text ||
                (textMessage[MESSAGE_CONTENTS_FIELD][0]?.text === ''
                    ? '""'
                    : FIRE_CHAT_LOCALE.UNKNOWN);
        }
    }

    return {
        replyingMessageUser,
        replyingMessageContent,
        replyingMessageThumbnail,
    };
}
