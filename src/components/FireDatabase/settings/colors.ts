// Database color palette for badges, tags, and status
export type BadgeColor =
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red';

interface ColorSet {
    text: string;
    background: string;
    border: string;
}

// Color sets for badges, tags, and status
export const BADGE_COLORS: Record<BadgeColor, ColorSet> = {
    gray: {
        text: 'text-gray-500 dark:text-gray-300',
        background: 'bg-gray-100 dark:bg-gray-800',
        border: 'border-gray-300 dark:border-gray-600',
    },
    brown: {
        text: 'text-orange-900 dark:text-orange-300',
        background: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-300 dark:border-orange-700',
    },
    orange: {
        text: 'text-orange-700 dark:text-orange-300',
        background: 'bg-orange-100 dark:bg-orange-900/30',
        border: 'border-orange-400 dark:border-orange-600',
    },
    yellow: {
        text: 'text-yellow-700 dark:text-yellow-300',
        background: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-400 dark:border-yellow-600',
    },
    green: {
        text: 'text-green-700 dark:text-green-300',
        background: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-400 dark:border-green-600',
    },
    blue: {
        text: 'text-blue-700 dark:text-blue-300',
        background: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-400 dark:border-blue-600',
    },
    purple: {
        text: 'text-purple-700 dark:text-purple-300',
        background: 'bg-purple-100 dark:bg-purple-900/30',
        border: 'border-purple-400 dark:border-purple-600',
    },
    pink: {
        text: 'text-pink-700 dark:text-pink-300',
        background: 'bg-pink-100 dark:bg-pink-900/30',
        border: 'border-pink-400 dark:border-pink-600',
    },
    red: {
        text: 'text-red-700 dark:text-red-300',
        background: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-400 dark:border-red-600',
    },
};

// Helper function to get color classes
export function getBadgeColorClasses(
    color: BadgeColor,
    type: 'text' | 'background' | 'border' | 'all' = 'all'
): string {
    const colorSet = BADGE_COLORS[color];

    switch (type) {
        case 'text':
            return colorSet.text;
        case 'background':
            return colorSet.background;
        case 'border':
            return colorSet.border;
        case 'all':
            return `${colorSet.text} ${colorSet.background} ${colorSet.border}`;
        default:
            return '';
    }
}

// Get all available colors
export function getAllBadgeColors(): BadgeColor[] {
    return [
        'gray',
        'brown',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple',
        'pink',
        'red',
    ];
}

// Color labels in Korean
export const BADGE_COLOR_LABELS: Record<BadgeColor, string> = {
    gray: '회색',
    brown: '갈색',
    orange: '주황색',
    yellow: '노란색',
    green: '초록색',
    blue: '파란색',
    purple: '보라색',
    pink: '분홍색',
    red: '빨간색',
};
