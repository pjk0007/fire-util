import { Dropcursor, TrailingNode, UndoRedo } from '@tiptap/extensions';
import Typography from '@tiptap/extension-typography';
import CommandExtension from '@/components/Tiptap/extensions/functions/CommandExtension';
import nodeSuggestion from '@/components/Tiptap/extensions/suggestions/nodeSuggestion';
import TextAlign from '@tiptap/extension-text-align';
import FileHandler from '@tiptap/extension-file-handler';
import isImageFile from '@/lib/FireUtil/isImageFile';

export default function FunctionExtensions({
    uploadFile,
}: {
    uploadFile?: (
        file: File
    ) => Promise<{ fileName: string; fileSize: string; src: string }>;
}) {
    return [
        Dropcursor.configure({
            color: '#e4effb',
            width: 2,
        }),
        TrailingNode.configure({
            notAfter: [],
        }),
        Typography,
        UndoRedo,
        CommandExtension.configure({
            suggestion: nodeSuggestion(),
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        FileHandler.configure({
            onDrop(editor, files, pos) {
                if (!uploadFile) return;
                Array.from(files).forEach(async (file) => {
                    const { fileName, fileSize, src } = await uploadFile(file);
                    if (isImageFile(file)) {
                        editor
                            .chain()
                            .insertContentAt(pos, {
                                type: 'image',
                                attrs: {
                                    src,
                                    alt: fileName,
                                },
                            })
                            .focus()
                            .run();
                    } else {
                        editor
                            .chain()
                            .insertContentAt(pos, {
                                type: 'fileNode',
                                attrs: {
                                    fileName,
                                    fileSize,
                                    src,
                                },
                            })
                            .focus()
                            .run();
                    }
                });
            },
            onPaste(editor, files) {
                if (!uploadFile) return;
                console.log(files);

                if (!files || files.length === 0) {
                    return;
                }
                Array.from(files).forEach(async (file) => {
                    const { fileName, fileSize, src } = await uploadFile(file);
                    if (isImageFile(file)) {
                        console.log(fileName);
                        editor
                            .chain()
                            .insertContentAt(editor.state.selection.anchor, {
                                type: 'image',
                                attrs: {
                                    src,
                                    alt: fileName,
                                },
                            })
                            .focus()
                            .run();
                    } else {
                        console.log(fileName);
                        console.log('chain file');

                        editor
                            .chain()

                            .insertContentAt(editor.state.selection.anchor, {
                                type: 'fileNode',
                                attrs: {
                                    fileName,
                                    fileSize,
                                    src,
                                },
                            })
                            .focus()
                            .run();
                    }
                });
            },
        }),
    ];
}
