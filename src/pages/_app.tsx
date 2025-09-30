import { FireChannelProvider } from '@/components/FireProvider/FireChannelProvider';
import { FireAuthProvider } from '@/components/FireProvider/FireAuthProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { FireChatSidebarProvider } from '@/components/FireProvider/FireChatSidebarProvider';
import FireChatSettings from '@/components/FireChat/FireChatSettings';
import { useRouter } from 'next/router';

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// const USER_ID = 'u3C0qmWf8qaiKi4zQHBRGbh9VA63';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <FireAuthProvider>
                <FireChannelProvider
                    defaultChannelId={
                        router.query.channelId as string | undefined
                    }
                >
                    <Component {...pageProps} />
                    <Toaster richColors position="top-center" />
                    <FireChatSettings />
                </FireChannelProvider>
            </FireAuthProvider>
        </ThemeProvider>
    );
}
