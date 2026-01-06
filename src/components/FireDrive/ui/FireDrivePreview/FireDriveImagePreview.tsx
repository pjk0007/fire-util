import { getFileUrl } from '../../api';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FireDriveImagePreviewProps {
    storagePath: string;
    fileName: string;
}

export default function FireDriveImagePreview({
    storagePath,
    fileName,
}: FireDriveImagePreviewProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const url = await getFileUrl(storagePath);
                setImageUrl(url);
            } catch (err) {
                setError(FIRE_DRIVE_LOCALE.ERRORS.IMAGE_LOAD_FAILED);
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [storagePath]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                    {FIRE_DRIVE_LOCALE.PREVIEW.LOADING}
                </span>
            </div>
        );
    }

    if (error || !imageUrl) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                {error || FIRE_DRIVE_LOCALE.PREVIEW.UNSUPPORTED}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            <img
                src={imageUrl}
                alt={fileName}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
        </div>
    );
}
