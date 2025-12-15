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
    },
    {
        type: 'select',
        name: '단일 선택',
        icon: IconName.Select,
        tags: ['select', '단일 선택', '선택'],
        options: ['옵션 1', '옵션 2', '옵션 3'],
    },
    {
        type: 'multi-select',
        name: '다중 선택',
        icon: IconName.List,
        tags: ['multi-select', '다중 선택', '선택'],
        options: ['옵션 1', '옵션 2', '옵션 3'],
    },
    {
        type: 'relation',
        name: '관계형',
        icon: IconName.Relation,
        tags: ['relation', '관계형', '레퍼런스'],
        relation: { databaseId: '', columnId: '' },
    },
];
