import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { SurveyTemplate } from '../../settings/types';

const OTHER_OPTION_VALUE = '__other__';

interface FireSurveyRadioGroupProps {
    template: SurveyTemplate;
    value: string;
    onChange: (value: string) => void;
    otherValue?: string;
    onOtherChange?: (value: string) => void;
}

export function FireSurveyRadioGroup({
    template,
    value,
    onChange,
    otherValue = '',
    onOtherChange,
}: FireSurveyRadioGroupProps) {
    const isOtherSelected = value === OTHER_OPTION_VALUE;

    const handleOtherSelect = () => {
        onChange(OTHER_OPTION_VALUE);
    };

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
            <div className="space-y-2">
                {template.options?.map((option) => (
                    <label
                        key={option.label}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onChange(option.label)}
                    >
                        <span
                            role="radio"
                            aria-checked={value === option.label}
                            className={cn(
                                'h-4 w-4 rounded-full border flex items-center justify-center',
                                'cursor-pointer transition-colors',
                                value === option.label
                                    ? 'border-primary'
                                    : 'border-input'
                            )}
                        >
                            {value === option.label && (
                                <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                        </span>
                        <span className="text-sm">{option.label}</span>
                    </label>
                ))}
                {template.allowOther && (
                    <div className="space-y-2">
                        <label
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={handleOtherSelect}
                        >
                            <span
                                role="radio"
                                aria-checked={isOtherSelected}
                                className={cn(
                                    'h-4 w-4 rounded-full border flex items-center justify-center',
                                    'cursor-pointer transition-colors',
                                    isOtherSelected
                                        ? 'border-primary'
                                        : 'border-input'
                                )}
                            >
                                {isOtherSelected && (
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                )}
                            </span>
                            <span className="text-sm">기타</span>
                        </label>
                        {isOtherSelected && (
                            <Input
                                value={otherValue}
                                onChange={(e) => onOtherChange?.(e.target.value)}
                                placeholder="직접 입력해주세요"
                                className="ml-6"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
