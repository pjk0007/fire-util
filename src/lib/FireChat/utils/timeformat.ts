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

/**
 * Returns a localized relative time string.
 * - 0..59 seconds => localized "now" (rtf with seconds=0)
 * - 1..59 minutes => "n minutes ago"
 * - 1..23 hours => "n hours ago"
 * - >=1 day => localized month/day (e.g. "8월 24일" for ko)
 */
export function formatRelativeTime(input: Timestamp) {
    const loc = navigator.language;
    const date = input.toDate();
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) {
        // future date - fallback to time string
        return new Intl.DateTimeFormat(loc, {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) {
        // use RelativeTimeFormat for 'now' where supported
        try {
            const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });
            return rtf.format(0, 'second');
        } catch (e) {
            console.log(e);
            // fallback to neutral English
            return 'now';
        }
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        try {
            const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });
            return rtf.format(-minutes, 'minute');
        } catch (e) {
            console.log(e);
            return `${minutes} minutes ago`;
        }
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        try {
            const rtf = new Intl.RelativeTimeFormat(loc, { numeric: 'auto' });
            return rtf.format(-hours, 'hour');
        } catch (e) {
            console.log(e);
            return `${hours} hours ago`;
        }
    }

    // 1 day or more -> show month/day localized
    try {
        return new Intl.DateTimeFormat(loc, {
            month: 'short',
            day: 'numeric',
        }).format(date);
    } catch (e) {
        console.log(e);
        // fallback to yyyy-mm-dd
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            '0'
        )}-${String(date.getDate()).padStart(2, '0')}`;
    }
}
