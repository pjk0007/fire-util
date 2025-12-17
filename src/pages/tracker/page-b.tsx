import { useFireTracker } from '@/components/FireTracker';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PageB() {
    const { session } = useFireTracker();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Page B</h1>
            <p>Page Views: {session?.pageViews ?? 0}</p>
            <div className="space-x-2">
                <Link href="/tracker">
                    <Button variant="outline">메인으로</Button>
                </Link>
                <Link href="/tracker/page-a">
                    <Button variant="outline">Page A로 이동</Button>
                </Link>
            </div>
        </div>
    );
}
