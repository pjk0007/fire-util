/**
 * 파일명에서 위험한 문자와 경로 인젝션을 방지
 * - 경로 구분자 제거 (/, \, ..)
 * - 특수 문자 제거
 * - 공백 정리
 */
export default function sanitizeFileName(fileName: string): string {
    if (!fileName) return 'unnamed';

    // 경로 구분자와 상위 디렉토리 참조 제거
    let sanitized = fileName
        .replace(/\.\./g, '') // .. 제거
        .replace(/[/\\]/g, '') // / 와 \ 제거
        .replace(/[\x00-\x1f\x80-\x9f]/g, '') // 제어 문자 제거
        .replace(/[<>:"|?*]/g, '') // Windows 금지 문자 제거
        .trim();

    // 빈 문자열이면 기본값
    if (!sanitized) return 'unnamed';

    // 파일명 길이 제한 (255자)
    if (sanitized.length > 255) {
        const ext = sanitized.lastIndexOf('.');
        if (ext > 0) {
            const extension = sanitized.slice(ext);
            const name = sanitized.slice(0, 255 - extension.length);
            sanitized = name + extension;
        } else {
            sanitized = sanitized.slice(0, 255);
        }
    }

    return sanitized;
}
