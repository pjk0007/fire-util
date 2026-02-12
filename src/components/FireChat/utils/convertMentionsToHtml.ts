import { TrackedMention } from "@/components/FireChat/hooks/useChatMention";

function escapeHtmlAttr(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function convertMentionsToHtml(message: string, mentions: TrackedMention[]): string {
    if (mentions.length === 0) return message;

    const sorted = [...mentions].sort((a, b) => b.startIndex - a.startIndex);

    let result = message;
    for (const mention of sorted) {
        const mentionText = `@${mention.name}`;
        const actual = result.substring(mention.startIndex, mention.startIndex + mentionText.length);
        if (actual === mentionText) {
            const span = `<span class="chat-mention" style="color:var(--primary);font-weight:600" data-user-id="${escapeHtmlAttr(mention.userId)}">@${escapeHtml(mention.name)}</span>`;
            result =
                result.substring(0, mention.startIndex) +
                span +
                result.substring(mention.startIndex + mentionText.length);
        }
    }

    return result;
}
