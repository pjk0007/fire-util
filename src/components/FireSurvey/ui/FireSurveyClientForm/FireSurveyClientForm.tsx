import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFireSurveyByType } from '../../hooks/useFireSurveyByType';
import { submitResponse } from '../../api/submitResponse';
import {
    QUESTION_TYPE_TEXT,
    QUESTION_TYPE_DROPDOWN,
    QUESTION_TYPE_CHECKBOX,
    QUESTION_TYPE_RADIO,
    QUESTION_TYPE_RATING,
    FIRE_SURVEY_LOCALE,
} from '../../settings/constants';
import type { SurveyType, SurveyTemplate } from '../../settings/types';
import { FireSurveyTextInput } from './FireSurveyTextInput';
import { FireSurveyDropdown } from './FireSurveyDropdown';
import { FireSurveyCheckboxGroup } from './FireSurveyCheckboxGroup';
import { FireSurveyRadioGroup } from './FireSurveyRadioGroup';
import { FireSurveyRating } from './FireSurveyRating';

type AnswerValue = string | string[] | number;

interface FireSurveyClientFormProps {
    surveyType: SurveyType;
    userId: string;
    userName?: string;
    userEmail?: string;
    isRequired: boolean;
    onSubmit: () => void;
    onSkip?: (action: 'skip_7_days' | 'skip_today') => void;
    onClose?: () => void;
}

export function FireSurveyClientForm({
    surveyType,
    userId,
    userName,
    userEmail,
    isRequired,
    onSubmit,
    onSkip,
    onClose,
}: FireSurveyClientFormProps) {
    const { templates, isLoading, error } = useFireSurveyByType(surveyType);
    const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
    const [otherValues, setOtherValues] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [skipOption, setSkipOption] = useState<'skip_7_days' | 'skip_today' | null>(null);

    const getInitialValue = (template: SurveyTemplate): AnswerValue => {
        switch (template.type) {
            case QUESTION_TYPE_CHECKBOX:
                return [];
            case QUESTION_TYPE_RATING:
                return 0;
            default:
                return '';
        }
    };

    const handleAnswerChange = useCallback(
        (templateId: string, value: AnswerValue) => {
            setAnswers((prev) => ({ ...prev, [templateId]: value }));
        },
        []
    );

    const handleOtherValueChange = useCallback(
        (templateId: string, value: string) => {
            setOtherValues((prev) => ({ ...prev, [templateId]: value }));
        },
        []
    );

    const validateAnswers = (): boolean => {
        for (const template of templates) {
            if (!template.isRequired) continue;

            const answer = answers[template.id] ?? getInitialValue(template);

            if (template.type === QUESTION_TYPE_CHECKBOX) {
                if ((answer as string[]).length === 0) {
                    toast.error(`"${template.title}" 질문에 답변해주세요.`);
                    return false;
                }
            } else if (template.type === QUESTION_TYPE_RATING) {
                if ((answer as number) === 0) {
                    toast.error(`"${template.title}" 질문에 답변해주세요.`);
                    return false;
                }
            } else {
                if (!(answer as string).trim()) {
                    toast.error(`"${template.title}" 질문에 답변해주세요.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateAnswers()) return;

        setIsSubmitting(true);
        try {
            // 각 질문에 대한 응답을 개별적으로 저장
            for (const template of templates) {
                const answer = answers[template.id] ?? getInitialValue(template);

                // 답변이 없는 비필수 질문은 건너뜀
                if (!template.isRequired) {
                    const isEmpty =
                        template.type === QUESTION_TYPE_CHECKBOX
                            ? (answer as string[]).length === 0
                            : template.type === QUESTION_TYPE_RATING
                              ? (answer as number) === 0
                              : !(answer as string).trim();

                    if (isEmpty) continue;
                }

                const otherValue = otherValues[template.id]?.trim() || undefined;

                await submitResponse({
                    templateId: template.id,
                    templateTitle: template.title,
                    surveyType,
                    userId,
                    userName,
                    userEmail,
                    answer: {
                        templateId: template.id,
                        templateTitle: template.title,
                        questionType: template.type,
                        value: answer,
                        otherValue,
                    },
                });
            }

            toast.success(FIRE_SURVEY_LOCALE.SUCCESS.RESPONSE_SUBMITTED);
            onSubmit();
        } catch {
            toast.error(FIRE_SURVEY_LOCALE.ERRORS.SUBMIT_FAILED);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        if (skipOption && onSkip) {
            onSkip(skipOption);
        }
    };

    const renderQuestion = (template: SurveyTemplate) => {
        const value = answers[template.id] ?? getInitialValue(template);

        switch (template.type) {
            case QUESTION_TYPE_TEXT:
                return (
                    <FireSurveyTextInput
                        key={template.id}
                        template={template}
                        value={value as string}
                        onChange={(v) => handleAnswerChange(template.id, v)}
                    />
                );
            case QUESTION_TYPE_DROPDOWN:
                return (
                    <FireSurveyDropdown
                        key={template.id}
                        template={template}
                        value={value as string}
                        onChange={(v) => handleAnswerChange(template.id, v)}
                    />
                );
            case QUESTION_TYPE_CHECKBOX:
                return (
                    <FireSurveyCheckboxGroup
                        key={template.id}
                        template={template}
                        value={value as string[]}
                        onChange={(v) => handleAnswerChange(template.id, v)}
                        otherValue={otherValues[template.id] || ''}
                        onOtherChange={(v) => handleOtherValueChange(template.id, v)}
                    />
                );
            case QUESTION_TYPE_RADIO:
                return (
                    <FireSurveyRadioGroup
                        key={template.id}
                        template={template}
                        value={value as string}
                        onChange={(v) => handleAnswerChange(template.id, v)}
                        otherValue={otherValues[template.id] || ''}
                        onOtherChange={(v) => handleOtherValueChange(template.id, v)}
                    />
                );
            case QUESTION_TYPE_RATING:
                return (
                    <FireSurveyRating
                        key={template.id}
                        template={template}
                        value={value as number}
                        onChange={(v) => handleAnswerChange(template.id, v)}
                    />
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-destructive">
                설문을 불러오는 중 오류가 발생했습니다.
            </div>
        );
    }

    if (templates.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                등록된 설문이 없습니다.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 질문 목록 */}
            <div className="space-y-6">
                {templates.map((template) => renderQuestion(template))}
            </div>

            {/* Footer 영역 */}
            <div className={`flex flex-col md:flex-row gap-3 pt-4 ${isRequired ? 'md:justify-end' : 'md:justify-between'}`}>
                {/* 스킵 옵션 (선택적 설문인 경우) */}
                {!isRequired && onSkip && (
                    <div className="flex items-center gap-4 order-2 md:order-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={skipOption === 'skip_7_days'}
                                onCheckedChange={(checked) =>
                                    setSkipOption(checked ? 'skip_7_days' : null)
                                }
                            />
                            <span className="text-xs text-muted-foreground">
                                7일간 그만보기
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={skipOption === 'skip_today'}
                                onCheckedChange={(checked) =>
                                    setSkipOption(checked ? 'skip_today' : null)
                                }
                            />
                            <span className="text-xs text-muted-foreground">
                                오늘 그만보기
                            </span>
                        </label>
                    </div>
                )}

                {/* 버튼 영역 */}
                <div className="flex gap-2 justify-end order-1 md:order-2">
                    {!isRequired && onClose && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={skipOption ? handleSkip : onClose}
                        >
                            {skipOption ? '건너뛰기' : '닫기'}
                        </Button>
                    )}
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        제출
                    </Button>
                </div>
            </div>
        </div>
    );
}
