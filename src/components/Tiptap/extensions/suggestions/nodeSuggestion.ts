import { ReactRenderer } from '@tiptap/react';
import { SuggestionProps } from '@tiptap/suggestion';
import updatePosition from '@/components/Tiptap/extensions/suggestions/updatePosition';
import NodeList from '@/components/Tiptap/extensions/suggestions/NodeList';
import Nodes from '@/components/Tiptap/config/nodes';

interface SuggestionComponent {
    element: HTMLElement;
    updateProps: (props: SuggestionProps) => void;
    destroy: () => void;
    ref?: {
        onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
    };
}

export default function nodeSuggestion() {
    return {
        items: ({ query }: { query: string }) => {
            return Nodes.filter(
                (item) =>
                    item.label.toLowerCase().startsWith(query.toLowerCase()) ||
                    item.tags?.some((tag) =>
                        tag.toLowerCase().includes(query.toLowerCase())
                    )
            );
        },

        render: () => {
            let component: SuggestionComponent;

            return {
                onStart: (props: SuggestionProps) => {
                    console.log(props);

                    component = new ReactRenderer(NodeList, {
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
                    if (props.event.key === 'Escape') {
                        component.destroy();
                        component.element.remove();

                        return true;
                    }

                    return component.ref?.onKeyDown({ event: props.event }) ?? false;
                },

                onExit() {
                    component.destroy();
                    component.element.remove();
                },
            };
        },
    };
}
