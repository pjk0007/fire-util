import { useMemo } from 'react';
import type {
    SurveyResponse,
    SurveyTemplate,
    TemplateStats,
    OptionStats,
    RatingDistribution,
} from '../settings/types';
import { QUESTION_TYPE_RATING, QUESTION_TYPE_TEXT } from '../settings/constants';

interface UseFireSurveyStatsReturn {
    stats: TemplateStats | null;
}

export function useFireSurveyStats(
    template: SurveyTemplate | null,
    responses: SurveyResponse[]
): UseFireSurveyStatsReturn {
    const stats = useMemo(() => {
        if (!template) return null;

        const templateResponses = responses.filter(
            (r) => r.templateId === template.id
        );

        const totalResponses = templateResponses.length;

        if (template.type === QUESTION_TYPE_RATING) {
            // Rating statistics
            const ratings = templateResponses
                .map((r) => Number(r.answer.value))
                .filter((v) => !isNaN(v));

            const averageRating =
                ratings.length > 0
                    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
                    : 0;

            const ratingCounts: Record<number, number> = {};
            const config = template.ratingConfig || { min: 1, max: 5 };
            for (let i = config.min; i <= config.max; i++) {
                ratingCounts[i] = 0;
            }
            ratings.forEach((r) => {
                if (ratingCounts[r] !== undefined) {
                    ratingCounts[r]++;
                }
            });

            const ratingDistribution: RatingDistribution[] = Object.entries(
                ratingCounts
            ).map(([rating, count]) => ({
                rating: Number(rating),
                count,
                percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
            }));

            return {
                templateId: template.id,
                templateTitle: template.title,
                questionType: template.type,
                totalResponses,
                averageRating,
                ratingDistribution,
            };
        }

        if (template.type === QUESTION_TYPE_TEXT) {
            // Text responses
            const textResponses = templateResponses
                .map((r) => String(r.answer.value))
                .filter((v) => v.trim() !== '');

            return {
                templateId: template.id,
                templateTitle: template.title,
                questionType: template.type,
                totalResponses,
                textResponses,
            };
        }

        // Choice statistics (dropdown, checkbox, radio)
        const optionCounts: Record<string, number> = {};
        template.options?.forEach((opt) => {
            optionCounts[opt.label] = 0;
        });

        templateResponses.forEach((response) => {
            const values = Array.isArray(response.answer.value)
                ? response.answer.value
                : [String(response.answer.value)];
            values.forEach((v) => {
                if (optionCounts[v] !== undefined) {
                    optionCounts[v]++;
                }
            });
        });

        const totalChoices = Object.values(optionCounts).reduce(
            (sum, count) => sum + count,
            0
        );

        const optionStats: OptionStats[] = Object.entries(optionCounts).map(
            ([label, count]) => ({
                label,
                count,
                percentage: totalChoices > 0 ? (count / totalChoices) * 100 : 0,
            })
        );

        return {
            templateId: template.id,
            templateTitle: template.title,
            questionType: template.type,
            totalResponses,
            optionCounts: optionStats,
        };
    }, [template, responses]);

    return { stats };
}
