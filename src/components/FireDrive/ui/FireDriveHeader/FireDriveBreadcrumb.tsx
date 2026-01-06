import { useFireDrive } from '../../contexts';
import { FIRE_DRIVE_LOCALE, DRIVE_NAME_FIELD } from '../../settings';
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function FireDriveBreadcrumb() {
    const { breadcrumb, navigateTo, goToRoot } = useFireDrive();

    // 모바일에서 브레드크럼이 길면 중간 폴더들을 축약
    const MAX_VISIBLE_ITEMS = 2;
    const shouldCollapse = breadcrumb.length > MAX_VISIBLE_ITEMS;
    const collapsedItems = shouldCollapse
        ? breadcrumb.slice(0, breadcrumb.length - MAX_VISIBLE_ITEMS)
        : [];
    const visibleItems = shouldCollapse
        ? breadcrumb.slice(breadcrumb.length - MAX_VISIBLE_ITEMS)
        : breadcrumb;

    return (
        <nav className="flex items-center gap-1 text-sm overflow-x-auto scrollbar-hide">
            <Button
                variant="ghost"
                size="sm"
                onClick={goToRoot}
                className="flex items-center gap-1 shrink-0 h-8 px-2"
            >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">{FIRE_DRIVE_LOCALE.ROOT_FOLDER}</span>
            </Button>

            {/* 축약된 중간 폴더들 (드롭다운) */}
            {shouldCollapse && collapsedItems.length > 0 && (
                <>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {collapsedItems.map((folder) => (
                                <DropdownMenuItem
                                    key={folder.id}
                                    onClick={() => navigateTo(folder.id)}
                                >
                                    {folder[DRIVE_NAME_FIELD]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}

            {/* 표시되는 폴더들 */}
            {visibleItems.map((folder, index) => (
                <div key={folder.id} className="flex items-center shrink-0">
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateTo(folder.id)}
                        className={`h-8 px-2 max-w-[120px] sm:max-w-[200px] overflow-hidden ${
                            index === visibleItems.length - 1 ? 'font-semibold' : ''
                        }`}
                    >
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap block">{folder[DRIVE_NAME_FIELD]}</span>
                    </Button>
                </div>
            ))}
        </nav>
    );
}
