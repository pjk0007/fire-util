import { FireChannelProvider } from "@/components/FireChannel/context/FireChannelProvider";
import { FireAuthProvider } from '@/components/FireProvider/FireAuthProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import FireChatSettings from "@/components/FireChat/ui/FireChatSettings";
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FireTrackerProvider } from '@/components/FireTracker';

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// const USER_ID = 'u3C0qmWf8qaiKi4zQHBRGbh9VA63';

export default function App({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();
    const router = useRouter();
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <FireAuthProvider>
                    {/* <FireTrackerProvider> */}
                        <FireChannelProvider
                            defaultChannelId={
                                router.query.channelId as string | undefined
                            }
                        >
                            <Component {...pageProps} />
                            <Toaster richColors position="top-center" />
                            <FireChatSettings />
                        </FireChannelProvider>
                    {/* </FireTrackerProvider> */}
                </FireAuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
