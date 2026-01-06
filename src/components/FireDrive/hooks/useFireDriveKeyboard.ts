import { useEffect, useCallback } from 'react';
import { FireDriveItem } from '../settings';

interface UseFireDriveKeyboardProps {
    channelId?: string;
    selectedItems: FireDriveItem[];
    selectAll: () => void;
    clearSelection: () => void;
    openItem: (item: FireDriveItem) => void;
    setPreviewItem: (item: FireDriveItem | null) => void;
    previewItem: FireDriveItem | null;
    goBack: () => void;
    goForward: () => void;
}

export default function useFireDriveKeyboard({
    channelId,
    selectedItems,
    selectAll,
    clearSelection,
    openItem,
    setPreviewItem,
    previewItem,
    goBack,
    goForward,
}: UseFireDriveKeyboardProps) {
    const handleKeyDown = useCallback(
        async (e: KeyboardEvent) => {
            // input이나 textarea에서는 무시
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            // Ctrl/Cmd + A: 전체 선택
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                selectAll();
                return;
            }

            // Escape: 선택 해제 또는 미리보기 닫기
            if (e.key === 'Escape') {
                e.preventDefault();
                if (previewItem) {
                    setPreviewItem(null);
                } else {
                    clearSelection();
                }
                return;
            }

            // Delete/Backspace: 선택된 항목 삭제
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedItems.length > 0 && channelId) {
                    e.preventDefault();
                    // 확인 다이얼로그 없이 바로 삭제하지 않음 - 사용자에게 확인 필요
                    // 여기서는 delete 키 이벤트를 발생시켜서 DeleteDialog를 열도록 함
                    const event = new CustomEvent('firedrive:delete-request');
                    window.dispatchEvent(event);
                }
                return;
            }

            // Enter: 선택된 항목 열기 (단일 선택일 때만)
            if (e.key === 'Enter') {
                if (selectedItems.length === 1) {
                    e.preventDefault();
                    openItem(selectedItems[0]);
                }
                return;
            }
        },
        [channelId, selectedItems, selectAll, clearSelection, openItem, setPreviewItem, previewItem]
    );

    // 마우스 뒤로가기/앞으로가기 버튼 핸들러
    const handleMouseButton = useCallback(
        (e: MouseEvent) => {
            // button 3: 뒤로가기, button 4: 앞으로가기
            if (e.button === 3) {
                e.preventDefault();
                goBack();
            } else if (e.button === 4) {
                e.preventDefault();
                goForward();
            }
        },
        [goBack, goForward]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mouseup', handleMouseButton);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mouseup', handleMouseButton);
        };
    }, [handleKeyDown, handleMouseButton]);
}
