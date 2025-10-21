import { db } from '@/lib/firebase';
import { FireDoc } from '@/lib/FireEditor/settings';
import {
    collection,
    doc,
    onSnapshot,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useTestDoc() {
    const [docData, setDocData] = useState<FireDoc>({
        blocks: [],
    });

    useEffect(() => {
        const q = query(collection(db, 'test'), where('id', '==', 'test'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newDoc = snapshot.docs[0]?.data() as FireDoc;
            if (newDoc) {
                setDocData(newDoc);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    function updateDoc(newDoc: FireDoc) {
        const docRef = doc(collection(db, 'test'), 'test');
        setDoc(docRef, newDoc);
    }
    console.log(docData);

    return { docData, updateDoc };
}
