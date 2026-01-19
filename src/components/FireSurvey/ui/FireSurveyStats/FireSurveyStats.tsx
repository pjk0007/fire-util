import { ClipboardList, Star, PieChart, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FIRE_SURVEY_LOCALE, QUESTION_TYPE_RATING, QUESTION_TYPE_TEXT } from '../../settings/constants';
import type { TemplateStats } from '../../settings/types';

interface FireSurveyStatsProps {
    stats: TemplateStats;
}

export function FireSurveyStats({ stats }: FireSurveyStatsProps) {
    const isRating = stats.questionType === QUESTION_TYPE_RATING;
    const isText = stats.questionType === QUESTION_TYPE_TEXT;
    const isChoice = !isRating && !isText;

    return (
        <div className="space-y-6 pt-4">
            {/* 요약 카드 그리드 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* 총 응답 수 */}
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {FIRE_SURVEY_LOCALE.STATS.TOTAL_RESPONSES}
                            </p>
                            <p className="text-2xl font-bold">{stats.totalResponses}건</p>
                        </div>
                    </div>
                </Card>

                {/* 평균 평점 (Rating인 경우) */}
                {isRating && (
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Star className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    {FIRE_SURVEY_LOCALE.STATS.AVG_RATING}
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.averageRating?.toFixed(1) || '-'}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {' '}/ 5
                                    </span>
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* 선택지 수 (Choice인 경우) */}
                {isChoice && stats.optionCounts && (
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <PieChart className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">선택지 수</p>
                                <p className="text-2xl font-bold">{stats.optionCounts.length}개</p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* 텍스트 응답 수 (Text인 경우) */}
                {isText && stats.textResponses && (
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">텍스트 응답</p>
                                <p className="text-2xl font-bold">{stats.textResponses.length}건</p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Rating 분포 차트 */}
            {isRating && stats.ratingDistribution && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            {FIRE_SURVEY_LOCALE.STATS.BY_RATING}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.ratingDistribution
                                .slice()
                                .reverse()
                                .map((item) => (
                                    <div
                                        key={item.rating}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        <span className="w-12 font-medium">{item.rating}점</span>
                                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full transition-all"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="w-20 text-right text-muted-foreground">
                                            {item.count}건 ({item.percentage.toFixed(0)}%)
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Choice 분포 차트 */}
            {isChoice && stats.optionCounts && stats.optionCounts.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-purple-500" />
                            {FIRE_SURVEY_LOCALE.STATS.BY_CHOICE}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.optionCounts.map((option) => (
                                <div
                                    key={option.label}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <span className="min-w-[100px] max-w-[200px] truncate font-medium">
                                        {option.label}
                                    </span>
                                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all"
                                            style={{
                                                width: `${option.percentage}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="w-24 text-right text-muted-foreground">
                                        {option.count}건 ({option.percentage.toFixed(1)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Text 응답 목록 */}
            {isText && stats.textResponses && stats.textResponses.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-green-500" />
                            텍스트 응답
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {stats.textResponses.map((text, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-muted/50 rounded-lg text-sm border"
                                >
                                    {text}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
