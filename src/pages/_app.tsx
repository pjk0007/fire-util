import { FireChatProvider } from '@/components/provider/FireChatProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// const USER_ID = 'u3C0qmWf8qaiKi4zQHBRGbh9VA63';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <FireChatProvider>
                    <Component {...pageProps} />
                    <Toaster richColors position="top-center" />
                </FireChatProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
