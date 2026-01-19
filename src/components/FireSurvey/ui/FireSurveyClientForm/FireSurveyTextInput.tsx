import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { SurveyTemplate } from '../../settings/types';

interface FireSurveyTextInputProps {
    template: SurveyTemplate;
    value: string;
    onChange: (value: string) => void;
}

export function FireSurveyTextInput({
    template,
    value,
    onChange,
}: FireSurveyTextInputProps) {
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
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="답변을 입력해주세요..."
                rows={3}
            />
        </div>
    );
}
