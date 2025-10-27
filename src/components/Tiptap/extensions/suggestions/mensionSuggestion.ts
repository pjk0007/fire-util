import { ReactRenderer } from '@tiptap/react';
import MentionList from './MentionList';
import updatePosition from '@/components/Tiptap/extensions/suggestions/updatePosition';

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
            let component: any;

            return {
                onStart: (props: Record<string, any>) => {
                    console.log(props);

                    component = new ReactRenderer(MentionList, {
                        props,
                        editor: props.editor,
                    });

                    if (!props.clientRect) {
                        return;
                    }

                    component.element.style.position = 'absolute';

                    document.body.appendChild(component.element);

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

                        return true;
                    }

                    return component.ref?.onKeyDown(props);
                },

                onExit() {
                    component.element.remove();
                    component.destroy();
                },
            };
        },
    };
}
