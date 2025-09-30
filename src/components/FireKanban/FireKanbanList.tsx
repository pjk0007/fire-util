import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronsLeft, MoveDiagonal2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FireKanbanList() {
    const [isOpen, setIsOpen] = useState(true);
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
                          'relative h-full inset-0 border-r overflow-hidden':
                              true,
                          'w-72': isOpen,
                          'w-13 hover:bg-muted': !isOpen,
                      }
            )}
            onClick={() => {
                if (!isOpen) setIsOpen(true);
            }}
        >
            <div className="md:w-72 w-full h-full flex flex-col gap-2 md:px-2 md:py-3.5 p-2">
                {isOpen && (
                    <div className="flex w-full justify-between text-foreground items-center">
                        <MoveDiagonal2
                            size={18}
                            className="hover:bg-muted rounded-sm"
                        />
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
                            'hidden': !isOpen && !isMobile,
                            'text-xs text-center w-full': isMobile && !isOpen,
                        })}
                    >
                        업무 리스트
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
                                신규 업무 추가
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                {/* <div>123asdfasdfasdf</div> */}
            </div>
        </div>
    );
}
