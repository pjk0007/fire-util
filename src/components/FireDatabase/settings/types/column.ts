import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { IconName } from '@/components/FireDatabase/utils/icons';

export const COLUMN_LIST: Pick<
    FireDatabaseColumn,
    'type' | 'name' | 'icon' | 'tags' | 'options' | 'relation'
>[] = [
    {
        type: 'string',
        name: '텍스트',
        icon: IconName.String,
        tags: [
            'text',
            'string',
            'short text',
            '텍스트',
            '문자열',
            '짧은 텍스트',
        ],
    },
    {
        type: 'number',
        name: '숫자',
        icon: IconName.Number,
        tags: ['number', '숫자', '수치'],
    },
    {
        type: 'boolean',
        name: '체크박스',
        icon: IconName.Boolean,
        tags: ['boolean', 'checkbox', '체크박스', '불리언'],
    },
    {
        type: 'date',
        name: '날짜',
        icon: IconName.Date,
        tags: ['date', '날짜', '데이트', '시간'],
    }
];
