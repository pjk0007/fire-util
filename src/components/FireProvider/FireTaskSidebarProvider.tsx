import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ChevronsLeft, Minimize2, MoveDiagonal } from 'lucide-react';
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
