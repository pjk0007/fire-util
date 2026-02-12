import { FireMessage, FireMessageContent, FIRE_CHAT_LOCALE } from "@/components/FireChat/settings";
import { FireUser } from "@/lib/FireAuth/settings";
import { cn } from "@/lib/utils";
import { CornerDownRight } from "lucide-react";
import { useCallback, useRef } from "react";
import useChatMention, { TrackedMention } from "@/components/FireChat/hooks/useChatMention";
import ChatMentionDropdown from "./ChatMentionDropdown";

export default function FireChatChannelRoomFooterTextarea<
    M extends FireMessage<T>,
    T extends FireMessageContent,
    U extends FireUser,
>({
    message,
    setMessage,
    onSend,
    replyingMessage,
    setFiles,
    disabled = false,
    participants,
    mentions,
    setMentions,
}: {
    message: string;
    setMessage: (msg: string) => void;
    onSend: () => void;
    replyingMessage?: M;
    setFiles: (files: File[]) => void;
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

    const handlePaste = useCallback(
        (event: React.ClipboardEvent) => {
            if (!event.clipboardData) return;

            const { items } = event.clipboardData;
            if (items.length === 0) return;
            const pasteFiles = [];

            for (let i = 0; i < items.length; i += 1) {
                const file = items[i]!.getAsFile();
                if (file) pasteFiles.push(file);
            }

            setFiles(pasteFiles);
            if (pasteFiles.length > 0) event.preventDefault();
        },
        [setFiles],
    );

    const handleScroll = useCallback(() => {
        if (textareaRef.current && backdropRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    }, []);

    return (
        <div className="relative md:block hidden">
            {!!replyingMessage && <CornerDownRight className="absolute top-0 left-0 w-4 h-4 text-foreground" />}
            {mentions.length > 0 && (
                <div
                    ref={backdropRef}
                    aria-hidden="true"
                    className={cn(
                        "chat-mention-backdrop absolute inset-0 h-[120px] text-sm w-full pointer-events-none overflow-hidden whitespace-pre-wrap break-words text-foreground",
                        {
                            "pl-[26px] pr-4": !!replyingMessage,
                        },
                    )}
                    dangerouslySetInnerHTML={{ __html: highlightedHtml + "\n" }}
                />
            )}
            <textarea
                ref={textareaRef}
                disabled={disabled}
                onPaste={handlePaste}
                onScroll={handleScroll}
                className={cn(
                    "resize-none focus:outline-none border-none h-[120px] text-sm w-full placeholder:text-muted-foreground bg-transparent relative",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",
                    mentions.length > 0 ? "text-transparent caret-foreground" : "",
                    {
                        "pl-[26px] pr-4": !!replyingMessage,
                    },
                )}
                placeholder={FIRE_CHAT_LOCALE.FOOTER.INPUT_PLACEHOLDER}
                value={message}
                onChange={handleChange}
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
