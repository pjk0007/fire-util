import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { FireUser } from '@/lib/FireAuth/settings';
import { doc, onSnapshot } from 'firebase/firestore';

interface FireAuthContextProps<U extends FireUser> {
    user?: U | null;
    status: 'success' | 'pending';
}

const FireAuthContext = createContext<FireAuthContextProps<FireUser>>({
    user: null,
    status: 'pending',
});

// export const useFireAuth = () => useContext(FireAuthContext);
export function useFireAuth<U extends FireUser>() {
    return useContext(FireAuthContext) as FireAuthContextProps<U>;
}

interface FireAuthProviderProps {
    children: ReactNode;
}

export function FireAuthProvider<U extends FireUser>({
    children,
}: FireAuthProviderProps) {
    const [user, setUser] = useState<U | null>(null);
    const [status, setStatus] = useState<'success' | 'pending'>('pending');

    useEffect(() => {
        let unsubDoc: (() => void) | undefined;

        const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
            // 기존 문서 구독 해제
            if (unsubDoc) {
                unsubDoc();
                unsubDoc = undefined;
            }

            if (!fbUser) {
                setUser(null);
                setStatus('success');
                return;
            }

            // 로그인되어 있으면 해당 유저 문서 실시간 구독
            const ref = doc(db, 'users', fbUser.uid);
            unsubDoc = onSnapshot(
                ref,
                (snap) => {
                    const data = snap.data() as U | undefined;
                    setUser(data ?? null);
                    setStatus('success');
                },
                (err) => {
                    console.error('user snapshot error', err);
                    setStatus('success');
                }
            );
        });

        return () => {
            unsubAuth();
            if (unsubDoc) unsubDoc();
        };
    }, []);

    return (
        <FireAuthContext.Provider value={{ user, status }}>
            {status !== 'success' ? <></> : children}
        </FireAuthContext.Provider>
    );
}
