import { Editor, Extension } from '@tiptap/react';
import { Suggestion } from '@tiptap/suggestion';

export default Extension.create({
    name: 'commandBlock',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({
                    editor,
                    range,
                    props,
                }: {
                    editor: Editor;
                    range: { from: number; to: number };
                    props: Record<string, any>;
                }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});
