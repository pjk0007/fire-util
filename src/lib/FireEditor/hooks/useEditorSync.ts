import { useEffect, useRef, useState } from 'react';
import sanitizeHtml from '@/lib/FireChat/utils/sanitizeHtml';
import { htmlToDoc } from '@/lib/FireEditor/utils/htmlToDoc';
import { docToHTML } from '@/lib/FireEditor/utils/docToHTML';
import { FireDoc } from '@/lib/FireEditor/settings';

export type UseEditorSyncOptions = {
    debounceMs?: number;
};

export function useEditorSync(
    editableRef: React.RefObject<HTMLElement | null>,
    incomingDoc: FireDoc,
    opts?: UseEditorSyncOptions
) {
    const [docState, setDocState] = useState<FireDoc>(incomingDoc);
    const latestDocRef = useRef<FireDoc>(incomingDoc);
    const isApplyingRef = useRef(false);
    const observerTimerRef = useRef<number | null>(null);
    const debounceMs = opts?.debounceMs ?? 1000;
    // This hook only synchronizes the DOM <-> Doc model.

    // incoming doc -> DOM
    useEffect(() => {
        setDocState(incomingDoc);
        latestDocRef.current = incomingDoc;
        const el = editableRef.current;
        if (el) {
            const html = docToHTML(incomingDoc);
            if (el.innerHTML !== html) {
                // isApplyingRef.current = true;
                el.innerHTML = html;
                // window.requestAnimationFrame(() => {
                //     isApplyingRef.current = false;
                // });
            }
        }
    }, [incomingDoc, editableRef]);

    // observe DOM changes -> docState (keeps model in sync with editable DOM)
    useEffect(() => {
        const el = editableRef.current;
        if (!el) return;

        const mo = new MutationObserver(() => {            
            if (isApplyingRef.current) return;
            if (observerTimerRef.current)
                window.clearTimeout(observerTimerRef.current);
            observerTimerRef.current = window.setTimeout(() => {
                try {
                    const rawHtml = el.innerHTML;
                    const safeHtml = sanitizeHtml(rawHtml);
                    const newDoc = htmlToDoc(safeHtml);
                    const prev = latestDocRef.current;
                    const same = JSON.stringify(prev) === JSON.stringify(newDoc);
                    if (!same) {
                        latestDocRef.current = newDoc;
                        setDocState(newDoc);
                    }
                } catch (err) {
                    // ignore
                }

                observerTimerRef.current = null;
            }, debounceMs);
        });

        mo.observe(el, { childList: true, characterData: true, subtree: true });

        const onBlur = () => {
            if (observerTimerRef.current) {
                window.clearTimeout(observerTimerRef.current);
                observerTimerRef.current = null;
            }
            try {
                const rawHtml = el.innerHTML;
                const safeHtml = sanitizeHtml(rawHtml);
                const newDoc = htmlToDoc(safeHtml);
                const prev = latestDocRef.current;
                const same = JSON.stringify(prev) === JSON.stringify(newDoc);
                if (!same) {
                    latestDocRef.current = newDoc;
                    setDocState(newDoc);
                }
            } catch (err) {
                // ignore
            }
        };

        el.addEventListener('blur', onBlur);

        return () => {
            mo.disconnect();
            el.removeEventListener('blur', onBlur);
            if (observerTimerRef.current) {
                window.clearTimeout(observerTimerRef.current);
                observerTimerRef.current = null;
            }
        };
    }, [editableRef, debounceMs]);

    return { docState, setDocState };
}

export default useEditorSync;
