import { useState, useMemo } from 'react';
import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Loader2, ChevronDown, ChevronRight, Filter, Calendar } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useFireSurvey } from '../../contexts/FireSurveyProvider';
import { useFireSurveyTemplates } from '../../hooks/useFireSurveyTemplates';
import { useFireSurveyResponses } from '../../hooks/useFireSurveyResponses';
import { useFireSurveyStats } from '../../hooks/useFireSurveyStats';
import { FIRE_SURVEY_LOCALE, SURVEY_TYPES } from '../../settings/constants';
import { FireSurveyResponseTable } from './FireSurveyResponseTable';
import { FireSurveyResponseDetail } from './FireSurveyResponseDetail';
import { FireSurveyStats } from '../FireSurveyStats/FireSurveyStats';
import type { SurveyType } from '../../settings/types';
import type { DateRange } from 'react-day-picker';

type PeriodFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

export function FireSurveyResponseList() {
    const { filters, updateFilter, selectedResponse, setSelectedResponse } =
        useFireSurvey();
    const { templates } = useFireSurveyTemplates();
    const { responses, isLoading } = useFireSurveyResponses(filters);
    const [showStats, setShowStats] = useState(true);
    const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const selectedTemplate = filters.templateId
        ? templates.find((t) => t.id === filters.templateId) || null
        : null;

    const { stats } = useFireSurveyStats(selectedTemplate, responses);

    // 기간 필터링된 응답
    const filteredResponses = useMemo(() => {
        if (periodFilter === 'all') return responses;

        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        switch (periodFilter) {
            case 'today':
                startDate = startOfDay(now);
                endDate = endOfDay(now);
                break;
            case 'week':
                startDate = startOfWeek(now, { locale: ko });
                endDate = endOfWeek(now, { locale: ko });
                break;
            case 'month':
                startDate = startOfMonth(now);
                endDate = endOfMonth(now);
                break;
            case 'custom':
                if (!dateRange?.from) return responses;
                startDate = startOfDay(dateRange.from);
                endDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
                break;
            default:
                return responses;
        }

        return responses.filter((response) => {
            const submittedAt = response.submittedAt?.toDate ? response.submittedAt.toDate() : new Date();
            return submittedAt >= startDate && submittedAt <= endDate;
        });
    }, [responses, periodFilter, dateRange]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const formatDateRange = () => {
        if (!dateRange?.from) return '날짜 선택';
        if (!dateRange.to) return dateRange.from.toLocaleDateString('ko-KR');
        return `${dateRange.from.toLocaleDateString('ko-KR')} - ${dateRange.to.toLocaleDateString('ko-KR')}`;
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 flex-wrap items-end p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground self-center">
                    <Filter className="h-4 w-4" />
                    필터
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">질문</Label>
                    <Select
                        value={filters.templateId || 'all'}
                        onValueChange={(value) =>
                            updateFilter('templateId', value === 'all' ? undefined : value)
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue
                                placeholder={FIRE_SURVEY_LOCALE.RESPONSE.FILTER_TEMPLATE}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {FIRE_SURVEY_LOCALE.RESPONSE.ALL}
                            </SelectItem>
                            {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                    {template.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">설문 타입</Label>
                    <Select
                        value={filters.surveyType || 'all'}
                        onValueChange={(value) =>
                            updateFilter(
                                'surveyType',
                                value === 'all' ? undefined : (value as SurveyType)
                            )
                        }
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue
                                placeholder={FIRE_SURVEY_LOCALE.RESPONSE.FILTER_TYPE}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {FIRE_SURVEY_LOCALE.RESPONSE.ALL}
                            </SelectItem>
                            {SURVEY_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {FIRE_SURVEY_LOCALE.SURVEY_TYPES[type]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">기간</Label>
                    <div className="flex gap-2">
                        <Select
                            value={periodFilter}
                            onValueChange={(value) => {
                                setPeriodFilter(value as PeriodFilter);
                                if (value !== 'custom') {
                                    setDateRange(undefined);
                                }
                            }}
                        >
                            <SelectTrigger className="w-28">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체</SelectItem>
                                <SelectItem value="today">오늘</SelectItem>
                                <SelectItem value="week">이번 주</SelectItem>
                                <SelectItem value="month">이번 달</SelectItem>
                                <SelectItem value="custom">날짜 선택</SelectItem>
                            </SelectContent>
                        </Select>
                        {periodFilter === 'custom' && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-56 justify-start text-left font-normal',
                                            !dateRange && 'text-muted-foreground'
                                        )}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {formatDateRange()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                        locale={ko}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
                <div className="flex-1" />
                <div className="text-sm text-muted-foreground font-medium self-center">
                    {FIRE_SURVEY_LOCALE.RESPONSE.TOTAL_RESPONSES(filteredResponses.length)}
                </div>
            </div>

            {/* Template Stats Section - 템플릿 선택 시에만 표시 */}
            {filters.templateId && stats && (
                <div className="border rounded-lg overflow-hidden">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="w-full p-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                        {showStats ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                        {FIRE_SURVEY_LOCALE.STATS.TITLE}
                    </button>
                    {showStats && (
                        <div className="p-4 pt-0 border-t">
                            <FireSurveyStats stats={stats} />
                        </div>
                    )}
                </div>
            )}

            {/* Response Table */}
            <div className="border rounded-lg overflow-hidden">
                <FireSurveyResponseTable
                    responses={filteredResponses}
                    onSelectResponse={setSelectedResponse}
                />
            </div>

            {/* Response Detail Dialog */}
            {selectedResponse && (
                <FireSurveyResponseDetail
                    response={selectedResponse}
                    open={!!selectedResponse}
                    onOpenChange={(open) => !open && setSelectedResponse(null)}
                />
            )}
        </div>
    );
}
