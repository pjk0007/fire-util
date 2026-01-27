import DOMPurify from 'dompurify';

const purify = DOMPurify.sanitize;

const ALLOWED_TAGS = [
    'a',
    'b',
    'i',
    'u',
    'strong',
    'em',
    'br',
    'p',
    'span',
    'div',
    'img',
    'video',
    'source',
    'iframe',
    'table',
    'tr',
    'td',
    'th',
    'thead',
    'tbody',
    'ol',
    'ul',
    'li',
];
const ALLOWED_ATTR = [
    'href',
    'src',
    'alt',
    'title',
    'target',
    'width',
    'height',
    'controls',
    'allowfullscreen',
    'frameborder',
    'class',
    'style',
    'type',
];
export default function sanitizeHtml(html: string) {
    return purify(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ADD_ATTR: ['allow', 'autoplay', 'muted'], // optional
        ADD_TAGS: [], // 필요시 커스텀 태그 추가
        FORBID_TAGS: ['script'],
        FORBID_ATTR: ['onerror', 'onclick', 'onload'],
    });
}
