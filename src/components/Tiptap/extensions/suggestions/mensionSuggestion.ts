import { ReactRenderer } from '@tiptap/react';
import { SuggestionProps } from '@tiptap/suggestion';
import MentionList from './MentionList';
import updatePosition from '@/components/Tiptap/extensions/suggestions/updatePosition';

interface SuggestionComponent {
    element: HTMLElement;
    updateProps: (props: SuggestionProps) => void;
    destroy: () => void;
    ref?: {
        onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
    };
}

export default function mentionSuggestion(items: string[]) {
    return {
        items: ({ query }: { query: string }) => {
            return items
                .filter((item) =>
                    item.toLowerCase().startsWith(query.toLowerCase())
                )
                .slice(0, 5);
        },
        render: () => {
            let component: SuggestionComponent;

            return {
                onStart: (props: SuggestionProps) => {
                    console.log(props);

                    component = new ReactRenderer(MentionList, {
                        props,
                        editor: props.editor,
                    }) as SuggestionComponent;

                    const clientRect = typeof props.clientRect === 'function' 
                        ? props.clientRect() 
                        : props.clientRect;

                    if (!clientRect) {
                        return;
                    }

                    const parent = props.editor.view.dom.parentElement;

                    if (!parent) {
                        return;
                    }

                    component.element.style.position = 'absolute';
                    component.element.style.zIndex = '1000';

                    // document.body.appendChild(component.element);
                    parent.appendChild(component.element);

                    updatePosition(props.editor, component.element);
                },

                onUpdate(props: SuggestionProps) {
                    component.updateProps(props);

                    const clientRect = typeof props.clientRect === 'function' 
                        ? props.clientRect() 
                        : props.clientRect;

                    if (!clientRect) {
                        return;
                    }

                    updatePosition(props.editor, component.element);
                },

                onKeyDown(props: { event: KeyboardEvent }) {
                    if (props.event?.key === 'Escape') {
                        component.destroy();

                        return true;
                    }

                    return component.ref?.onKeyDown({ event: props.event! }) ?? false;
                },

                onExit() {
                    component.element.remove();
                    component.destroy();
                },
            };
        },
    };
}
