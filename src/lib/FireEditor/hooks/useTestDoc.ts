import { db } from '@/lib/firebase';
import { FireDoc } from '@/lib/FireEditor/settings';
import {
    collection,
    doc,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Content } from '@tiptap/react';

export default function useTestDoc(id: string) {
    const initialContent = {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [],
            },
        ],
    };
    const [content, setContent] = useState<Content>();

    useEffect(() => {
        const q = query(collection(db, 'test'), where('id', '==', id));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newDoc = snapshot.docs[0]?.data() as Content | undefined;
            if (newDoc) {
                setContent(newDoc);
            } else {
                setContent(initialContent);
                // create new doc
                const docRef = doc(db, 'test', id);
                setDoc(docRef, {
                    content: initialContent,
                });
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    function update(newDoc: Content) {
        const docRef = doc(db, 'test', id);
        updateDoc(docRef, {
            content: newDoc,
        });
    }

    return { content, update };
}
