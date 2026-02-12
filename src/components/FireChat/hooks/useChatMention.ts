import { FireUser, USER_ID_FIELD, USER_NAME_FIELD } from "@/lib/FireAuth/settings";
import { useState, useCallback, useMemo, useRef, RefObject } from "react";

export interface TrackedMention {
    userId: string;
    name: string;
    startIndex: number;
}

interface UseChatMentionProps<U extends FireUser> {
    message: string;
    setMessage: (msg: string) => void;
    participants: U[];
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    mentions: TrackedMention[];
    setMentions: React.Dispatch<React.SetStateAction<TrackedMention[]>>;
}

interface DropdownPosition {
    top: number;
    left: number;
}

const MIRROR_STYLE_PROPS = [
    "direction",
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontSizeAdjust",
    "lineHeight",
    "fontFamily",
    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration",
    "letterSpacing",
    "wordSpacing",
    "tabSize",
    "whiteSpace",
    "wordBreak",
    "wordWrap",
] as const;

function getCaretCoordinates(element: HTMLTextAreaElement, position: number): { top: number; left: number } {
    const div = document.createElement("div");
    try {
        const style = div.style;
        const computed = window.getComputedStyle(element);

        style.whiteSpace = "pre-wrap";
        style.wordWrap = "break-word";
        style.position = "absolute";
        style.visibility = "hidden";
        style.overflow = "hidden";

        for (const prop of MIRROR_STYLE_PROPS) {
            (style as unknown as Record<string, string>)[prop] = computed.getPropertyValue(
                prop.replace(/([A-Z])/g, "-$1").toLowerCase(),
            );
        }

        div.textContent = element.value.substring(0, position);

        const span = document.createElement("span");
        span.textContent = element.value.substring(position) || ".";
        div.appendChild(span);

        document.body.appendChild(div);

        return {
            top: span.offsetTop + parseInt(computed.borderTopWidth),
            left: span.offsetLeft + parseInt(computed.borderLeftWidth),
        };
    } finally {
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
    }
}

export default function useChatMention<U extends FireUser>({
    message,
    setMessage,
    participants,
    textareaRef,
    mentions,
    setMentions,
}: UseChatMentionProps<U>) {
    const [mentionActive, setMentionActive] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStartIndex, setMentionStartIndex] = useState(-1);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
    const justSelectedRef = useRef(false);

    const filteredParticipants = useMemo(() => {
        if (!mentionActive) return [];
        return participants
            .filter((p) => p[USER_NAME_FIELD].toLowerCase().includes(mentionQuery.toLowerCase()))
            .slice(0, 5);
    }, [mentionActive, mentionQuery, participants]);

    const detectMention = useCallback(
        (value: string, cursorPos: number) => {
            const textBeforeCursor = value.substring(0, cursorPos);
            const atIndex = textBeforeCursor.lastIndexOf("@");

            if (atIndex === -1) {
                setMentionActive(false);
                return;
            }

            if (atIndex > 0 && !/\s/.test(value[atIndex - 1]!)) {
                setMentionActive(false);
                return;
            }

            const query = textBeforeCursor.substring(atIndex + 1);

            if (query.includes("\n")) {
                setMentionActive(false);
                return;
            }

            setMentionActive(true);
            setMentionQuery(query);
            setMentionStartIndex(atIndex);
            setSelectedIndex(0);

            if (textareaRef.current) {
                try {
                    const coords = getCaretCoordinates(textareaRef.current, atIndex);
                    setDropdownPosition({
                        top: coords.top - textareaRef.current.scrollTop,
                        left: coords.left,
                    });
                } catch {
                    setDropdownPosition({ top: 0, left: 0 });
                }
            }
        },
        [textareaRef],
    );

    const selectMention = useCallback(
        (user: U) => {
            const currentValue = textareaRef.current?.value ?? message;
            const mentionText = `@${user[USER_NAME_FIELD]}`;
            const before = currentValue.substring(0, mentionStartIndex);
            const cursorPos = textareaRef.current?.selectionStart ?? (mentionStartIndex + 1 + mentionQuery.length);
            const after = currentValue.substring(cursorPos);
            const newMessage = before + mentionText + " " + after;
            const newCursorPos = (before + mentionText + " ").length;

            const newMention: TrackedMention = {
                userId: user[USER_ID_FIELD],
                name: user[USER_NAME_FIELD],
                startIndex: mentionStartIndex,
            };

            const insertedLength = mentionText.length + 1;
            const removedLength = cursorPos - mentionStartIndex;
            const shift = insertedLength - removedLength;

            setMentions((prev) => [
                ...prev.map((m) => (m.startIndex > mentionStartIndex ? { ...m, startIndex: m.startIndex + shift } : m)),
                newMention,
            ]);

            setMessage(newMessage);
            setMentionActive(false);
            setMentionQuery("");

            justSelectedRef.current = true;
            setTimeout(() => {
                justSelectedRef.current = false;
            }, 100);

            requestAnimationFrame(() => {
                if (textareaRef.current) {
                    textareaRef.current.value = newMessage;
                    textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                    textareaRef.current.focus();
                }
            });
        },
        [message, mentionStartIndex, mentionQuery, setMessage, setMentions, textareaRef],
    );

    const handleMentionKeyDown = useCallback(
        (e: React.KeyboardEvent): boolean => {
            if (justSelectedRef.current && e.key === "Enter") {
                e.preventDefault();
                return true;
            }

            if (!mentionActive || filteredParticipants.length === 0) return false;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => (i + 1) % filteredParticipants.length);
                return true;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => (i - 1 + filteredParticipants.length) % filteredParticipants.length);
                return true;
            }
            if (e.key === "Enter") {
                e.preventDefault();
                const user = filteredParticipants[selectedIndex];
                if (user) {
                    selectMention(user);
                }
                return true;
            }
            if (e.key === "Escape") {
                e.preventDefault();
                setMentionActive(false);
                return true;
            }
            return false;
        },
        [mentionActive, filteredParticipants, selectedIndex, selectMention],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            const cursorPos = e.target.selectionStart;

            const lengthDiff = newValue.length - message.length;

            if (lengthDiff !== 0) {
                setMentions((prev) => {
                    return prev
                        .map((m) => {
                            if (cursorPos - Math.max(lengthDiff, 0) <= m.startIndex) {
                                return { ...m, startIndex: m.startIndex + lengthDiff };
                            }
                            return m;
                        })
                        .filter((m) => {
                            if (m.startIndex < 0 || m.startIndex >= newValue.length) return false;
                            const expected = `@${m.name}`;
                            const actual = newValue.substring(m.startIndex, m.startIndex + expected.length);
                            return actual === expected;
                        });
                });
            }

            setMessage(newValue);
            detectMention(newValue, cursorPos);
        },
        [message, setMessage, detectMention, setMentions],
    );

    const highlightedHtml = useMemo(() => {
        if (mentions.length === 0) return message;
        const sorted = [...mentions].sort((a, b) => b.startIndex - a.startIndex);
        let result = message;
        for (const m of sorted) {
            const mentionText = `@${m.name}`;
            if (result.substring(m.startIndex, m.startIndex + mentionText.length) === mentionText) {
                result =
                    result.substring(0, m.startIndex) +
                    `<mark style="color:var(--primary);font-weight:600;background:transparent">${mentionText}</mark>` +
                    result.substring(m.startIndex + mentionText.length);
            }
        }
        return result;
    }, [message, mentions]);

    return {
        mentionActive,
        filteredParticipants,
        selectedIndex,
        dropdownPosition,
        handleMentionKeyDown,
        handleChange,
        selectMention,
        highlightedHtml,
    };
}
