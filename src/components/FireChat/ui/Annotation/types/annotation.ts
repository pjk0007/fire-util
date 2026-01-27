/**
 * 그리기 도구 타입
 * pencil, text, rect, circle만 지원
 */
export type DrawingTool = 'pencil' | 'text' | 'rect' | 'circle';

/**
 * 어노테이션 요소 (그리기 도구로 그린 개별 요소)
 */
export interface IAnnotationElement {
    id: string;
    tool: DrawingTool;
    startX: number; // 0-1 상대좌표
    startY: number; // 0-1 상대좌표
    endX?: number; // 0-1 상대좌표
    endY?: number; // 0-1 상대좌표
    color: string; // 기본: #FF0000
    path?: { x: number; y: number }[]; // 펜슬 전용 - 경로 점들
    text?: string; // 텍스트 전용 - 텍스트 내용
}
