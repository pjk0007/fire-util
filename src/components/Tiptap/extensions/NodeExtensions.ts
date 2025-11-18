import { ReactNodeViewRenderer, Extensions } from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
import {
    BulletList,
    ListItem,
    OrderedList,
    TaskItem,
    TaskList,
} from '@tiptap/extension-list';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import CodeBlock from '@/components/Tiptap/extensions/nodes/CodeBlock';
import {
    Details,
    DetailsContent,
    DetailsSummary,
} from '@tiptap/extension-details';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import mentionSuggestion from '@/components/Tiptap/extensions/suggestions/mensionSuggestion';
import { TableKit } from '@tiptap/extension-table';
import Youtube from '@tiptap/extension-youtube';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import FileNode from '@/components/Tiptap/extensions/nodes/FileNode';
import { ImageUploadNode } from '@/components/Tiptap/extensions/nodes/image-upload-node';
import { toast } from 'sonner';

const lowlight = createLowlight(all);

export default function NodeExtensions({
    mentionItems,
    uploadFile,
    imageMaxSize = 5 * 1024 * 1024,
}: {
    mentionItems?: string[];
    uploadFile?: (
        file: File,
        onProgress?: (event: { progress: number }) => void
    ) => Promise<{ fileName: string; fileSize: string; src: string }>;
    imageMaxSize?: number;
}): Extensions {
    return [
        Document,
        Paragraph,
        Text,
        Blockquote,
        BulletList,
        OrderedList,
        ListItem,
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        CodeBlockLowlight.extend({
            addNodeView() {
                return ReactNodeViewRenderer(CodeBlock);
            },
        }).configure({
            enableTabIndentation: true,
            tabSize: 2,
            lowlight,
        }),
        Details,
        DetailsSummary,
        DetailsContent,
        Placeholder.configure({
            placeholder: ({ node }) => {
                if (node.type.name === 'details') {
                    return '토글';
                } else if (node.type.name === 'detailsContent') {
                    return '내용을 입력하세요...';
                } else if (node.type.name === 'paragraph') {
                    return "명령어 사용 시에는 '/'를 누르세요. 멘션 기능은 '@'로 시작합니다.";
                } else if (
                    node.type.name === 'heading' &&
                    node.attrs.level === 1
                ) {
                    return TIP_TAP_LOCALE.NODE_LABEL.HEADING1;
                } else if (
                    node.type.name === 'heading' &&
                    node.attrs.level === 2
                ) {
                    return TIP_TAP_LOCALE.NODE_LABEL.HEADING2;
                } else if (
                    node.type.name === 'heading' &&
                    node.attrs.level === 3
                ) {
                    return TIP_TAP_LOCALE.NODE_LABEL.HEADING3;
                } else if (
                    node.type.name === 'bulletList' ||
                    node.type.name === 'orderedList'
                ) {
                    return TIP_TAP_LOCALE.NODE_LABEL.LIST;
                } else if (node.type.name === 'taskList') {
                    return `     ${TIP_TAP_LOCALE.NODE_LABEL.TASK}`;
                } else if (node.type.name === 'blockquote') {
                    return TIP_TAP_LOCALE.NODE_LABEL.BLOCKQUOTE;
                }
                return '';
            },
        }),
        Heading.configure({
            levels: [1, 2, 3],
        }),
        HorizontalRule,
        Image,
        Mention.configure({
            HTMLAttributes: {
                class: 'mention',
            },
            suggestion: mentionSuggestion(mentionItems || []),
        }),
        TableKit.configure({
            table: {
                allowTableNodeSelection: true,
                resizable: true,
            },
        }),
        Youtube.configure({
            nocookie: true,
        }),
        FileNode,
        ImageUploadNode.configure({
            limit: 3,
            maxSize: imageMaxSize,
            upload: async (
                file: File,
                onProgress?: (event: { progress: number }) => void
            ) => {
                if (!uploadFile) {
                    throw new Error('Upload function is not provided');
                }
                const { src } = await uploadFile(file, onProgress);
                return src;
            },
            onError: (error) => {
                toast.error(`이미지 업로드 실패: ${error.message}`);
            },
            onSuccess: (url) => console.log('Upload successful:', url),
        }),
    ];
}
