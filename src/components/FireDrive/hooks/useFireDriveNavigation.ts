import { DRIVE_TYPE_FOLDER } from '../settings';
import { FireDriveItem } from '../settings';
import { useState, useCallback } from 'react';

interface UseFireDriveNavigationOptions {
    initialFolderId?: string | null;
}

export default function useFireDriveNavigation(options?: UseFireDriveNavigationOptions) {
    const initialFolder = options?.initialFolderId ?? null;
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(initialFolder);
    const [history, setHistory] = useState<(string | null)[]>([initialFolder]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const navigateTo = useCallback(
        (folderId: string | null) => {
            setCurrentFolderId(folderId);
            setHistory((prev) => [...prev.slice(0, historyIndex + 1), folderId]);
            setHistoryIndex((prev) => prev + 1);
        },
        [historyIndex]
    );

    const openItem = useCallback(
        (item: FireDriveItem) => {
            if (item.type === DRIVE_TYPE_FOLDER) {
                navigateTo(item.id);
                return true;
            }
            return false;
        },
        [navigateTo]
    );

    const goBack = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex((prev) => prev - 1);
            setCurrentFolderId(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);

    const goForward = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex((prev) => prev + 1);
            setCurrentFolderId(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);

    const goToRoot = useCallback(() => {
        navigateTo(null);
    }, [navigateTo]);

    return {
        currentFolderId,
        navigateTo,
        openItem,
        goBack,
        goForward,
        goToRoot,
        canGoBack: historyIndex > 0,
        canGoForward: historyIndex < history.length - 1,
    };
}
