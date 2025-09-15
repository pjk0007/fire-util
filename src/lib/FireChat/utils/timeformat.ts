import { Timestamp } from "firebase/firestore";

export function formatTimeString(date: Timestamp, locale: string = "ko-KR") {
    // 오후 1:51
    if(!date || !date.toDate()) return "";
    return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date.toDate());
}

export function formatDateString(date?: Timestamp, locale: string = "ko-KR") {
    // 2023. 8. 24.
    if(!date || !date.toDate()) return "";
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date?.toDate());
}