import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImage } from './ResizableImage';

export type ImageAlignment = 'left' | 'center' | 'right';

declare module '@tiptap/extension-image' {
    interface ImageOptions {
        allowAlign: boolean;
    }
}

export const ImageWithAlign = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: (element) => {
                    const width =
                        element.getAttribute('width') || element.style.width;
                    return width ? parseInt(width, 10) : null;
                },
                renderHTML: (attributes) => {
                    if (!attributes.width) {
                        return {};
                    }
                    return {
                        width: attributes.width,
                    };
                },
            },
            textAlign: {
                default: 'center',
                parseHTML: (element) => {
                    return (
                        element.getAttribute('data-text-align') ||
                        element.style.textAlign ||
                        'center'
                    );
                },
                renderHTML: (attributes) => {
                    if (!attributes.textAlign) {
                        return {};
                    }
                    return {
                        'data-text-align': attributes.textAlign,
                    };
                },
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImage);
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setImageAlign:
                (alignment: ImageAlignment) =>
                ({ commands }: { commands: { updateAttributes: (name: string, attrs: Record<string, unknown>) => boolean } }) => {
                    return commands.updateAttributes('image', {
                        textAlign: alignment,
                    });
                },
        };
    },
});

export default ImageWithAlign;
