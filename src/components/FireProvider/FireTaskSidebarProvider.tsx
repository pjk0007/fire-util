import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { CHANNEL_COLLECTION } from '@/components/FireChannel/settings';
import { TASK_COLLECTION, FIRE_TASK_LOCALE } from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import {
    ChevronsLeft,
    Minimize2,
    MoveDiagonal,
    SquareArrowOutUpRight,
} from 'lucide-react';
import { createContext, ReactNode, useContext, useState } from 'react';

export const TASK_SIDEBAR_WIDTH = 288;
export const TASK_SIDEBAR_HEADER_HEIGHT = 36;

interface FireTaskSidebarContextValue {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
}

const FireTaskSidebarContext = createContext<FireTaskSidebarContextValue>({
    isOpen: true,
    setIsOpen: () => {},
    isExpanded: false,
    setIsExpanded: () => {},
});

export const useFireTaskSidebar = () => useContext(FireTaskSidebarContext);

interface FireTaskSidebarProviderProps {
    children: React.ReactNode;
}

export function FireTaskSidebarProvider({
    children,
}: FireTaskSidebarProviderProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <FireTaskSidebarContext.Provider
            value={{ isOpen, setIsOpen, isExpanded, setIsExpanded }}
        >
            {children}
        </FireTaskSidebarContext.Provider>
    );
}

export function FireTaskSidebar({ children }: { children?: ReactNode }) {
    const { isExpanded, isOpen, setIsExpanded, setIsOpen } =
        useFireTaskSidebar();
    const isMobile = useIsMobile();
    const { selectedChannelId: channelId } = useFireChannel();
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
                          'absolute z-10 inset-0 h-full w-full':
                              isOpen && isExpanded,
                          'relative w-13 hover:bg-muted border-r ': !isOpen,
                      }
            )}
            onClick={() => {
                if (!isOpen) setIsOpen(true);
            }}
        >
            <div
                className={cn('w-full h-full flex flex-col', {
                    'md:w-72': isOpen && !isExpanded,
                    'md:w-full': isOpen && isExpanded,
                    'items-center': !isOpen,
                })}
            >
                {isOpen && (
                    <div
                        className="flex w-full justify-between text-foreground items-center md:px-2 px-2"
                        style={{ height: TASK_SIDEBAR_HEADER_HEIGHT }}
                    >
                        {isMobile ? (
                            <div></div>
                        ) : (
                            <div className="flex gap-2">
                                <Tooltip>
                                    <TooltipTrigger>
                                        {isExpanded ? (
                                            <Minimize2
                                                size={18}
                                                className="hover:bg-muted rounded-sm"
                                                onClick={() =>
                                                    setIsExpanded(false)
                                                }
                                            />
                                        ) : (
                                            <MoveDiagonal
                                                size={18}
                                                className="hover:bg-muted rounded-sm"
                                                onClick={() =>
                                                    setIsExpanded(true)
                                                }
                                            />
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isExpanded
                                            ? FIRE_TASK_LOCALE.SIDEBAR.MINIMIZE
                                            : FIRE_TASK_LOCALE.SIDEBAR.MAXIMIZE}
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <SquareArrowOutUpRight
                                            className="hover:bg-muted rounded-sm"
                                            size={18}
                                            onClick={() => {
                                                const width = 800;
                                                const height = 600;
                                                const left =
                                                    window.screenX +
                                                    (window.outerWidth -
                                                        width) /
                                                        2;
                                                const top =
                                                    window.screenY +
                                                    (window.outerHeight -
                                                        height) /
                                                        2;
                                                window.open(
                                                    `/windows/${CHANNEL_COLLECTION}/${channelId}/${TASK_COLLECTION}`,
                                                    '_blank',
                                                    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
                                                );
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {FIRE_TASK_LOCALE.SIDEBAR.NEW_WINDOW}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )}

                        <Tooltip>
                            <TooltipTrigger>
                                <ChevronsLeft
                                    size={22}
                                    className="hover:bg-muted rounded-sm"
                                    onClick={() => setIsOpen(!isOpen)}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                {FIRE_TASK_LOCALE.SIDEBAR.CLOSE}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
                <div
                    style={{
                        height: `calc(100% - ${TASK_SIDEBAR_HEADER_HEIGHT}px)`,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
