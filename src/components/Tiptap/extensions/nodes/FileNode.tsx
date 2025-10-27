import { Button } from '@/components/ui/button';
import {
    mergeAttributes,
    Node,
    NodeViewWrapper,
    ReactNodeViewProps,
    ReactNodeViewRenderer,
} from '@tiptap/react';
import { File, FileUp, Trash } from 'lucide-react';

const FileNode = Node.create({
    name: 'fileNode',
    group: 'block',
    inline: false,
    atom: true,

    addAttributes() {
        return {
            fileName: {
                default: null,
            },
            fileSize: {
                default: null,
            },
            src: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'file-node',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['file-node', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(FileBlock);
    },
});

function FileBlock(props: ReactNodeViewProps<HTMLLabelElement>) {
    const fileName = props.node.attrs.fileName || 'untitled';
    const fileSize = props.node.attrs.fileSize || '0 KB';
    const src = props.node.attrs.src || '#';
    return (
        <NodeViewWrapper
            as="a"
            className="relative group flex gap-2 rounded-sm p-2 bg-secondary/50 hover:bg-secondary transition-colors items-center min-h-12 my-1"
            href={src}
            target="_blank"
            rel="noreferrer"
            style={{
                textDecoration: 'none',
            }}
        >
            <FileUp className="text-foreground" size={20} />
            <div className="flex items-end gap-2">
                <span className="text-foreground font-medium">{fileName}</span>
                <span className="text-xs">{fileSize}</span>
            </div>

            <Button
                variant={'ghost'}
                size={'icon-sm'}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.preventDefault();
                    props.deleteNode();
                }}
            >
                <Trash />
            </Button>
        </NodeViewWrapper>
    );
}

export default FileNode;
