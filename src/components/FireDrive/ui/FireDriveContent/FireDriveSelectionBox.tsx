import { useFireDrive } from '../../contexts';
import { useFireDriveSelectionBox } from '../../hooks';
import { ReactNode } from 'react';

interface FireDriveSelectionBoxProps {
    children: ReactNode;
}

export default function FireDriveSelectionBox({
    children,
}: FireDriveSelectionBoxProps) {
    const { items, setSelectedItems, selectedItems, clearSelection } = useFireDrive();

    const { containerRef, selectionBox, boxStyle, handleMouseDown } = useFireDriveSelectionBox({
        items,
        selectedItems,
        setSelectedItems,
        clearSelection,
    });

    return (
        <div
            ref={containerRef}
            className="relative flex-1 select-none overflow-hidden h-full"
            onMouseDown={handleMouseDown}
        >
            {children}

            {/* 선택 박스 */}
            {selectionBox && (
                <div
                    className="absolute border border-primary/70 bg-primary/10 pointer-events-none z-50 rounded-sm"
                    style={boxStyle}
                />
            )}
        </div>
    );
}
