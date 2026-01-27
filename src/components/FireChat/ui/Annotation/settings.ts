import type { DrawingTool } from "./types";

// 기본 색상
export const ANNOTATION_DEFAULT_COLOR = "#FF0000";
export const ANNOTATION_COLORS = [
    "#FF0000", // 빨강
    "#FF6B00", // 주황
    "#FFD600", // 노랑
    "#00C853", // 초록
    "#2196F3", // 파랑
    "#9C27B0", // 보라
    "#000000", // 검정
    "#FFFFFF", // 화이트
];

// 그리기 도구 설정
export const DRAWING_TOOLS: {
    id: DrawingTool;
    label: string;
    icon: string;
}[] = [
    { id: "pencil", label: "펜슬", icon: "pencil" },
    { id: "text", label: "텍스트", icon: "type" },
    { id: "rect", label: "사각형", icon: "square" },
    { id: "circle", label: "원", icon: "circle" },
];

// 로컬라이제이션
export const ANNOTATION_LOCALE = {
    // 도구
    TOOL_SELECT: "선택",
    TOOL_RECT: "사각형",
    TOOL_CIRCLE: "원",
    TOOL_TEXT: "텍스트",
    TOOL_PENCIL: "펜슬",
    COLOR: "색상",
    // 다이얼로그
    DIALOG_TITLE: "이미지 수정",
    IMAGE_ALT: "이미지",
    // 버튼
    BTN_CLEAR: "초기화",
    BTN_CANCEL: "취소",
    BTN_COMPLETE: "완료",
    BTN_PROCESSING: "처리 중...",
    // 입력
    TEXT_PLACEHOLDER: "텍스트 입력",
};
