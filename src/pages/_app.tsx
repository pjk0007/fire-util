import { FireChatProvider } from '@/components/FireProvider/FireChatProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { FireChatSidebarProvider } from '@/components/FireProvider/FireChatSidebarProvider';

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
                    <FireChatSidebarProvider>
                        <Component {...pageProps} />
                        <Toaster richColors position="top-center" />
                    </FireChatSidebarProvider>
                </FireChatProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
