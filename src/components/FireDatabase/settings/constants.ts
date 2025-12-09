import { FireDatabaseView, FireDatabaseColumn } from './types/database';

export const DATABASE_COLLECTION = 'databases';
export const DATABASE_ROW_SUBCOLLECTION = 'rows';
export const DEFAULT_DATABASE_NAME = '새 데이터베이스';
export const DEFAULT_DATABASE_ROW_NAME = '새 데이터';

export const DEFAULT_DATABASE_VIEWS: FireDatabaseView[] = [
    {
        id: 'view_default',
        type: 'table',
        name: '전체',
        sorting: [],
        columnOrder: ['name', 'id', 'createdAt', 'updatedAt'],
        columnSizing: {
            id: 100,
            name: 200,
            createdAt: 100,
            updatedAt: 100,
        },
        columnVisibility: {
            name: true,
            id: false,
            createdAt: false,
            updatedAt: false,
        },
        groupBy: null,
        filterBy: null,
    },
];

export const DEFAULT_DATABASE_COLUMNS: FireDatabaseColumn[] = [
    {
        id: 'id',
        name: 'ID',
        type: 'id',
    },
    {
        id: 'name',
        name: '이름',
        type: 'name',
    },
    {
        id: 'createdAt',
        name: '생성일',
        type: 'createdAt',
    },
    {
        id: 'updatedAt',
        name: '수정일',
        type: 'updatedAt',
    },
];
