import { Button } from "@/components/ui/button";
import { FireUser } from "@/lib/FireAuth/settings";
import { USER_ID_FIELD } from "@/lib/FireAuth/settings";
import { localeTimeString } from "@/lib/FireUtil/timeformat";
import { cn } from "@/lib/utils";
import { FIRE_CHAT_LOCALE, FireMessage, FireMessageContent, FireMessageSystem, MESSAGE_CREATED_AT_FIELD, MESSAGE_ID_FIELD, MESSAGE_REACTIONS_FIELD, MESSAGE_TYPE_FIELD, MESSAGE_TYPE_SYSTEM, MESSAGE_USER_ID_FIELD } from "../../settings";
import FireChatMessageSystem from "./FireChatMessageContents/FireChatMessageSystem";
import FireChatMessageContextMenu from "./FireChatMessageContextMenu";
import FireChatMessageAvatar from "./FireChatMessageAvatar";
import FireChatMessageContent from "./FireChatMessageContent";
import FireChatMessageActionButtons from "./FireChatMessageActionButtons";
import handleEmojiReactionClick from "../../api/handleEmojiReactionClick";

export default function FireChatMessage<M extends FireMessage<T>, T extends FireMessageContent, U extends FireUser>({
    channelId,
    message,
    beforeMessage,
    afterMessage,
    participants,
    me,
    setReplyingMessage,
    onLoad,
    unreadCount = 0,
}: {
    channelId: string;
    message: M;
    beforeMessage?: M;
    afterMessage?: M;
    participants: U[];
    me?: U | null;
    setReplyingMessage?: (message: M) => void;
    onLoad?: () => void;
    unreadCount?: number;
}) {
    const messageUser = participants.find((p) => p[USER_ID_FIELD] === message[MESSAGE_USER_ID_FIELD]);

    if (message[MESSAGE_TYPE_FIELD] === MESSAGE_TYPE_SYSTEM) {
        return <FireChatMessageSystem message={message as FireMessage<FireMessageSystem>} />;
    }

    const isMine = message[MESSAGE_USER_ID_FIELD] === me?.[USER_ID_FIELD];

    const isSameUserAndSameMinAsBefore =
        beforeMessage?.[MESSAGE_USER_ID_FIELD] === message[MESSAGE_USER_ID_FIELD] &&
        beforeMessage?.[MESSAGE_CREATED_AT_FIELD] &&
        Math.floor(beforeMessage?.[MESSAGE_CREATED_AT_FIELD].seconds / 60) ===
            Math.floor(message[MESSAGE_CREATED_AT_FIELD].seconds / 60);

    const isSameMinAsAfter =
        afterMessage?.[MESSAGE_CREATED_AT_FIELD] &&
        Math.floor(afterMessage?.[MESSAGE_CREATED_AT_FIELD].seconds / 60) ===
            Math.floor(message[MESSAGE_CREATED_AT_FIELD].seconds / 60);

    return (
        <FireChatMessageContextMenu
            message={message}
            me={me}
            channelId={channelId}
            setReplyingMessage={setReplyingMessage}
        >
            <div
                onLoad={onLoad}
                data-seconds={message[MESSAGE_CREATED_AT_FIELD].seconds}
                id={`message-${message[MESSAGE_ID_FIELD]}`}
                className={cn("flex group w-full gap-3", {
                    "justify-end": isMine,
                    "justify-start": !isMine,
                    "mt-3": !isSameUserAndSameMinAsBefore,
                })}
            >
                {isMine ? null : isSameUserAndSameMinAsBefore ? (
                    <div className="w-8" />
                ) : (
                    <FireChatMessageAvatar message={message} participants={participants} />
                )}

                <div
                    className={cn("flex flex-col max-w-[78%] gap-2", {
                        "items-end": isMine,
                        "items-start": !isMine,
                    })}
                >
                    {!isSameUserAndSameMinAsBefore && !isMine && (
                        <p className="text-sm text-foreground font-medium">
                            {messageUser?.name || FIRE_CHAT_LOCALE.UNKNOWN}
                        </p>
                    )}
                    <div className="flex flex-col relative">
                        <FireChatMessageContent message={message} me={me} participants={participants} />
                        <div
                            className={cn(
                                "text-nowrap text-xs text-muted-foreground visible group-hover:invisible absolute md:items-center bottom-1 flex items-center gap-1",
                                {
                                    "left-[calc(100%+8px)]": !isMine,
                                    "right-[calc(100%+8px)]": isMine,
                                    "flex-row": !isMine,
                                    "flex-row-reverse": isMine,
                                }
                            )}
                        >
                            {!isSameMinAsAfter && localeTimeString(message[MESSAGE_CREATED_AT_FIELD])}
                            {unreadCount > 0 && <span className="text-primary font-medium">{unreadCount}</span>}
                        </div>

                        <FireChatMessageActionButtons
                            channelId={channelId}
                            isMine={isMine}
                            message={message}
                            me={me}
                            setReplyingMessage={setReplyingMessage}
                        />
                    </div>
                    {Object.entries(message[MESSAGE_REACTIONS_FIELD] || {}).length > 0 && (
                        <div className="flex gap-1 mb-2">
                            {Object.entries(message[MESSAGE_REACTIONS_FIELD] || {}).map(([emoji, userIds]) => (
                                <Button
                                    key={emoji}
                                    variant={"outline"}
                                    size="sm"
                                    className={cn("rounded-sm px-1.5 py-1 text-xs gap-2 h-[22px]", {
                                        "border-primary bg-primary/5": userIds.includes(me?.[USER_ID_FIELD] || ""),
                                    })}
                                    onClick={() => {
                                        handleEmojiReactionClick({
                                            channelId,
                                            message,
                                            emoji,
                                            userId: me?.[USER_ID_FIELD] || "",
                                        });
                                    }}
                                >
                                    <p>{emoji} </p>
                                    <p>{userIds.length}</p>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FireChatMessageContextMenu>
    );
}
