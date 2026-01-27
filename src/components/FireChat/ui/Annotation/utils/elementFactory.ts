import type { IAnnotationElement, DrawingTool } from "../types";

let elementCounter = 0;

const generateElementId = () => {
    return `${Date.now()}-${elementCounter++}`;
};

/**
 * 펜슬 엘리먼트 생성
 */
export function createPencilElement(path: { x: number; y: number }[], color: string): IAnnotationElement {
    return {
        id: generateElementId(),
        tool: "pencil",
        startX: path[0].x,
        startY: path[0].y,
        color,
        path,
    };
}

/**
 * 도형 엘리먼트 생성 (rect, circle)
 */
export function createShapeElement(
    tool: "rect" | "circle",
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
): IAnnotationElement {
    return {
        id: generateElementId(),
        tool,
        startX,
        startY,
        endX,
        endY,
        color,
    };
}

/**
 * 텍스트 엘리먼트 생성
 */
export function createTextElement(x: number, y: number, text: string, color: string): IAnnotationElement {
    return {
        id: generateElementId(),
        tool: "text",
        startX: x,
        startY: y,
        color,
        text,
    };
}

/**
 * 미리보기 엘리먼트 생성 (펜슬)
 */
export function createPencilPreview(
    startX: number,
    startY: number,
    path: { x: number; y: number }[],
    color: string,
): IAnnotationElement {
    return {
        id: "preview",
        tool: "pencil",
        startX,
        startY,
        color,
        path,
    };
}

/**
 * 미리보기 엘리먼트 생성 (도형)
 */
export function createShapePreview(
    tool: DrawingTool,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string,
): IAnnotationElement {
    return {
        id: "preview",
        tool,
        startX,
        startY,
        endX,
        endY,
        color,
    };
}
