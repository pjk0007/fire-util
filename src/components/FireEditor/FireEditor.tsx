import FireEditorToolbar from '@/components/FireEditor/FireEditorToolbar';
import useEditorSync from '@/lib/FireEditor/hooks/useEditorSync';
import { FireDoc } from '@/lib/FireEditor/settings';
import { useRef } from 'react';
// import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';

interface FireEditorProps {
    minHeight?: string;
    initialDoc: FireDoc;
}

export default function FireEditor({ minHeight, initialDoc }: FireEditorProps) {
    const editableRef = useRef<HTMLDivElement | null>(null);
    const { docState } = useEditorSync(editableRef, initialDoc);
   

    console.log(docState);

    return (
        <div
            id="fire-editor"
            className="relative w-full h-full"
            style={{ minHeight: minHeight }}
        >
            <div
                style={{ minHeight: minHeight }}
                ref={editableRef}
                className="w-full h-full whitespace-pre-line outline-none"
                contentEditable
                suppressContentEditableWarning
            />
            <FireEditorToolbar
                editableRef={editableRef}
                docState={docState}
            />
        </div>
    );
}
