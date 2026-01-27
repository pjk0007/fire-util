import { useCallback, useRef, useState } from "react";
import type { IAnnotationElement, DrawingTool } from "./types";
import AnnotationElement from "./AnnotationElement";
import { ANNOTATION_LOCALE } from "./settings";

interface AnnotationCanvasProps {
    imageUrl: string;
    annotations: { id: string; elements: IAnnotationElement[] }[];
    activeTool: DrawingTool | null;
    previewElement: IAnnotationElement | null;
    selectedAnnotationId: string | null;
    onSelectAnnotation: (id: string | null) => void;
    onMouseDown: (x: number, y: number, screenX: number, screenY: number) => void;
    onMouseMove: (x: number, y: number, screenX: number, screenY: number) => void;
    onMouseUp: () => void;
}

/**
 * 이미지 + 어노테이션 캔버스
 * 원본 이미지 크기로 표시, 스크롤로 이동
 */
export default function AnnotationCanvas({
    imageUrl,
    annotations,
    activeTool,
    previewElement,
    selectedAnnotationId,
    onSelectAnnotation,
    onMouseDown,
    onMouseMove,
    onMouseUp,
}: AnnotationCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const handleImageLoad = useCallback(() => {
        if (imageRef.current) {
            // 원본 이미지 크기 사용
            setImageSize({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
            });
        }
    }, []);

    const getRelativePosition = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!imageRef.current || imageSize.width === 0) {
                return { x: 0, y: 0 };
            }

            // 이미지 엘리먼트 기준으로 좌표 계산
            const imgRect = imageRef.current.getBoundingClientRect();
            const x = (e.clientX - imgRect.left) / imgRect.width;
            const y = (e.clientY - imgRect.top) / imgRect.height;

            return { x, y };
        },
        [imageSize]
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!activeTool) return;
            const { x, y } = getRelativePosition(e);
            onMouseDown(x, y, e.clientX, e.clientY);
        },
        [activeTool, getRelativePosition, onMouseDown]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const { x, y } = getRelativePosition(e);
            onMouseMove(x, y, e.clientX, e.clientY);
        },
        [getRelativePosition, onMouseMove]
    );

    const handleMouseUp = useCallback(() => {
        onMouseUp();
    }, [onMouseUp]);

    // 모든 어노테이션의 요소들을 평탄화
    const allElements: { element: IAnnotationElement; annotationId: string }[] = [];
    annotations.forEach((annotation) => {
        annotation.elements.forEach((element) => {
            allElements.push({ element, annotationId: annotation.id });
        });
    });

    const getCursor = () => {
        if (activeTool === "text") return "text";
        if (activeTool) return "crosshair";
        return "default";
    };

    return (
        <div
            ref={containerRef}
            className="relative overflow-auto select-none"
            style={{ cursor: getCursor() }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt={ANNOTATION_LOCALE.IMAGE_ALT}
                    className="block"
                    onLoad={handleImageLoad}
                    draggable={false}
                />

                {/* SVG 오버레이 - 이미지와 동일한 크기로 100% */}
                {imageSize.width > 0 && imageSize.height > 0 && (
                    <svg
                        className="absolute top-0 left-0 pointer-events-none"
                        style={{ width: '100%', height: '100%' }}
                        viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                        preserveAspectRatio="none"
                    >
                        {allElements.map(({ element, annotationId }) => (
                            <AnnotationElement
                                key={element.id}
                                element={element}
                                isSelected={selectedAnnotationId === annotationId}
                                containerWidth={imageSize.width}
                                containerHeight={imageSize.height}
                                onClick={!activeTool ? () => onSelectAnnotation(annotationId) : undefined}
                            />
                        ))}

                        {previewElement && (
                            <AnnotationElement
                                element={previewElement}
                                isPreview
                                containerWidth={imageSize.width}
                                containerHeight={imageSize.height}
                            />
                        )}
                    </svg>
                )}
            </div>
        </div>
    );
}
