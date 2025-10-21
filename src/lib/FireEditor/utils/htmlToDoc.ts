import { Block, FireDoc, Inline, ListItem, Mark } from '@/lib/FireEditor/settings';

export function htmlToDoc(html: string): FireDoc {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const body = doc.body;

    const blocks: Block[] = [];
    for (const node of Array.from(body.childNodes)) {
        const b = nodeToBlock(node);
        if (b) blocks.push(b);
    }
    return { blocks };
}

function nodeToBlock(node: Node): Block | null {
    if (!(node instanceof HTMLElement)) {
        // 텍스트가 루트에 있으면 문단으로 감싸기
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            return { type: 'paragraph', children: textNodeToInlines(node) };
        }
        return null;
    }

    const tag = node.tagName.toLowerCase();
    if (tag === 'p' || tag === 'div') {
        return {
            type: 'paragraph',
            children: elementChildrenToInlines(node),
        };
    }
    if (/^h[1-3]$/.test(tag)) {
        const level = Number(tag[1]) as 1 | 2 | 3;
        return {
            type: 'heading',
            level,
            children: elementChildrenToInlines(node),
        };
    }
    if (tag === 'ul' || tag === 'ol') {
        const items: ListItem[] = [];
        Array.from(node.children).forEach((li) => {
            if (li.tagName.toLowerCase() === 'li') {
                items.push({
                    children: elementChildrenToInlines(li as HTMLElement),
                });
            }
        });
        return tag === 'ul'
            ? { type: 'bulleted_list', items }
            : { type: 'numbered_list', items };
    }
    if (tag === 'blockquote') {
        return { type: 'quote', children: elementChildrenToInlines(node) };
    }
    if (tag === 'pre') {
        const code = node.querySelector('code');
        const language =
            (node.getAttribute('data-lang') || '').trim() || undefined;
        return { type: 'code', language, text: code?.textContent ?? '' };
    }

    // 그 밖의 블록은 파라그래프로 다운캐스트
    return { type: 'paragraph', children: elementChildrenToInlines(node) };
}

function elementChildrenToInlines(el: HTMLElement): Inline[] {
    const out: Inline[] = [];
    for (const child of Array.from(el.childNodes)) {
        out.push(...nodeToInlines(child));
    }
    return mergeAdjacentText(out);
}

function nodeToInlines(node: Node): Inline[] {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        return text ? [{ type: 'text', text }] : [];
    }
    if (!(node instanceof HTMLElement)) return [];

    const tag = node.tagName.toLowerCase();

    // 링크
    if (tag === 'a' && node.getAttribute('href')) {
        return [
            {
                type: 'link',
                href: (node.getAttribute('href') || '').trim(),
                children: elementChildrenToInlines(node),
            },
        ];
    }

    // 마크(굵게/기울임/밑줄/색/배경)
    const childInlines = elementChildrenToInlines(node);
    const markList: Mark[] = [];
    if (tag === 'strong' || tag === 'b') markList.push('bold');
    if (tag === 'em' || tag === 'i') markList.push('italic');
    if (tag === 'u') markList.push('underline');
    // 마크 중복 방지
    const marks = Array.from(new Set(markList));

    // 스타일 색상 추출
    const style = node.getAttribute('style') || '';
    const color = getCssValue(style, 'color');
    if (color) marks.push({ color });
    const bg = getCssValue(style, 'background-color');
    if (bg) marks.push({ bg });

    if (marks.length) {
        return applyMarks(childInlines, marks);
    }

    // 인식 못한 인라인 태그는 자식만 통과
    return childInlines;
}

function textNodeToInlines(node: Node): Inline[] {
    const text = node.textContent ?? '';
    return text ? [{ type: 'text', text }] : [];
}

function applyMarks(nodes: Inline[], marks: Mark[]): Inline[] {
    // 텍스트 노드에만 마크를 얹고, 링크 안쪽도 children에 재귀적으로 적용됨
    return nodes.map((n) => {
        if (n.type === 'text') {
            return { ...n, marks: [...(n.marks ?? []), ...marks] };
        }
        if (n.type === 'link') {
            return { ...n, children: applyMarks(n.children, marks) };
        }
        return n;
    });
}

function getCssValue(style: string, prop: string): string | null {
    const m = style.match(new RegExp(`${prop}\\s*:\\s*([^;]+)`, 'i'));
    return m ? m[1].trim() : null;
}

function mergeAdjacentText(inlines: Inline[]): Inline[] {
    const out: Inline[] = [];
    for (const cur of inlines) {
        const prev = out[out.length - 1];
        if (
            prev &&
            prev.type === 'text' &&
            cur.type === 'text' &&
            JSON.stringify(prev.marks ?? []) === JSON.stringify(cur.marks ?? [])
        ) {
            prev.text += cur.text;
        } else {
            out.push(cur);
        }
    }
    return out;
}
