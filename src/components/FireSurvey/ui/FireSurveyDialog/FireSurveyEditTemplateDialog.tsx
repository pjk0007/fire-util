import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, X, Check, ChevronsUpDown } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { updateTemplate } from '../../api/updateTemplate';
import {
    FIRE_SURVEY_LOCALE,
    SURVEY_TYPES,
    QUESTION_TYPES,
    QUESTION_TYPE_TEXT,
    QUESTION_TYPE_DROPDOWN,
    QUESTION_TYPE_CHECKBOX,
    QUESTION_TYPE_RADIO,
    QUESTION_TYPE_RATING,
} from '../../settings/constants';
import type { SurveyType, QuestionType, SurveyTemplate } from '../../settings/types';

interface FireSurveyEditTemplateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: SurveyTemplate;
}

// 선택지가 필요한 질문 타입
const CHOICE_TYPES: QuestionType[] = [
    QUESTION_TYPE_DROPDOWN,
    QUESTION_TYPE_CHECKBOX,
    QUESTION_TYPE_RADIO,
];

// "기타" 옵션을 지원하는 타입 (dropdown은 기타 미지원)
const ALLOW_OTHER_TYPES: QuestionType[] = [
    QUESTION_TYPE_CHECKBOX,
    QUESTION_TYPE_RADIO,
];

export function FireSurveyEditTemplateDialog({
    open,
    onOpenChange,
    template,
}: FireSurveyEditTemplateDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questionType, setQuestionType] = useState<QuestionType>(QUESTION_TYPE_TEXT);
    const [isRequired, setIsRequired] = useState(false);
    const [targetTypes, setTargetTypes] = useState<SurveyType[]>([]);
    const [isActive, setIsActive] = useState(true);
    const [options, setOptions] = useState<string[]>(['', '']);
    const [allowOther, setAllowOther] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [targetTypesOpen, setTargetTypesOpen] = useState(false);

    // 템플릿 데이터로 폼 초기화
    useEffect(() => {
        if (open && template) {
            setTitle(template.title || '');
            setDescription(template.description || '');
            setQuestionType(template.type || QUESTION_TYPE_TEXT);
            setIsRequired(template.isRequired ?? false);
            setTargetTypes(template.targetTypes || []);
            setIsActive(template.isActive ?? true);
            setAllowOther(template.allowOther ?? false);
            if (template.options && template.options.length > 0) {
                setOptions(template.options.map((opt) => opt.label));
            } else {
                setOptions(['', '']);
            }
        }
    }, [open, template?.id]);

    const needsOptions = CHOICE_TYPES.includes(questionType);
    const canAllowOther = ALLOW_OTHER_TYPES.includes(questionType);

    const handleToggleTargetType = (type: SurveyType) => {
        setTargetTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const handleRemoveTargetType = (type: SurveyType) => {
        setTargetTypes((prev) => prev.filter((t) => t !== type));
    };

    const handleAddOption = () => {
        setOptions((prev) => [...prev, '']);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length <= 2) return;
        setOptions((prev) => prev.filter((_, i) => i !== index));
    };

    const handleOptionChange = (index: number, value: string) => {
        setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error(FIRE_SURVEY_LOCALE.ERRORS.REQUIRED_TITLE);
            return;
        }

        if (targetTypes.length === 0) {
            toast.error(FIRE_SURVEY_LOCALE.ERRORS.REQUIRED_TARGET_TYPE);
            return;
        }

        // 선택지 타입인 경우 옵션 검증
        if (needsOptions) {
            const validOptions = options.filter((opt) => opt.trim());
            if (validOptions.length < 2) {
                toast.error(FIRE_SURVEY_LOCALE.ERRORS.REQUIRED_OPTIONS);
                return;
            }
        }

        setIsLoading(true);
        try {
            const validOptions = needsOptions
                ? options.filter((opt) => opt.trim())
                : undefined;

            await updateTemplate({
                templateId: template.id,
                data: {
                    title: title.trim(),
                    description: description.trim(),
                    type: questionType,
                    isRequired,
                    targetTypes,
                    isActive,
                    options: validOptions,
                    allowOther: canAllowOther ? allowOther : undefined,
                },
            });
            toast.success(FIRE_SURVEY_LOCALE.SUCCESS.UPDATED);
            onOpenChange(false);
        } catch {
            toast.error(FIRE_SURVEY_LOCALE.ERRORS.UPDATE_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{FIRE_SURVEY_LOCALE.TEMPLATE.EDIT}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 질문 입력 */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            {FIRE_SURVEY_LOCALE.TEMPLATE.TITLE_PLACEHOLDER}
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={FIRE_SURVEY_LOCALE.TEMPLATE.TITLE_PLACEHOLDER}
                        />
                    </div>

                    {/* 질문 설명 */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {FIRE_SURVEY_LOCALE.TEMPLATE.DESCRIPTION_PLACEHOLDER}
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={FIRE_SURVEY_LOCALE.TEMPLATE.DESCRIPTION_PLACEHOLDER}
                            rows={2}
                        />
                    </div>

                    {/* 질문 유형 */}
                    <div className="space-y-2">
                        <Label>{FIRE_SURVEY_LOCALE.TEMPLATE.TYPE}</Label>
                        <Select
                            value={questionType}
                            onValueChange={(value) => setQuestionType(value as QuestionType)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {QUESTION_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {FIRE_SURVEY_LOCALE.QUESTION_TYPES[type]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 선택지 입력 (dropdown, checkbox, radio) */}
                    {needsOptions && (
                        <div className="space-y-2">
                            <Label>{FIRE_SURVEY_LOCALE.OPTIONS.TITLE}</Label>
                            <div className="space-y-2">
                                {options.map((option, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={option}
                                            onChange={(e) =>
                                                handleOptionChange(index, e.target.value)
                                            }
                                            placeholder={`${FIRE_SURVEY_LOCALE.OPTIONS.PLACEHOLDER} ${index + 1}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveOption(index)}
                                            disabled={options.length <= 2}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddOption}
                                className="mt-2"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                {FIRE_SURVEY_LOCALE.OPTIONS.ADD}
                            </Button>
                        </div>
                    )}

                    {/* 평점 안내 */}
                    {questionType === QUESTION_TYPE_RATING && (
                        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                            {FIRE_SURVEY_LOCALE.RATING.MIN_LABEL} (1) ~ {FIRE_SURVEY_LOCALE.RATING.MAX_LABEL} (5)
                        </div>
                    )}

                    {/* 대상 타입 - MultiSelect */}
                    <div className="space-y-2">
                        <Label>{FIRE_SURVEY_LOCALE.TEMPLATE.TARGET_TYPES}</Label>
                        <Popover open={targetTypesOpen} onOpenChange={setTargetTypesOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={targetTypesOpen}
                                    className="w-full justify-between font-normal"
                                >
                                    {targetTypes.length === 0
                                        ? '대상 타입 선택...'
                                        : `${targetTypes.length}개 선택됨`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                    <CommandList>
                                        <CommandEmpty>결과 없음</CommandEmpty>
                                        <CommandGroup>
                                            {SURVEY_TYPES.map((type) => (
                                                <CommandItem
                                                    key={type}
                                                    value={type}
                                                    onSelect={() => handleToggleTargetType(type)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            targetTypes.includes(type)
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                        )}
                                                    />
                                                    {FIRE_SURVEY_LOCALE.SURVEY_TYPES[type]}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {/* 선택된 타입 배지 표시 */}
                        {targetTypes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {targetTypes.map((type) => (
                                    <Badge
                                        key={type}
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        {FIRE_SURVEY_LOCALE.SURVEY_TYPES[type]}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTargetType(type)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 옵션들 */}
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={isRequired}
                                onCheckedChange={(checked) => setIsRequired(checked === true)}
                            />
                            <span className="text-sm">
                                {FIRE_SURVEY_LOCALE.TEMPLATE.IS_REQUIRED}
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                checked={isActive}
                                onCheckedChange={(checked) => setIsActive(checked === true)}
                            />
                            <span className="text-sm">
                                {FIRE_SURVEY_LOCALE.TEMPLATE.IS_ACTIVE}
                            </span>
                        </label>
                        {canAllowOther && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    checked={allowOther}
                                    onCheckedChange={(checked) => setAllowOther(checked === true)}
                                />
                                <span className="text-sm">
                                    기타 옵션 허용
                                </span>
                            </label>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {FIRE_SURVEY_LOCALE.BUTTONS.CANCEL}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {FIRE_SURVEY_LOCALE.BUTTONS.SAVE}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
