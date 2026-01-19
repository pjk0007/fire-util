import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SurveyTemplate } from '../../settings/types';

const OTHER_OPTION_VALUE = '__other__';

interface FireSurveyCheckboxGroupProps {
    template: SurveyTemplate;
    value: string[];
    onChange: (value: string[]) => void;
    otherValue?: string;
    onOtherChange?: (value: string) => void;
}

export function FireSurveyCheckboxGroup({
    template,
    value,
    onChange,
    otherValue = '',
    onOtherChange,
}: FireSurveyCheckboxGroupProps) {
    const isOtherSelected = value.includes(OTHER_OPTION_VALUE);

    const handleToggle = (optionLabel: string) => {
        if (value.includes(optionLabel)) {
            onChange(value.filter((v) => v !== optionLabel));
        } else {
            onChange([...value, optionLabel]);
        }
    };

    const handleOtherToggle = () => {
        if (isOtherSelected) {
            onChange(value.filter((v) => v !== OTHER_OPTION_VALUE));
            onOtherChange?.('');
        } else {
            onChange([...value, OTHER_OPTION_VALUE]);
        }
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
            <div className="grid grid-cols-2 gap-2">
                {template.options?.map((option) => (
                    <label
                        key={option.label}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Checkbox
                            checked={value.includes(option.label)}
                            onCheckedChange={() => handleToggle(option.label)}
                        />
                        <span className="text-sm">{option.label}</span>
                    </label>
                ))}
            </div>
            {template.allowOther && (
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={isOtherSelected}
                                onCheckedChange={handleOtherToggle}
                            />
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
    );
}
