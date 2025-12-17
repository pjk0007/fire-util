import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useSessionsThisMonth, useEventsThisMonth } from '@/components/FireTracker/hooks';
import {
    useConversionAnalysis,
    GroupingCriteria,
    ConversionGoal,
} from '@/components/FireTracker/hooks/useConversionAnalysis';

type Period = 'week' | 'month';

const GROUPING_OPTIONS: { value: GroupingCriteria; label: string }[] = [
    { value: 'utm_source_medium', label: 'UTM Source / Medium' },
    { value: 'landing_page', label: '랜딩 페이지' },
    { value: 'device', label: '디바이스' },
    { value: 'traffic_source', label: '유입 채널' },
];

const GOAL_OPTIONS: { value: ConversionGoal; label: string; needsValue: boolean }[] = [
    { value: 'signup', label: '회원가입 (로그인)', needsValue: false },
    { value: 'purchase', label: '구매', needsValue: false },
    { value: 'page_visit', label: '특정 페이지 방문', needsValue: true },
    { value: 'custom_event', label: '커스텀 이벤트', needsValue: true },
];

export default function FireTrackerConversion() {
    const [period, setPeriod] = useState<Period>('month');
    const [groupBy, setGroupBy] = useState<GroupingCriteria>('utm_source_medium');
    const [goal, setGoal] = useState<ConversionGoal>('signup');
    const [goalValue, setGoalValue] = useState('');

    const { data: sessions, isLoading: loadingSessions } = useSessionsThisMonth();
    const { data: events, isLoading: loadingEvents } = useEventsThisMonth();

    const selectedGoalOption = GOAL_OPTIONS.find((o) => o.value === goal);
    const needsValue = selectedGoalOption?.needsValue ?? false;

    const results = useConversionAnalysis(sessions, events, {
        groupBy,
        goal,
        goalValue: needsValue ? goalValue : undefined,
    });

    const isLoading = loadingSessions || loadingEvents;

    // 전체 통계
    const totalVisitors = results.reduce((sum, r) => sum + r.totalVisitors, 0);
    const totalConverted = results.reduce((sum, r) => sum + r.convertedVisitors, 0);
    const overallRate = totalVisitors > 0 ? (totalConverted / totalVisitors) * 100 : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>전환율 분석</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant={period === 'week' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('week')}
                        >
                            이번 주
                        </Button>
                        <Button
                            variant={period === 'month' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod('month')}
                        >
                            이번 달
                        </Button>
                    </div>
                </div>

                {/* 설정 영역 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <Label className="text-sm text-gray-500 mb-2 block">
                            그룹 기준
                        </Label>
                        <Select
                            value={groupBy}
                            onValueChange={(v) => setGroupBy(v as GroupingCriteria)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GROUPING_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm text-gray-500 mb-2 block">
                            전환 목표
                        </Label>
                        <Select
                            value={goal}
                            onValueChange={(v) => setGoal(v as ConversionGoal)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GOAL_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {needsValue && (
                        <div>
                            <Label className="text-sm text-gray-500 mb-2 block">
                                {goal === 'page_visit' ? '페이지 URL 포함 문자열' : '이벤트 이름'}
                            </Label>
                            <Input
                                value={goalValue}
                                onChange={(e) => setGoalValue(e.target.value)}
                                placeholder={
                                    goal === 'page_visit'
                                        ? '/checkout, /thank-you'
                                        : 'button_click, form_submit'
                                }
                            />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="py-8 text-center text-gray-500">로딩 중...</div>
                ) : results.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        데이터가 없습니다
                    </div>
                ) : (
                    <>
                        {/* 전체 요약 */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-500">총 방문자</p>
                                    <p className="text-2xl font-bold">{totalVisitors}명</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">전환 수</p>
                                    <p className="text-2xl font-bold">{totalConverted}명</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">전체 전환율</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {overallRate.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 그룹별 결과 테이블 */}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {GROUPING_OPTIONS.find((o) => o.value === groupBy)?.label}
                                    </TableHead>
                                    <TableHead className="text-right">방문자</TableHead>
                                    <TableHead className="text-right">전환</TableHead>
                                    <TableHead className="text-right">전환율</TableHead>
                                    <TableHead className="w-40">비율</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((result) => (
                                    <TableRow key={result.group}>
                                        <TableCell className="font-medium">
                                            {result.group}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {result.totalVisitors}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {result.convertedVisitors}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {result.conversionRate.toFixed(1)}%
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-2 bg-gray-100 rounded">
                                                <div
                                                    className="h-2 bg-green-500 rounded"
                                                    style={{
                                                        width: `${Math.min(result.conversionRate, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
