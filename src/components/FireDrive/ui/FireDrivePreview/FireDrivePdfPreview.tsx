import { getFileUrl } from '../../api';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FireDrivePdfPreviewProps {
    storagePath: string;
    fileName: string;
}

export default function FireDrivePdfPreview({
    storagePath,
}: FireDrivePdfPreviewProps) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPdf = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const url = await getFileUrl(storagePath);
                setPdfUrl(url);
            } catch (err) {
                setError(FIRE_DRIVE_LOCALE.ERRORS.PDF_LOAD_FAILED);
            } finally {
                setIsLoading(false);
            }
        };

        loadPdf();
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

    if (error || !pdfUrl) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                {error || FIRE_DRIVE_LOCALE.PREVIEW.UNSUPPORTED}
            </div>
        );
    }

    return (
        <iframe
            src={pdfUrl}
            className="w-full h-[70vh] border-0 rounded-lg"
            title="PDF Preview"
        />
    );
}
