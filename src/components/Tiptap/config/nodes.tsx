import {
    CodeXml,
    Heading1,
    Heading2,
    Heading3,
    Image,
    Info,
    List,
    ListCollapse,
    ListOrdered,
    ListTodo,
    Quote,
    SeparatorHorizontal,
    Table,
    TvMinimalPlay,
    Type,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';

export interface INodeItem {
    group: 'basic' | 'media';
    onlyCommand?: boolean;
    label: string;
    tags?: string[];
    type: string;
    attrs?: Record<string, unknown>;
    icon: React.ReactNode;
    onSelect: (editor: Editor) => void;
    shortcut?: {
        macos: string;
        windows: string;
    };
    prefix?: string;
}

const Nodes: INodeItem[] = [
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.PARAGRAPH,
        tags: ['text', '텍스트', 'paragraph'],
        type: 'paragraph',
        icon: <Type />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().setParagraph().run();
        },
        shortcut: {
            macos: '⌘⌥0',
            windows: 'Ctrl+Alt+0',
        },
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.HEADING1,
        tags: ['heading1', '헤딩1', 'title1'],
        type: 'heading',
        attrs: { level: 1 },
        icon: <Heading1 />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().setHeading({ level: 1 }).run();
        },
        shortcut: {
            macos: '⌘⌥1',
            windows: 'Ctrl+Alt+1',
        },
        prefix: '#',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.HEADING2,
        tags: ['heading2', '헤딩2', 'title2'],
        type: 'heading',
        attrs: { level: 2 },
        icon: <Heading2 />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().setHeading({ level: 2 }).run();
        },
        shortcut: {
            macos: '⌘⌥2',
            windows: 'Ctrl+Alt+2',
        },
        prefix: '##',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.HEADING3,
        tags: ['heading3', '헤딩3', 'title3'],
        type: 'heading',
        attrs: { level: 3 },
        icon: <Heading3 />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().setHeading({ level: 3 }).run();
        },
        shortcut: {
            macos: '⌘⌥3',
            windows: 'Ctrl+Alt+3',
        },
        prefix: '###',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.BULLET_LIST,
        tags: ['bulletList', '글머리 기호 목록'],
        type: 'bulletList',
        icon: <List />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().toggleBulletList().run();
        },
        shortcut: {
            macos: '⌘⇧8',
            windows: 'Ctrl+Shift+8',
        },
        prefix: '- ',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.ORDERED_LIST,
        tags: ['orderedList', '번호 매기기 목록'],
        type: 'orderedList',
        icon: <ListOrdered />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().toggleOrderedList().run();
        },
        shortcut: {
            macos: '⌘⇧7',
            windows: 'Ctrl+Shift+7',
        },
        prefix: '1. ',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.TASK_LIST,
        tags: ['taskList', '할일 목록', 'todoList'],
        type: 'taskList',
        icon: <ListTodo />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().toggleTaskList().run();
        },
        shortcut: {
            macos: '⌘⇧9',
            windows: 'Ctrl+Shift+9',
        },
        prefix: '[] ',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.SUMMARY,
        tags: ['summary', '요약', '토글', 'toggle'],
        type: 'details',
        icon: <ListCollapse />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().setDetails().run();
        },
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.CODE_BLOCK,
        tags: ['codeBlock', '코드 블록'],
        type: 'codeBlock',
        icon: <CodeXml />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().toggleCodeBlock().run();
        },
        shortcut: {
            macos: '⌘⇧C',
            windows: 'Ctrl+Shift+C',
        },
        prefix: '```',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.BLOCKQUOTE,
        tags: ['blockquote', '인용문'],
        type: 'blockquote',
        icon: <Quote />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().toggleBlockquote().run();
        },
        shortcut: {
            macos: '⌘⇧B',
            windows: 'Ctrl+Shift+B',
        },
        prefix: '> ',
    },
    {
        group: 'basic',
        label: TIP_TAP_LOCALE.NODE_LABEL.CALLOUT,
        tags: ['callout', '콜아웃', 'aside', '알림', 'notice'],
        type: 'aside',
        icon: <Info />,
        onSelect: (editor: Editor) => {
            // @ts-ignore - custom command
            editor.chain().focus().toggleAside({ type: 'info' }).run();
        },
        shortcut: {
            macos: '⌘⇧C',
            windows: 'Ctrl+Shift+C',
        },
    },
    {
        group: 'basic',
        onlyCommand: true,
        label: TIP_TAP_LOCALE.NODE_LABEL.HORIZONTAL_RULE,
        tags: ['horizontalRule', '구분선', 'separator'],
        type: 'horizontalRule',
        icon: <SeparatorHorizontal />,
        onSelect: (editor: Editor) => {
            editor.commands.setHorizontalRule();
        },
        prefix: '---',
    },
    {
        group: 'basic',
        onlyCommand: true,
        label: TIP_TAP_LOCALE.NODE_LABEL.TABLE,
        tags: ['table', '표', '테이블'],
        type: 'table',
        icon: <Table />,
        onSelect: (editor: Editor) => {
            editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: false })
                .run();
        },
    },
    {
        group: 'media',
        onlyCommand: true,
        label: TIP_TAP_LOCALE.NODE_LABEL.IMAGE,
        tags: ['image', '사진', '그림'],
        type: 'image',
        // eslint-disable-next-line jsx-a11y/alt-text
        icon: <Image />,
        onSelect: (editor: Editor) => {
            editor.chain().focus().setImageUploadNode().run();
        },
    },
    {
        group: 'media',
        onlyCommand: true,
        label: TIP_TAP_LOCALE.NODE_LABEL.YOUTUBE,
        tags: ['youtube', '유튜브'],
        type: 'youtube',
        icon: <TvMinimalPlay />,
        onSelect: (editor: Editor) => {
            const url = prompt(TIP_TAP_LOCALE.NODE_LABEL.INPUT_YOUTUBE_URL);
            if (url) {
                editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }
        },
    },
];

export default Nodes;
