import { useFireTracker } from '@/components/FireTracker';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PageA() {
    const { session } = useFireTracker();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Page A</h1>
            <p>Page Views: {session?.pageViews ?? 0}</p>
            <div className="space-x-2">
                <Link href="/tracker">
                    <Button variant="outline">메인으로</Button>
                </Link>
                <Link href="/tracker/page-b">
                    <Button variant="outline">Page B로 이동</Button>
                </Link>
            </div>
        </div>
    );
}
