import type { IAnnotationElement } from "./types";
import { cn } from "@/lib/utils";

interface AnnotationElementProps {
    element: IAnnotationElement;
    isSelected?: boolean;
    isPreview?: boolean;
    onClick?: () => void;
    containerWidth: number;
    containerHeight: number;
}

/**
 * 개별 어노테이션 요소 렌더링 (SVG)
 * pencil, text, rect, circle 도구만 지원
 */
export default function AnnotationElement({
    element,
    isSelected,
    isPreview,
    onClick,
    containerWidth,
    containerHeight,
}: AnnotationElementProps) {
    const { tool, startX, startY, endX, endY, color } = element;

    // 상대좌표 → 절대좌표 변환
    const x1 = startX * containerWidth;
    const y1 = startY * containerHeight;
    const x2 = (endX ?? startX) * containerWidth;
    const y2 = (endY ?? startY) * containerHeight;

    const commonProps = {
        stroke: color,
        strokeWidth: isSelected ? 5 : 7,
        fill: "none",
        className: cn("cursor-pointer", isPreview && "opacity-70", isSelected && "drop-shadow-lg"),
        onClick,
        style: { pointerEvents: isPreview ? "none" : "auto" } as const,
    };

    switch (tool) {
        case "pencil":
            // 경로가 없으면 렌더링하지 않음
            if (!element.path || element.path.length < 2) return null;

            // path 배열을 SVG path 문자열로 변환
            const pathPoints = element.path
                .map((p, i) => {
                    const px = p.x * containerWidth;
                    const py = p.y * containerHeight;
                    return i === 0 ? `M ${px} ${py}` : `L ${px} ${py}`;
                })
                .join(" ");

            return <path d={pathPoints} {...commonProps} strokeLinecap="round" strokeLinejoin="round" />;

        case "text":
            const textContent = element.text || "";

            return (
                <text
                    x={x1}
                    y={y1}
                    fill={color}
                    fontSize={32}
                    fontWeight="bold"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    className={cn("cursor-pointer", isPreview && "opacity-70")}
                    onClick={onClick}
                    style={{ pointerEvents: isPreview ? "none" : "auto" }}
                >
                    {textContent}
                </text>
            );

        case "rect":
            const rectX = Math.min(x1, x2);
            const rectY = Math.min(y1, y2);
            const rectWidth = Math.abs(x2 - x1);
            const rectHeight = Math.abs(y2 - y1);

            return <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} {...commonProps} />;

        case "circle":
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;

            return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...commonProps} />;

        default:
            return null;
    }
}
