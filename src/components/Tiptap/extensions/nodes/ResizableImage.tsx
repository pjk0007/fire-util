import * as React from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { cn } from '@/lib/utils';

export const ResizableImage: React.FC<NodeViewProps> = ({
    node,
    updateAttributes,
    selected,
}) => {
    const [isResizing, setIsResizing] = React.useState(false);
    const imageRef = React.useRef<HTMLImageElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const { src, alt, title, width, textAlign } = node.attrs;

    const handleMouseDown = (
        e: React.MouseEvent,
        direction: 'left' | 'right'
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const startWidth = imageRef.current?.offsetWidth || 0;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newWidth =
                direction === 'right'
                    ? startWidth + deltaX
                    : startWidth - deltaX;

            if (newWidth >= 100 && newWidth <= 1200) {
                updateAttributes({ width: newWidth });
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const alignmentStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent:
            textAlign === 'center'
                ? 'center'
                : textAlign === 'right'
                  ? 'flex-end'
                  : 'flex-start',
    };

    return (
        <NodeViewWrapper
            className="relative my-2"
            style={alignmentStyle}
            data-text-align={textAlign}
        >
            <div
                ref={containerRef}
                className={cn(
                    'relative inline-block group',
                    selected && 'ring-2 ring-primary ring-offset-2',
                    isResizing && 'select-none'
                )}
                style={{ width: width ? `${width}px` : 'auto' }}
            >
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt || ''}
                    title={title || ''}
                    className="block max-w-full h-auto"
                    style={{ width: '100%' }}
                    draggable={false}
                />

                {/* 리사이즈 핸들 - 선택 시에만 표시 */}
                {selected && (
                    <>
                        {/* 왼쪽 핸들 */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleMouseDown(e, 'left')}
                        >
                            <div className="w-1 h-8 bg-primary rounded-full" />
                        </div>

                        {/* 오른쪽 핸들 */}
                        <div
                            className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => handleMouseDown(e, 'right')}
                        >
                            <div className="w-1 h-8 bg-primary rounded-full" />
                        </div>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
};

export default ResizableImage;
