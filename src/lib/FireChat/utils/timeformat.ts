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

export function getDateString(
    date: Timestamp,
    {
        separator = '-',
        fullYear = false,
    }: { separator?: string; fullYear?: boolean } = {
        separator: '-',
        fullYear: false,
    }
) {
    if (!date || !date.toDate()) return '';
    const d = date.toDate();
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return [fullYear ? year : year.toString().slice(-2), month, day].join(
        separator
    );
}
