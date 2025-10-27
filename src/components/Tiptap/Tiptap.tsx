import { useEditor, EditorContent, Content } from '@tiptap/react';
import NodeExtensions from '@/components/Tiptap/extensions/NodeExtensions';
import MarkExtensions from '@/components/Tiptap/extensions/MarkExtensions';
import SelectionMenu from '@/components/Tiptap/extensions/menus/SelectionMenu';
import FunctionExtensions from '@/components/Tiptap/extensions/FunctionExtensions';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { GripVertical, Plus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TIP_TAP_LOCALE } from '@/components/Tiptap/settings';
import TableMenu from '@/components/Tiptap/extensions/menus/TableMenu';
import { memo } from 'react';

const Tiptap = ({
    id,
    defaultContent,
    onUpdate,
    mentionItems,
    className,
    uploadFile,
}: {
    id: string;
    defaultContent: Content;
    onUpdate?: (content: Content) => void;
    mentionItems?: string[];
    className?: string;
    uploadFile?: (
        file: File,
        onProgress?: (event: { progress: number }) => void
    ) => Promise<{ fileName: string; fileSize: string; src: string }>;
}) => {
    console.log('rerender');

    const editor = useEditor({
        extensions: [
            ...NodeExtensions({ mentionItems, uploadFile }),
            ...MarkExtensions(),
            ...FunctionExtensions({
                uploadFile,
            }),
        ],
        content: defaultContent,
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
        // onUpdate: ({ editor }) => {
        //     if (onUpdate) {
        //         onUpdate(editor.getJSON());
        //     }
        // },
        onBlur: ({ editor }) => {
            if (onUpdate) {
                onUpdate(editor.getJSON());
            }
        },
    });

    return (
        <>
            {editor && <SelectionMenu editor={editor} />}
            {editor && <TableMenu editor={editor} />}
            {/* {editor && <CommandMenu editor={editor} />} */}
            {editor && (
                <DragHandle editor={editor} className="flex">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <GripVertical
                                className="text-muted-foreground mt-1.5 mr-0.5 hover:bg-muted rounded-sm cursor-grab px-0 py-0.5"
                                size={20}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="text-center">
                            <strong>
                                {TIP_TAP_LOCALE.DRAG_HANDLE.WITH_DRAG}
                            </strong>{' '}
                            {TIP_TAP_LOCALE.DRAG_HANDLE.MOVE}
                        </TooltipContent>
                    </Tooltip>
                </DragHandle>
            )}
            <EditorContent
                editor={editor}
                className={className ?? 'py-8 px-12'}
            />
        </>
    );
};

export default memo(Tiptap, (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
});
