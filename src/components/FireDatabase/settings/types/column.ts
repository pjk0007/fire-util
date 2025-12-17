import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { IconName } from '@/components/FireDatabase/utils/icons';

export const COLUMN_LIST: Pick<
    FireDatabaseColumn,
    'type' | 'name' | 'icon' | 'tags' | 'options' | 'relation' | 'default'
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
        type: 'status',
        name: '상태',
        icon: IconName.Status,
        tags: ['status', '상태', '상황'],
        options: {
            progress: {
                name: '진행 중',
                color: 'blue',
            },
            completed: {
                name: '완료',
                color: 'green',
            },
        },
        default: {
            name: '시작 전',
            color: 'gray',
        },
    },
    {
        type: 'select',
        name: '단일 선택',
        icon: IconName.Select,
        tags: ['select', '단일 선택', '선택'],
        options: {},
    },
    {
        type: 'multi-select',
        name: '다중 선택',
        icon: IconName.List,
        tags: ['multi-select', '다중 선택', '선택'],
        options: {},
    },
    {
        type: 'relation',
        name: '관계형',
        icon: IconName.Relation,
        tags: ['relation', '관계형', '레퍼런스'],
        relation: { databaseId: '', columnId: '' },
    },
    {
        type: 'file',
        name: '파일',
        icon: IconName.File,
        tags: ['file', '파일', '첨부'],
    },
    {
        type: 'formula',
        name: '수식',
        icon: IconName.Formula,
        tags: ['formula', '수식', '계산'],
    },
];
