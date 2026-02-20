// 초를 분:초 또는 시:분:초 형식으로 변환
export function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}초`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}시간 ${minutes}분`;
    }

    return `${minutes}분 ${secs}초`;
}
