import { useFireDrive } from '../../contexts';
import FireDriveItem from './FireDriveItem';

export default function FireDriveGrid() {
    const { items } = useFireDrive();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 min-h-full content-start">
            {items.map((item) => (
                <FireDriveItem key={item.id} item={item} view="grid" />
            ))}
        </div>
    );
}
