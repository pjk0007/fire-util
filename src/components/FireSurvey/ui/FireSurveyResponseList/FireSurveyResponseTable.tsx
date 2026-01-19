import { Eye, MessageSquare } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FIRE_SURVEY_LOCALE } from '../../settings/constants';
import type { SurveyResponse } from '../../settings/types';

interface FireSurveyResponseTableProps {
    responses: SurveyResponse[];
    onSelectResponse: (response: SurveyResponse) => void;
}

export function FireSurveyResponseTable({
    responses,
    onSelectResponse,
}: FireSurveyResponseTableProps) {
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

    if (responses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                    {FIRE_SURVEY_LOCALE.RESPONSE.EMPTY}
                </h3>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{FIRE_SURVEY_LOCALE.TABLE.USER}</TableHead>
                    <TableHead>{FIRE_SURVEY_LOCALE.TABLE.EMAIL}</TableHead>
                    <TableHead>{FIRE_SURVEY_LOCALE.RESPONSE.FILTER_TEMPLATE}</TableHead>
                    <TableHead>{FIRE_SURVEY_LOCALE.TABLE.SURVEY_TYPE}</TableHead>
                    <TableHead>{FIRE_SURVEY_LOCALE.TABLE.SUBMITTED_AT}</TableHead>
                    <TableHead className="w-20">
                        {FIRE_SURVEY_LOCALE.TABLE.ACTIONS}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {responses.map((response) => (
                    <TableRow key={response.id}>
                        <TableCell className="font-medium">
                            {response.userName || '-'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {response.userEmail || '-'}
                        </TableCell>
                        <TableCell>{response.templateTitle}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">
                                {FIRE_SURVEY_LOCALE.SURVEY_TYPES[response.surveyType]}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {formatDate(response.submittedAt)}
                        </TableCell>
                        <TableCell>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onSelectResponse(response)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
