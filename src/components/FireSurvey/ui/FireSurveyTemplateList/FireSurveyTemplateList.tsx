import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFireSurveyTemplates } from '../../hooks/useFireSurveyTemplates';
import { updateTemplateOrder } from '../../api/updateTemplateOrder';
import { FireSurveyTemplateCard } from './FireSurveyTemplateCard';
import { FireSurveyTemplateEmpty } from './FireSurveyTemplateEmpty';

export function FireSurveyTemplateList() {
    const { templates, isLoading } = useFireSurveyTemplates();
    const [isReordering, setIsReordering] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = templates.findIndex((t) => t.id === active.id);
        const newIndex = templates.findIndex((t) => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        const reorderedTemplates = arrayMove(templates, oldIndex, newIndex);

        // 모든 템플릿의 order 업데이트
        const updates = reorderedTemplates.map((template, index) => ({
            id: template.id,
            order: index,
        }));

        setIsReordering(true);
        try {
            await updateTemplateOrder(updates);
            toast.success('순서가 변경되었습니다.');
        } catch {
            toast.error('순서 변경에 실패했습니다.');
        } finally {
            setIsReordering(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (templates.length === 0) {
        return <FireSurveyTemplateEmpty />;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={templates.map((t) => t.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 [&>*]:h-full">
                    {templates.map((template) => (
                        <FireSurveyTemplateCard
                            key={template.id}
                            template={template}
                            disabled={isReordering}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
