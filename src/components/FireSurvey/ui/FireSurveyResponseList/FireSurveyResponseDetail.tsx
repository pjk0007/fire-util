import { Star } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FIRE_SURVEY_LOCALE } from '../../settings/constants';
import type { SurveyResponse, SurveyAnswer } from '../../settings/types';

interface FireSurveyResponseDetailProps {
    response: SurveyResponse;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FireSurveyResponseDetail({
    response,
    open,
    onOpenChange,
}: FireSurveyResponseDetailProps) {
    const formatDate = (timestamp: { toDate: () => Date } | Date) => {
        const date = 'toDate' in timestamp ? timestamp.toDate() : timestamp;
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const renderAnswer = (answer: SurveyAnswer) => {
        if (answer.questionType === 'rating') {
            const rating = Number(answer.value);
            return (
                <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${
                                i < rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                            }`}
                        />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                        ({rating}점)
                    </span>
                </div>
            );
        }

        if (Array.isArray(answer.value)) {
            return (
                <div className="flex flex-wrap gap-1">
                    {answer.value.map((v, i) => (
                        <Badge key={i} variant="secondary">
                            {v}
                        </Badge>
                    ))}
                </div>
            );
        }

        return <span>{String(answer.value)}</span>;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>{FIRE_SURVEY_LOCALE.RESPONSE.DETAIL}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4">
                        {/* Response Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">
                                    {FIRE_SURVEY_LOCALE.TABLE.USER}:
                                </span>{' '}
                                <span className="font-medium">
                                    {response.userName || '-'}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    {FIRE_SURVEY_LOCALE.TABLE.EMAIL}:
                                </span>{' '}
                                <span>{response.userEmail || '-'}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    {FIRE_SURVEY_LOCALE.RESPONSE.FILTER_TEMPLATE}:
                                </span>{' '}
                                <span>{response.templateTitle}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    {FIRE_SURVEY_LOCALE.TABLE.SURVEY_TYPE}:
                                </span>{' '}
                                <Badge variant="secondary">
                                    {FIRE_SURVEY_LOCALE.SURVEY_TYPES[response.surveyType]}
                                </Badge>
                            </div>
                            <div className="col-span-2">
                                <span className="text-muted-foreground">
                                    {FIRE_SURVEY_LOCALE.TABLE.SUBMITTED_AT}:
                                </span>{' '}
                                <span>{formatDate(response.submittedAt)}</span>
                            </div>
                        </div>

                        <Separator />

                        {/* Answer */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">
                                    {response.answer.templateTitle}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {FIRE_SURVEY_LOCALE.QUESTION_TYPES[response.answer.questionType]}
                                </Badge>
                            </div>
                            <div className="pl-4 text-sm">
                                {renderAnswer(response.answer)}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
