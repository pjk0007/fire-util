import { useFireDrive } from '../../contexts';
import FireDriveBreadcrumb from './FireDriveBreadcrumb';
import FireDriveActions from './FireDriveActions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Grid, List, X, MoreVertical } from 'lucide-react';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { useTouchDevice } from '../../hooks';
import { FireDriveItemActionSheet } from '../FireDriveBottomSheet';
import { useState } from 'react';

export default function FireDriveHeader() {
    const {
        goBack,
        goForward,
        canGoBack,
        canGoForward,
        viewMode,
        setViewMode,
        selectedItems,
        isSelectionMode,
        exitSelectionMode,
    } = useFireDrive();
    const isTouch = useTouchDevice();
    const [actionSheetOpen, setActionSheetOpen] = useState(false);

    // 모바일 선택 모드일 때 다른 헤더 표시
    if (isTouch && isSelectionMode) {
        return (
            <>
                <div className="flex flex-col gap-2 p-3 sm:p-4 border-b">
                    <div className="flex items-center justify-between gap-2">
                        {/* 왼쪽: 닫기 버튼 + 선택 개수 */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={exitSelectionMode}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">
                                {FIRE_DRIVE_LOCALE.SELECTION.SELECTED(selectedItems.length)}
                            </span>
                        </div>

                        {/* 오른쪽: 더보기 버튼 (바텀시트 열기) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setActionSheetOpen(true)}
                            disabled={selectedItems.length === 0}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* 선택 모드 바텀시트 */}
                <FireDriveItemActionSheet
                    items={selectedItems}
                    open={actionSheetOpen}
                    onOpenChange={setActionSheetOpen}
                />
            </>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-3 sm:p-4 border-b">
            {/* 상단: 네비게이션 + 뷰모드 + 액션 */}
            <div className="flex items-center justify-between gap-2">
                {/* 왼쪽: 뒤로/앞으로 버튼 */}
                <div className="flex items-center gap-1 shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={goBack}
                        disabled={!canGoBack}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={goForward}
                        disabled={!canGoForward}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* 오른쪽: 선택 표시 + 뷰모드 + 액션 버튼들 */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {selectedItems.length > 0 && (
                        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {FIRE_DRIVE_LOCALE.SELECTION.SELECTED(selectedItems.length)}
                        </span>
                    )}
                    <div className="flex border rounded-md shrink-0">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('grid')}
                            title={FIRE_DRIVE_LOCALE.VIEW.GRID}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode('list')}
                            title={FIRE_DRIVE_LOCALE.VIEW.LIST}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <FireDriveActions />
                </div>
            </div>

            {/* 하단: 브레드크럼 (별도 줄) */}
            <FireDriveBreadcrumb />
        </div>
    );
}
