import { Block, FireDoc, Inline } from '@/lib/FireEditor/settings';

export function docToHTML(doc: FireDoc): string {
    return doc.blocks.map(blockToHTML).join('');
}

export function blockToHTML(b: Block): string {
    switch (b.type) {
        case 'paragraph':
            return `<p>${inlinesToHTML(b.children)}</p>`;
        case 'heading':
            return `<h${b.level}>${inlinesToHTML(b.children)}</h${b.level}>`;
        case 'bulleted_list':
            return `<ul>${b.items
                .map((li) => `<li>${inlinesToHTML(li.children)}</li>`)
                .join('')}</ul>`;
        case 'numbered_list':
            return `<ol>${b.items
                .map((li) => `<li>${inlinesToHTML(li.children)}</li>`)
                .join('')}</ol>`;
        case 'quote':
            return `<blockquote>${inlinesToHTML(b.children)}</blockquote>`;
        case 'code':
            // language는 data-attr로 보존
            return `<pre data-lang="${b.language ?? ''}"><code>${escapeHTML(
                b.text
            )}</code></pre>`;
    }
}

export function inlinesToHTML(nodes: Inline[]): string {
    if (nodes.length === 0) return '';
    return nodes.map(inlineToHTML).join('');
}

function inlineToHTML(n: Inline): string {
    if (n.type === 'link') {
        return `<a href="${escapeAttr(
            n.href
        )}" target="_blank" rel="noopener noreferrer">${inlinesToHTML(
            n.children
        )}</a>`;
    }
    // text + marks
    const textHTML = escapeHTML(n.text);
    const marks = n.marks ?? [];
    return marks.reduce((acc, m) => {
        if (m === 'bold') return `<strong>${acc}</strong>`;
        if (m === 'italic') return `<em>${acc}</em>`;
        if (m === 'underline') return `<u>${acc}</u>`;
        if (typeof m === 'object' && 'color' in m)
            return `<span style="color:${escapeStyle(m.color)}">${acc}</span>`;
        if (typeof m === 'object' && 'bg' in m)
            return `<span style="background-color:${escapeStyle(
                m.bg
            )}">${acc}</span>`;
        return acc;
    }, textHTML);
}

function escapeHTML(s: string) {
    return s.replace(
        /[&<>"']/g,
        (c) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            }[c]!)
    );
}
function escapeAttr(s: string) {
    return escapeHTML(s);
}
function escapeStyle(s: string) {
    return s.replace(/["'<>]/g, '');
}
