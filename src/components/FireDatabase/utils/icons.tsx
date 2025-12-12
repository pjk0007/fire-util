import {
    AlignLeft,
    Calendar,
    CaseSensitive,
    Clock3,
    Hash,
    SquareCheck,
} from 'lucide-react';

export enum IconName {
    Name = 'name',
    Clock = 'clock',
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Date = 'date',
}

export function getIcon(name: IconName) {
    switch (name) {
        case IconName.Name:
            return <CaseSensitive className="size-4" />;
        case IconName.Clock:
            return <Clock3 className="size-4" />;
        case IconName.String:
            return <AlignLeft className="size-4" />;
        case IconName.Number:
            return <Hash className="size-4" />;
        case IconName.Boolean:
            return <SquareCheck className="size-4" />;
        case IconName.Date:
            return <Calendar className="size-4" />;
        default:
            return null;
    }
}

export function getAllIcons(): { name: IconName; label: string; tags: string[] }[] {
    return [
        { name: IconName.Name, label: '이름', tags: ['이름', 'name', '텍스트', 'text'] },
        { name: IconName.Clock, label: '시계', tags: ['시계', 'clock', '시간', 'time'] },
        { name: IconName.String, label: '문자열', tags: ['문자열', 'string', '텍스트', 'text', '글자'] },
        { name: IconName.Number, label: '숫자', tags: ['숫자', 'number', '번호', '#'] },
        { name: IconName.Boolean, label: '체크박스', tags: ['체크박스', 'checkbox', 'boolean', '불린', '선택'] },
        { name: IconName.Date, label: '날짜', tags: ['날짜', 'date', '달력', 'calendar'] },
    ];
}
