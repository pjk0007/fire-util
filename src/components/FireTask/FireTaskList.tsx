import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { TASK_LOCALE } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import {
    ChevronsLeft,
    Minimize2,
    MoveDiagonal,
    MoveDiagonal2,
    Plus,
} from 'lucide-react';
import { useState } from 'react';

export default function FireKanbanList() {
    const [isOpen, setIsOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const isMobile = useIsMobile();
    return (
        <div
            className={cn(
                'bg-background transition-all',
                isMobile
                    ? {
                          'absolute z-50 ': true,
                          'border rounded-lg top-4 left-4 w-20 h-9': !isOpen,
                          'w-full h-full top-0 left-0': isOpen,
                      }
                    : {
                          'h-full overflow-hidden': true,
                          'relative w-72 border-r ': isOpen && !isExpanded,
                          'absolute z-50 inset-0 h-full w-full':
                              isOpen && isExpanded,
                          'relative w-13 hover:bg-muted border-r ': !isOpen,
                      }
            )}
            onClick={() => {
                if (!isOpen) setIsOpen(true);
            }}
        >
            <div
                className={cn(
                    'w-full h-full flex flex-col gap-2 md:px-2 md:py-3.5 p-2',
                    {
                        'md:w-72': isOpen && !isExpanded,
                        'md:w-full': isOpen && isExpanded,
                        'items-center': !isOpen,
                    }
                )}
            >
                {isOpen && (
                    <div className="flex w-full justify-between text-foreground items-center">
                        {isMobile ? (
                            <div></div>
                        ) : isExpanded ? (
                            <Minimize2
                                size={18}
                                className="hover:bg-muted rounded-sm"
                                onClick={() => setIsExpanded(false)}
                            />
                        ) : (
                            <MoveDiagonal
                                size={18}
                                className="hover:bg-muted rounded-sm"
                                onClick={() => setIsExpanded(true)}
                            />
                        )}

                        <ChevronsLeft
                            size={22}
                            className="hover:bg-muted rounded-sm"
                            onClick={() => setIsOpen(!isOpen)}
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <span
                        className={cn('font-semibold', {
                            hidden: !isOpen && !isMobile,
                            'text-xs text-center w-full': isMobile && !isOpen,
                        })}
                    >
                        {TASK_LOCALE.TASK_LIST}
                    </span>
                    {(!isMobile || isOpen) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size={'icon'}
                                    variant={'outline'}
                                    className={cn('rounded-full ', {
                                        'w-6 h-6': isOpen,
                                        'w-9 h-9': !isOpen,
                                    })}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {TASK_LOCALE.ADD_TASK}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                {/* <div>123asdfasdfasdf</div> */}
            </div>
        </div>
    );
}
