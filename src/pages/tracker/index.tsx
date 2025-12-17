import { useFireTracker } from '@/components/FireTracker';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function TrackerTestPage() {
    const { user } = useFireAuth();
    const { trackEvent, session, identify } = useFireTracker();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">FireTracker 테스트</h1>

            {/* 현재 상태 */}
            <Card>
                <CardHeader>
                    <CardTitle>현재 상태</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p>
                        <strong>User:</strong> {user?.id ?? '로그인 안됨'}
                    </p>
                    <p>
                        <strong>Session ID:</strong> {session?.id ?? '없음'}
                    </p>
                    <p>
                        <strong>Visitor ID:</strong> {session?.visitorId ?? '없음'}
                    </p>
                    <p>
                        <strong>Traffic Source:</strong>{' '}
                        {session?.trafficSource ?? '없음'}
                    </p>
                    <p>
                        <strong>Landing Page:</strong>{' '}
                        {session?.landingPage ?? '없음'}
                    </p>
                    <p>
                        <strong>Page Views:</strong> {session?.pageViews ?? 0}
                    </p>
                    <p>
                        <strong>Events:</strong> {session?.events ?? 0}
                    </p>
                </CardContent>
            </Card>

            {/* UTM 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle>UTM 정보</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(session?.utm ?? {}, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            {/* 디바이스 정보 */}
            <Card>
                <CardHeader>
                    <CardTitle>디바이스 정보</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(session?.device ?? {}, null, 2)}
                    </pre>
                </CardContent>
            </Card>

            {/* 이벤트 테스트 버튼 */}
            <Card>
                <CardHeader>
                    <CardTitle>이벤트 테스트</CardTitle>
                </CardHeader>
                <CardContent className="space-x-2 space-y-2">
                    <Button
                        onClick={() => trackEvent('click', 'test_button_1')}
                    >
                        Click 이벤트
                    </Button>
                    <Button
                        onClick={() =>
                            trackEvent('form_submit', 'test_form', {
                                formName: 'contact',
                            })
                        }
                    >
                        Form Submit 이벤트
                    </Button>
                    <Button
                        onClick={() =>
                            trackEvent('purchase', 'test_purchase', {
                                amount: 29000,
                                productId: 'prod_001',
                            })
                        }
                    >
                        Purchase 이벤트
                    </Button>
                    <Button
                        onClick={() =>
                            trackEvent('custom', 'custom_event', {
                                customData: 'test',
                            })
                        }
                    >
                        Custom 이벤트
                    </Button>
                </CardContent>
            </Card>

            {/* 페이지 이동 테스트 */}
            <Card>
                <CardHeader>
                    <CardTitle>페이지 이동 테스트</CardTitle>
                </CardHeader>
                <CardContent className="space-x-2">
                    <Link href="/tracker/page-a">
                        <Button variant="outline">Page A로 이동</Button>
                    </Link>
                    <Link href="/tracker/page-b">
                        <Button variant="outline">Page B로 이동</Button>
                    </Link>
                </CardContent>
            </Card>

            {/* UTM 테스트 링크 */}
            <Card>
                <CardHeader>
                    <CardTitle>UTM 테스트 링크</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-gray-500">
                        아래 링크를 새 탭에서 열어 UTM 파라미터 테스트
                    </p>
                    <pre className="bg-gray-100 p-4 rounded text-sm break-all">
                        {typeof window !== 'undefined'
                            ? `${window.location.origin}/tracker?utm_source=google&utm_medium=cpc&utm_campaign=test_campaign`
                            : ''}
                    </pre>
                </CardContent>
            </Card>

            {/* Identify 테스트 */}
            {!user && (
                <Card>
                    <CardHeader>
                        <CardTitle>Identify 테스트</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => identify('test_user_123')}
                            variant="secondary"
                        >
                            테스트 유저로 Identify
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
