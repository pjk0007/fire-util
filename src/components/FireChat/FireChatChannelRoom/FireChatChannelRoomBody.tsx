import FireChatMessage from '@/components/FireChat/FireChatMessage/FireChatMessage';
import FireChatMessageSystem from '@/components/FireChat/FireChatMessage/FireChatMessageContents/FireChatMessageSystem';
import FireChatSending from '@/components/FireChat/FireChatMessage/FireChatSending';
import { useFireChat } from '@/components/FireChat/FireChatProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CHANNEL_ID_FIELD,
    FcMessage,
    FcMessageSystem,
    MESSAGE_CONTENT_TEXT_FIELD,
    MESSAGE_CONTENTS_FIELD,
    MESSAGE_CREATED_AT_FIELD,
    MESSAGE_ID_FIELD,
    MESSAGE_TYPE_FIELD,
    MESSAGE_TYPE_SYSTEM,
    MESSAGE_USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { formatDateString } from '@/lib/FireChat/utils/timeformat';
import { ArrowDown } from 'lucide-react';
import { Fragment } from 'react';

export default function FireChatChannelRoomBody() {
    const {
        selectedChannel,
        messages: selectedChannelMessages,
        scrollAreaRef: channelRoomRef,
        isBottom,
        scrollToBottom,
        isLoading,
        isScrolling,
        scrollDate,
        sendingFiles,
    } = useFireChat();

    return (
        <div className="flex-1 overflow-hidden relative">
            {isLoading && (
                <div className="absolute w-full h-full z-10 bg-secondary flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            )}
            <ScrollArea className="h-full bg-secondary" ref={channelRoomRef}>
                <div className="flex flex-col w-screen md:w-full gap-2 py-4 px-3 md:px-8 box-border">
                    {selectedChannelMessages.map((msg, index) => {
                        const beforeDate =
                            index > 0
                                ? selectedChannelMessages[index - 1]?.[
                                      MESSAGE_CREATED_AT_FIELD
                                  ]
                                : null;
                        const currentDate = msg?.[MESSAGE_CREATED_AT_FIELD];
                        if (
                            beforeDate &&
                            currentDate &&
                            beforeDate.toDate().toDateString() !==
                                currentDate.toDate().toDateString()
                        ) {
                            return (
                                <Fragment key={index}>
                                    <FireChatMessageSystem
                                        message={
                                            {
                                                [MESSAGE_ID_FIELD]: `date-separator-${msg[MESSAGE_ID_FIELD]}`,
                                                [MESSAGE_CREATED_AT_FIELD]:
                                                    currentDate,
                                                [MESSAGE_TYPE_FIELD]:
                                                    MESSAGE_TYPE_SYSTEM,
                                                [MESSAGE_USER_ID_FIELD]:
                                                    'system',
                                                [MESSAGE_CONTENTS_FIELD]: [
                                                    {
                                                        [MESSAGE_CONTENT_TEXT_FIELD]:
                                                            formatDateString(
                                                                currentDate
                                                            ),
                                                        [MESSAGE_TYPE_FIELD]:
                                                            MESSAGE_TYPE_SYSTEM,
                                                    },
                                                ],
                                            } as FcMessage<FcMessageSystem>
                                        }
                                    />
                                    <FireChatMessage
                                        key={index}
                                        message={msg}
                                    />
                                </Fragment>
                            );
                        }
                        return (
                            <FireChatMessage
                                key={index}
                                message={msg}
                                beforeMessage={
                                    index > 0
                                        ? selectedChannelMessages[index - 1]
                                        : undefined
                                }
                            />
                        );
                    })}
                    {sendingFiles
                        .filter(
                            (sf) =>
                                sf.channelId ===
                                selectedChannel?.channel[CHANNEL_ID_FIELD]
                        )
                        .map((sf, idx) => (
                            <FireChatSending
                                key={`sending-${idx}`}
                                sendingFile={sf}
                            />
                        ))}
                </div>
                {!isBottom && isScrolling && (
                    <Button
                        variant={'outline'}
                        className="w-10 h-10 absolute bottom-8 left-1/2 transform -translate-x-1/2 rounded-full opacity-50"
                        onClick={() => scrollToBottom(true)}
                    >
                        <ArrowDown />
                    </Button>
                )}
                <div
                    className={
                        `text-xs absolute top-8 left-1/2 transform -translate-x-1/2 rounded-[12px] bg-foreground/60 px-[12px] py-[8px] text-white transition-all duration-300 pointer-events-none` +
                        (scrollDate && isScrolling
                            ? ' opacity-100 scale-100'
                            : ' opacity-0 scale-95')
                    }
                    style={{ zIndex: 30 }}
                >
                    {scrollDate}
                </div>
            </ScrollArea>
        </div>
    );
}
