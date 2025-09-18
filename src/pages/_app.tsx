import { FireChatProvider } from '@/components/FireChat/FireChatProvider';
import { auth } from '@/lib/firebase';
import '@/styles/globals.css';
import { onAuthStateChanged } from 'firebase/auth';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';

// const USER_ID = 'u3C0qmWf8qaiKi4zQHBRGbh9VA63';

export default function App({ Component, pageProps }: AppProps) {
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        let unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId('');
            }
        });
        return () => {
            unsub();
        };
    }, []);

    return (
        <FireChatProvider userId={userId}>
            <Component {...pageProps} />
        </FireChatProvider>
    );
}
