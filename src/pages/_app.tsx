import { FireChatProvider } from '@/components/FireChat/FireChatProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import { auth } from '@/lib/firebase';
import '@/styles/globals.css';
import { onAuthStateChanged } from 'firebase/auth';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';

// const USER_ID = 'u3C0qmWf8qaiKi4zQHBRGbh9VA63';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <FireChatProvider>
                <Component {...pageProps} />
                <Toaster richColors position="top-center" />
            </FireChatProvider>
        </AuthProvider>
    );
}
