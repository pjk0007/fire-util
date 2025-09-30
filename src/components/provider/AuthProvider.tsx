import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FcUser } from '@/lib/FireAuth/settings';
import getUser from '@/lib/FireAuth/api/getUser';

interface AuthContextProps<U extends FcUser> {
    user?: U | null;
    status: 'success' | 'pending';
}

const AuthContext = createContext<AuthContextProps<FcUser>>({
    user: null,
    status: 'pending',
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider<U extends FcUser>({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<U | null>(null);
    const [status, setStatus] = useState<'success' | 'pending'>('pending');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
                setStatus('success');
                return;
            }
            const userData = await getUser<U>({
                id: user.uid,
            });
            setUser(userData);
            setStatus('success');
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, status }}>
            {status !== 'success' ? <></> : children}
        </AuthContext.Provider>
    );
}
