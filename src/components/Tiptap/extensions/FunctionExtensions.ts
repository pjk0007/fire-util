import { Dropcursor, TrailingNode, UndoRedo } from '@tiptap/extensions';
import Typography from '@tiptap/extension-typography';
import CommandExtension from '@/components/Tiptap/extensions/functions/CommandExtension';
import nodeSuggestion from '@/components/Tiptap/extensions/suggestions/nodeSuggestion';
import TextAlign from '@tiptap/extension-text-align';

export default function FuncionExtensions() {
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
    ];
}
