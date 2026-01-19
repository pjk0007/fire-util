import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2, BarChart3, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useFireSurvey } from '../../contexts/FireSurveyProvider';
import { updateTemplate } from '../../api/updateTemplate';
import { FIRE_SURVEY_LOCALE } from '../../settings/constants';
import type { SurveyTemplate } from '../../settings/types';
import { FireSurveyDeleteTemplateDialog } from '../FireSurveyDialog/FireSurveyDeleteTemplateDialog';
import { FireSurveyEditTemplateDialog } from '../FireSurveyDialog/FireSurveyEditTemplateDialog';

interface FireSurveyTemplateCardProps {
    template: SurveyTemplate;
    disabled?: boolean;
}

export function FireSurveyTemplateCard({ template, disabled }: FireSurveyTemplateCardProps) {
    const { setActiveTab, updateFilter } = useFireSurvey();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: template.id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    const handleViewResponses = () => {
        updateFilter('templateId', template.id);
        setActiveTab('responses');
    };

    const handleToggleActive = async () => {
        setIsUpdating(true);
        try {
            await updateTemplate({
                templateId: template.id,
                data: { isActive: !template.isActive },
            });
            toast.success(FIRE_SURVEY_LOCALE.SUCCESS.UPDATED);
        } catch {
            toast.error(FIRE_SURVEY_LOCALE.ERRORS.UPDATE_FAILED);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <Card
                ref={setNodeRef}
                style={style}
                className={cn(
                    'relative h-full flex flex-col',
                    isDragging && 'opacity-50 shadow-lg z-50'
                )}
            >
                <CardHeader className="pb-2 flex-none">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                {...attributes}
                                {...listeners}
                                className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 text-muted-foreground hover:text-foreground"
                            >
                                <GripVertical className="h-4 w-4" />
                            </button>
                            <CardTitle className="text-base line-clamp-1">
                                {template.title}
                            </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={template.isActive}
                                onCheckedChange={handleToggleActive}
                                disabled={isUpdating}
                            />
                        </div>
                    </div>
                    {template.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.description}
                        </p>
                    ) : (
                        <div className="h-5" />
                    )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-3">
                    {/* 질문 타입 배지 */}
                    <Badge variant="outline" className="text-xs">
                        {FIRE_SURVEY_LOCALE.QUESTION_TYPES[template.type]}
                    </Badge>

                    {/* 대상 타입 */}
                    <div className="flex flex-wrap gap-1">
                        {template.targetTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                                {FIRE_SURVEY_LOCALE.SURVEY_TYPES[type]}
                            </Badge>
                        ))}
                    </div>

                    {/* 하단 고정 영역 - 필수 응답 + 버튼 */}
                    <div className="flex flex-col gap-2 mt-auto pt-2">
                        {template.isRequired && (
                            <span className="text-xs text-muted-foreground">
                                * {FIRE_SURVEY_LOCALE.TEMPLATE.IS_REQUIRED}
                            </span>
                        )}
                        <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={handleEdit}
                        >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            {FIRE_SURVEY_LOCALE.BUTTONS.EDIT}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={handleViewResponses}
                        >
                            <BarChart3 className="h-3.5 w-3.5 mr-1" />
                            {FIRE_SURVEY_LOCALE.RESPONSE.VIEW_RESPONSES}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            {FIRE_SURVEY_LOCALE.BUTTONS.DELETE}
                        </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <FireSurveyDeleteTemplateDialog
                template={template}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
            <FireSurveyEditTemplateDialog
                template={template}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />
        </>
    );
}
