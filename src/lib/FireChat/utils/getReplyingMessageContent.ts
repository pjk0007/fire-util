import {
    FcMessage,
    FcMessageContent,
    FcMessageFile,
    FcMessageImage,
    FcMessageText,
    FcUser,
    FIRECHAT_LOCALE,
    MESSAGE_CONTENT_FILE_NAME_FIELD,
    MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
    MESSAGE_TYPE_TEXT,
} from '@/lib/FireChat/settings';

export default function getReplyingMessageContent({
    replyingMessage,
    participants,
}: {
    replyingMessage?: FcMessage<FcMessageContent> | null;
    participants: FcUser[];
}) {
    const replyingMessageUser = participants.find(
        (p) => p.id === replyingMessage?.userId
    );
    let replyingMessageContent = '';
    let replyingMessageThumbnail = '';
    if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_IMAGE) {
        const imageMessage = replyingMessage as FcMessage<FcMessageImage>;
        replyingMessageContent = FIRECHAT_LOCALE.IMAGE;
        replyingMessageThumbnail =
            imageMessage[MESSAGE_CONTENTS_FIELD][0][
                MESSAGE_CONTENT_IMAGE_THUMBNAIL_URL_FIELD
            ] ?? '';
    } else if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_FILE) {
        const fileMessage = replyingMessage as FcMessage<FcMessageFile>;
        replyingMessageContent =
            FIRECHAT_LOCALE.FILE +
            ': ' +
            (fileMessage[MESSAGE_CONTENTS_FIELD][0][
                MESSAGE_CONTENT_FILE_NAME_FIELD
            ] ?? FIRECHAT_LOCALE.FILE);
    } else if (replyingMessage?.[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_TEXT) {
        const textMessage = replyingMessage as FcMessage<FcMessageText>;
        if (
            !textMessage[MESSAGE_CONTENTS_FIELD] ||
            textMessage[MESSAGE_CONTENTS_FIELD].length === 0
        ) {
            replyingMessageContent = FIRECHAT_LOCALE.UNKNOWN;
        } else {
            replyingMessageContent =
                textMessage[MESSAGE_CONTENTS_FIELD][0]?.text ||
                (textMessage[MESSAGE_CONTENTS_FIELD][0]?.text === ''
                    ? '""'
                    : FIRECHAT_LOCALE.UNKNOWN);
        }
    }

    return {
        replyingMessageUser,
        replyingMessageContent,
        replyingMessageThumbnail,
    };
}
