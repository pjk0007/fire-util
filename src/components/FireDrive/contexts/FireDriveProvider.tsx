import { useFireChannel } from '@/components/FireChannel/context/FireChannelProvider';
import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import {
    useFireDriveItems,
    useFireDriveNavigation,
    useFireDriveBreadcrumb,
    useFireDriveUpload,
    useFireDriveKeyboard,
} from '../hooks';
import { FireDriveItem, FireDriveUploadTask, DRIVE_TYPE_FOLDER } from '../settings';
import {
    createContext,
    ReactNode,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
} from 'react';

interface FireDriveContextValue {
    channelId?: string;
    items: FireDriveItem[];
    isLoading: boolean;
    currentFolderId: string | null;
    breadcrumb: FireDriveItem[];
    navigateTo: (folderId: string | null) => void;
    openItem: (item: FireDriveItem) => boolean;
    goBack: () => void;
    goForward: () => void;
    goToRoot: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    uploadTasks: FireDriveUploadTask[];
    uploadFile: (file: File) => Promise<void>;
    uploadFiles: (files: File[]) => Promise<void>;
    cancelUpload: (taskId: string) => void;
    clearCompletedUploads: () => void;
    dismissError: (taskId: string) => void;
    isUploading: boolean;
    selectedItems: FireDriveItem[];
    setSelectedItems: (items: FireDriveItem[]) => void;
    toggleSelectItem: (item: FireDriveItem, multi?: boolean) => void;
    selectAll: () => void;
    clearSelection: () => void;
    isSelected: (item: FireDriveItem) => boolean;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    previewItem: FireDriveItem | null;
    setPreviewItem: (item: FireDriveItem | null) => void;
    // 모바일 선택 모드
    isSelectionMode: boolean;
    enterSelectionMode: (item: FireDriveItem) => void;
    exitSelectionMode: () => void;
}

const FireDriveContext = createContext<FireDriveContextValue | null>(null);

export const useFireDrive = () => {
    const context = useContext(FireDriveContext);
    if (!context) {
        throw new Error('useFireDrive must be used within FireDriveProvider');
    }
    return context;
};

interface FireDriveProviderProps {
    children: ReactNode;
    channelId?: string;
    initialFolderId?: string | null;
    initialFileId?: string | null;
}

export function FireDriveProvider({
    children,
    channelId: propChannelId,
    initialFolderId,
    initialFileId,
}: FireDriveProviderProps) {
    const channelContext = useFireChannel();
    const authContext = useFireAuth();

    const channelId = propChannelId || channelContext?.selectedChannelId;
    const userId = authContext?.user?.id || '';

    const [selectedItems, setSelectedItems] = useState<FireDriveItem[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [previewItem, setPreviewItem] = useState<FireDriveItem | null>(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const {
        currentFolderId,
        navigateTo,
        openItem: navOpenItem,
        goBack,
        goForward,
        goToRoot,
        canGoBack,
        canGoForward,
    } = useFireDriveNavigation({ initialFolderId });

    const { items, isLoading } = useFireDriveItems({
        channelId,
        parentId: currentFolderId,
    });

    const { breadcrumb } = useFireDriveBreadcrumb(channelId, currentFolderId);

    // initialFileId로 파일 선택/미리보기 (최초 1회만)
    const initialFileHandled = useRef(false);
    useEffect(() => {
        if (initialFileId && !initialFileHandled.current && !isLoading && items.length > 0) {
            const file = items.find((item) => item.id === initialFileId);
            if (file && file.type !== DRIVE_TYPE_FOLDER) {
                setPreviewItem(file);
                setSelectedItems([file]);
            }
            initialFileHandled.current = true;
        }
    }, [initialFileId, isLoading, items]);

    const {
        uploadTasks,
        uploadFile,
        uploadFiles,
        cancelUpload,
        clearCompletedUploads,
        dismissError,
        isUploading,
    } = useFireDriveUpload({
        channelId: channelId || '',
        parentId: currentFolderId,
        userId,
    });

    const clearSelection = useCallback(() => {
        setSelectedItems([]);
    }, []);

    // 선택 모드 진입 (모바일 롱프레스)
    const enterSelectionMode = useCallback((item: FireDriveItem) => {
        setIsSelectionMode(true);
        setSelectedItems([item]);
    }, []);

    // 선택 모드 종료
    const exitSelectionMode = useCallback(() => {
        setIsSelectionMode(false);
        setSelectedItems([]);
    }, []);

    const openItem = useCallback(
        (item: FireDriveItem) => {
            if (item.type === DRIVE_TYPE_FOLDER) {
                clearSelection();
                return navOpenItem(item);
            }
            setPreviewItem(item);
            return false;
        },
        [navOpenItem, clearSelection]
    );

    const isSelected = useCallback(
        (item: FireDriveItem) => {
            return selectedItems.some((i) => i.id === item.id);
        },
        [selectedItems]
    );

    const toggleSelectItem = useCallback(
        (item: FireDriveItem, multi: boolean = false) => {
            if (multi) {
                if (isSelected(item)) {
                    setSelectedItems((prev) =>
                        prev.filter((i) => i.id !== item.id)
                    );
                } else {
                    setSelectedItems((prev) => [...prev, item]);
                }
            } else {
                setSelectedItems([item]);
            }
        },
        [isSelected]
    );

    const selectAll = useCallback(() => {
        setSelectedItems(items);
    }, [items]);

    // 키보드 단축키 및 마우스 버튼 훅
    useFireDriveKeyboard({
        channelId,
        selectedItems,
        selectAll,
        clearSelection,
        openItem,
        setPreviewItem,
        previewItem,
        goBack,
        goForward,
    });

    const contextValue = useMemo<FireDriveContextValue>(
        () => ({
            channelId,
            items,
            isLoading,
            currentFolderId,
            breadcrumb,
            navigateTo,
            openItem,
            goBack,
            goForward,
            goToRoot,
            canGoBack,
            canGoForward,
            uploadTasks,
            uploadFile,
            uploadFiles,
            cancelUpload,
            clearCompletedUploads,
            dismissError,
            isUploading,
            selectedItems,
            setSelectedItems,
            toggleSelectItem,
            selectAll,
            clearSelection,
            isSelected,
            viewMode,
            setViewMode,
            previewItem,
            setPreviewItem,
            isSelectionMode,
            enterSelectionMode,
            exitSelectionMode,
        }),
        [
            channelId,
            items,
            isLoading,
            currentFolderId,
            breadcrumb,
            navigateTo,
            openItem,
            goBack,
            goForward,
            goToRoot,
            canGoBack,
            canGoForward,
            uploadTasks,
            uploadFile,
            uploadFiles,
            cancelUpload,
            clearCompletedUploads,
            dismissError,
            isUploading,
            selectedItems,
            setSelectedItems,
            toggleSelectItem,
            selectAll,
            clearSelection,
            isSelected,
            viewMode,
            setViewMode,
            previewItem,
            setPreviewItem,
            isSelectionMode,
            enterSelectionMode,
            exitSelectionMode,
        ]
    );

    return (
        <FireDriveContext.Provider value={contextValue}>
            {children}
        </FireDriveContext.Provider>
    );
}
