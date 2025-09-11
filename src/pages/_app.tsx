import { FireChatProvider } from '@/components/FireChat/FireChatProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

const USER_ID = 'u3C0qmWf8qaiKi4zQHBRGbh9VA63';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <FireChatProvider userId={USER_ID}>
            <Component {...pageProps} />
        </FireChatProvider>
    );
}
