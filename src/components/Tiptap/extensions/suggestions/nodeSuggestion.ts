import { Editor, ReactRenderer } from '@tiptap/react';
import updatePosition from '@/components/Tiptap/extensions/suggestions/updatePosition';
import NodeList from '@/components/Tiptap/extensions/suggestions/NodeList';
import Nodes from '@/components/Tiptap/config/nodes';

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
            let component: any;

            return {
                onStart: (props: Record<string, any>) => {
                    console.log(props);

                    component = new ReactRenderer(NodeList, {
                        props,
                        editor: props.editor,
                    });

                    if (!props.clientRect) {
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

                onUpdate(props: Record<string, any>) {
                    component.updateProps(props);

                    if (!props.clientRect) {
                        return;
                    }

                    updatePosition(props.editor, component.element);
                },

                onKeyDown(props: Record<string, any>) {
                    if (props.event.key === 'Escape') {
                        component.destroy();
                        component.element.remove();

                        return true;
                    }

                    return component.ref?.onKeyDown(props);
                },

                onExit() {
                    component.destroy();
                    component.element.remove();
                },
            };
        },
    };
}
