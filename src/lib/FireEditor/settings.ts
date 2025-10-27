// blocks
export type FireDoc = { blocks: Block[] };

export type Block =
    | { type: 'paragraph'; children: Inline[] }
    | { type: 'heading'; level: 1 | 2 | 3; children: Inline[] }
    | { type: 'bulleted_list'; items: ListItem[] }
    | { type: 'numbered_list'; items: ListItem[] }
    | { type: 'quote'; children: Inline[] }
    | { type: 'code'; language?: string; text: string };

export type ListItem = { children: Inline[] };

// inlines
export type Inline =
    | { type: 'text'; text: string; marks?: Mark[] }
    | { type: 'link'; href: string; children: Inline[] };

export type Mark =
    | 'bold'
    | 'italic'
    | 'underline'
    | { color: string }
    | { bg: string };
