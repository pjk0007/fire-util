import {
    FireDatabaseViewFilter,
    FireDatabaseViewGroup,
    FireDatabaseViewSort,
} from '@/components/FireDatabase/settings/types/view';
import { IconName } from '@/components/FireDatabase/utils/icons';
import {
    ColumnOrderState,
    ColumnSizingState,
    ColumnSort,
    VisibilityState,
} from '@tanstack/react-table';
import { Timestamp } from 'firebase/firestore';

export interface FireDatabase {
    id: string;
    name: string;
    columns: FireDatabaseColumn[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isDeleted?: boolean;
    deletedAt?: Timestamp;
}

export interface FireDatabaseColumn {
    id: string;
    name: string;
    type:
        | 'id'
        | 'name'
        | 'createdAt'
        | 'updatedAt'
        | 'string'
        | 'number'
        | 'boolean'
        | 'date'
        | 'select'
        | 'multi-select'
        | 'relation'
        | 'file'
        | 'formula';
    icon?: IconName | null;
    options?: string[];
    tags: string[];
    dateformat?: string;
    relation?: { databaseId: string; columnId: string };
}

export interface FireDatabaseView {
    id: string;
    type: FireDatabaseViewType;
    name: string;
    sorting: ColumnSort[];
    columnOrder: ColumnOrderState;
    columnSizing: ColumnSizingState;
    columnVisibility: VisibilityState;
    groupBy: FireDatabaseViewGroup | null;
    filterBy: FireDatabaseViewFilter | null;
}

export type FireDatabaseViewType = 'table' | 'kanban' | 'gallery' | 'calendar';
