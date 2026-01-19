import { useMemo } from 'react';
import { ClipboardList, Users, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { SurveyResponse, SurveyTemplate } from '../../settings/types';
import { QUESTION_TYPE_RATING } from '../../settings/constants';

interface FireSurveyOverallStatsProps {
    responses: SurveyResponse[];
    templates: SurveyTemplate[];
}

export function FireSurveyOverallStats({
    responses,
    templates,
}: FireSurveyOverallStatsProps) {
    const stats = useMemo(() => {
        const totalResponses = responses.length;
        const uniqueUsers = new Set(responses.map((r) => r.userId)).size;

        // 평점 타입 템플릿들의 평균 계산
        const ratingTemplateIds = templates
            .filter((t) => t.type === QUESTION_TYPE_RATING)
            .map((t) => t.id);

        const ratingResponses = responses.filter((r) =>
            ratingTemplateIds.includes(r.templateId)
        );

        const ratings = ratingResponses
            .map((r) => Number(r.answer.value))
            .filter((v) => !isNaN(v) && v > 0);

        const averageRating =
            ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
                : null;

        return {
            totalResponses,
            uniqueUsers,
            averageRating,
        };
    }, [responses, templates]);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* 총 응답 수 */}
            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <ClipboardList className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">총 응답 수</p>
                        <p className="text-2xl font-bold">{stats.totalResponses}건</p>
                    </div>
                </div>
            </Card>

            {/* 응답 사용자 수 */}
            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">응답 사용자</p>
                        <p className="text-2xl font-bold">{stats.uniqueUsers}명</p>
                    </div>
                </div>
            </Card>

            {/* 평균 만족도 */}
            <Card className="p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                        <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">평균 만족도</p>
                        <p className="text-2xl font-bold">
                            {stats.averageRating !== null
                                ? stats.averageRating.toFixed(1)
                                : '-'}
                            {stats.averageRating !== null && (
                                <span className="text-sm font-normal text-muted-foreground">
                                    {' '}/ 5
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
