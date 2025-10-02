import { Timestamp } from 'firebase/firestore';

export function localeTimeString(date: Timestamp) {
    const locale = navigator.language;
    // 오후 1:51
    if (!date || !date.toDate()) return '';
    return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date.toDate());
}

export function localeDateString(date?: Timestamp) {
    const locale = navigator.language;
    // 2023. 8. 24.
    if (!date || !date.toDate()) return '';
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date?.toDate());
}
