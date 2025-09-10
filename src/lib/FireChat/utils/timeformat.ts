import { Timestamp } from "firebase/firestore";

export function formatTimeString(date: Timestamp, locale: string = "ko-KR") {
    // 오후 1:51
    return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date.toDate());
}