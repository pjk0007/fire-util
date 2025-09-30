import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChevronsLeft, MoveDiagonal2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FireKanbanList() {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div
            className={cn(
                'relative border-r md:static z-50 bg-background inset-0 overflow-hidden',
                'transition-[width]',
                {
                    'md:w-72 w-full': isOpen,
                    'md:w-13 w-0': !isOpen,
                    'hover:bg-muted': !isOpen,
                }
            )}
            onClick={() => {
                if (!isOpen) setIsOpen(true);
            }}
        >
            <div className="w-72 h-full flex flex-col gap-2 px-2 py-3.5">
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
                    {isOpen && (
                        <span className="font-semibold">업무 리스트</span>
                    )}
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
                </div>
                {/* <div>123asdfasdfasdf</div> */}
            </div>
        </div>
    );
}
