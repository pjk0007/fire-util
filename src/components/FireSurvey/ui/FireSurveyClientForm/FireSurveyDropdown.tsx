import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { SurveyTemplate } from '../../settings/types';

interface FireSurveyDropdownProps {
    template: SurveyTemplate;
    value: string;
    onChange: (value: string) => void;
}

export function FireSurveyDropdown({
    template,
    value,
    onChange,
}: FireSurveyDropdownProps) {
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
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="선택해주세요..." />
                </SelectTrigger>
                <SelectContent>
                    {template.options?.map((option) => (
                        <SelectItem key={option.label} value={option.label}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
