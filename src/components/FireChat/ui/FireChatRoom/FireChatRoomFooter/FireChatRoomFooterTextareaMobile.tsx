import { FireMessage, FireMessageContent, FIRE_CHAT_LOCALE } from "@/components/FireChat/settings";
import { FireUser } from "@/lib/FireAuth/settings";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";
import useChatMention, { TrackedMention } from "@/components/FireChat/hooks/useChatMention";
import ChatMentionDropdown from "./ChatMentionDropdown";

export default function FireChatChannelRoomFooterTextareaMobile<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser,
>({
    message,
    setMessage,
    onSend,
    replyingMessage,
    disabled = false,
    participants,
    mentions,
    setMentions,
}: {
    message: string;
    setMessage: (msg: string) => void;
    onSend: () => void;
    replyingMessage?: M;
    disabled?: boolean;
    participants: U[];
    mentions: TrackedMention[];
    setMentions: React.Dispatch<React.SetStateAction<TrackedMention[]>>;
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const {
        mentionActive,
        filteredParticipants,
        selectedIndex,
        dropdownPosition,
        handleMentionKeyDown,
        handleChange,
        selectMention,
        highlightedHtml,
    } = useChatMention({
        message,
        setMessage,
        participants,
        textareaRef,
        mentions,
        setMentions,
    });

    const handleScroll = useCallback(() => {
        if (textareaRef.current && backdropRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    }, []);

    useEffect(() => {
        // message가 변경될 때마다 텍스트 영역의 높이를 조정
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // 높이를 초기화
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 스크롤 높이에 맞게 조정
        }
    }, [message]);

    return (
        <div className="relative flex-1 md:hidden">
            {mentions.length > 0 && (
                <div
                    ref={backdropRef}
                    aria-hidden="true"
                    className={cn(
                        "chat-mention-backdrop absolute inset-0 min-h-9 max-h-32 px-3 py-2 rounded-3xl w-full pointer-events-none overflow-hidden whitespace-pre-wrap break-words text-foreground",
                    )}
                    dangerouslySetInnerHTML={{ __html: highlightedHtml + "\n" }}
                />
            )}

            <textarea
                disabled={disabled}
                ref={textareaRef}
                className={cn(
                    "min-h-9 max-h-32 px-3 py-2 rounded-3xl focus:outline-none border-none w-full flex items-center placeholder:text-muted-foreground bg-transparent relative",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",
                    mentions.length > 0 ? "text-transparent caret-foreground" : "",
                )}
                rows={1}
                placeholder={
                    replyingMessage ? FIRE_CHAT_LOCALE.FOOTER.REPLY_MESSAGE : FIRE_CHAT_LOCALE.FOOTER.INPUT_PLACEHOLDER
                }
                value={message}
                onChange={handleChange}
                onScroll={handleScroll}
                onKeyDown={(e) => {
                    if (handleMentionKeyDown(e)) return;

                    if (e.key === "Enter" && !e.shiftKey) {
                        if (e.nativeEvent.isComposing) return; // 한글 조합 중이면 무시
                        e.preventDefault();
                        onSend();
                    }
                }}
            />
            {mentionActive && filteredParticipants.length > 0 && (
                <ChatMentionDropdown
                    participants={filteredParticipants}
                    selectedIndex={selectedIndex}
                    onSelect={(user) => selectMention(user as U)}
                    position={dropdownPosition}
                />
            )}
        </div>
    );
}
