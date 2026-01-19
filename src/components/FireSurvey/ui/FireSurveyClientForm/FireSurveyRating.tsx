import { Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { SurveyTemplate } from '../../settings/types';
import { DEFAULT_RATING_CONFIG } from '../../settings/types';

interface FireSurveyRatingProps {
    template: SurveyTemplate;
    value: number;
    onChange: (value: number) => void;
}

export function FireSurveyRating({
    template,
    value,
    onChange,
}: FireSurveyRatingProps) {
    const config = template.ratingConfig || DEFAULT_RATING_CONFIG;
    const ratings = Array.from(
        { length: config.max - config.min + 1 },
        (_, i) => config.min + i
    );

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium inline-flex items-center gap-1">
                {template.title}
                {template.isRequired && (
                    <span className="text-destructive">*</span>
                )}
            </Label>
            {template.description && (
                <p className="text-xs text-muted-foreground">
                    {template.description}
                </p>
            )}
            <div className="flex items-center gap-1">
                {ratings.map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(rating)}
                        className={cn(
                            'p-1 rounded transition-colors',
                            'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring'
                        )}
                    >
                        <Star
                            className={cn(
                                'h-6 w-6 transition-colors',
                                rating <= value
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                            )}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
