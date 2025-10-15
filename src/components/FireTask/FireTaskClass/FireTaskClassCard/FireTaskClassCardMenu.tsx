import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { TASK_LOCALE } from '@/lib/FireTask/settings';
import { Ellipsis, PenLine } from 'lucide-react';

interface FireTaskClassCardMenuProps {
    setIsEditingTitle: (isEditing: boolean) => void;
    isEditingTitle: boolean;
}

export default function FireTaskClassCardMenu({
    setIsEditingTitle,
    isEditingTitle,
}: FireTaskClassCardMenuProps) {
    return (
        <div className="absolute group-hover:visible invisible top-2 right-2">
            <ButtonGroup>
                {!isEditingTitle && (
                    <Button
                    size={'icon-sm'}
                        variant={'outline'}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingTitle(!isEditingTitle);
                        }}
                        className="bg-background"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PenLine />
                            </TooltipTrigger>
                            <TooltipContent>
                                {TASK_LOCALE.CARD.EDIT}
                            </TooltipContent>
                        </Tooltip>
                    </Button>
                )}
                <Button
                size={'icon-sm'}
                    variant={'outline'}
                    value="edit"
                    className="bg-background"
                >
                    <Ellipsis />
                </Button>
            </ButtonGroup>
        </div>
    );
}
