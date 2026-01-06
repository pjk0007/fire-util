import { useFireDrive } from '../../contexts';
import FireDriveGrid from './FireDriveGrid';
import FireDriveList from './FireDriveList';
import FireDriveSelectionBox from './FireDriveSelectionBox';
import FireDriveEmptyContextMenu from './FireDriveEmptyContextMenu';
import { FireDriveEmptyActionSheet } from '../FireDriveBottomSheet';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { Loader2 } from 'lucide-react';
import { useLongPress } from '../../hooks';
import { useState } from 'react';

export default function FireDriveContent() {
    const { items, isLoading, viewMode } = useFireDrive();
    const [emptyActionSheetOpen, setEmptyActionSheetOpen] = useState(false);

    // 빈 공간 롱프레스
    const { isTouch, handlers: longPressHandlers } = useLongPress({
        onLongPress: () => setEmptyActionSheetOpen(true),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <>
                <FireDriveEmptyContextMenu>
                    <div
                        className="flex flex-col items-center justify-center h-64 text-muted-foreground"
                        {...longPressHandlers}
                    >
                        <p>{FIRE_DRIVE_LOCALE.EMPTY_FOLDER}</p>
                        <p className="text-sm mt-2">{FIRE_DRIVE_LOCALE.DRAG_DROP_HINT}</p>
                    </div>
                </FireDriveEmptyContextMenu>

                {/* 모바일 빈 공간 바텀시트 */}
                {isTouch && (
                    <FireDriveEmptyActionSheet
                        open={emptyActionSheetOpen}
                        onOpenChange={setEmptyActionSheetOpen}
                    />
                )}
            </>
        );
    }

    return (
        <>
            <FireDriveEmptyContextMenu>
                <div
                    className="flex flex-col flex-1 h-full"
                    {...longPressHandlers}
                >
                    <FireDriveSelectionBox>
                        {viewMode === 'grid' ? <FireDriveGrid /> : <FireDriveList />}
                    </FireDriveSelectionBox>
                </div>
            </FireDriveEmptyContextMenu>

            {/* 모바일 빈 공간 바텀시트 */}
            {isTouch && (
                <FireDriveEmptyActionSheet
                    open={emptyActionSheetOpen}
                    onOpenChange={setEmptyActionSheetOpen}
                />
            )}
        </>
    );
}
