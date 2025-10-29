import { Editor, Extension } from '@tiptap/react';
import { Suggestion } from '@tiptap/suggestion';

interface CommandProps {
    command: (params: { editor: Editor; range: { from: number; to: number } }) => void;
    [key: string]: unknown;
}

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
                    props: CommandProps;
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
