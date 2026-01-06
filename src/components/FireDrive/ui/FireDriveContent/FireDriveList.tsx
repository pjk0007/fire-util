import { useFireDrive } from '../../contexts';
import FireDriveItem from './FireDriveItem';
import { FIRE_DRIVE_LOCALE } from '../../settings';

export default function FireDriveList() {
    const { items } = useFireDrive();

    return (
        <div className="flex flex-col min-h-full p-2">
            {/* 헤더 */}
            <div className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <span className="flex-1">{FIRE_DRIVE_LOCALE.SORT.NAME}</span>
                <span className="hidden sm:block w-24 text-right">{FIRE_DRIVE_LOCALE.SORT.SIZE}</span>
                <span className="hidden md:block w-32 text-right">{FIRE_DRIVE_LOCALE.SORT.DATE}</span>
            </div>

            {/* 아이템 목록 */}
            <div className="flex flex-col flex-1">
                {items.map((item) => (
                    <FireDriveItem key={item.id} item={item} view="list" />
                ))}
            </div>
        </div>
    );
}
