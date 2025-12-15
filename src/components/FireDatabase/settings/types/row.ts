import { Timestamp } from 'firebase/firestore';

export interface FireDatabaseRow {
    id: string;
    name: string;
    data: { [columnId: string]: FireDatabaseData };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type FireDatabaseData =
    | FireDatabaseDataString
    | FireDatabaseDataNumber
    | FireDatabaseDataBoolean
    | FireDatabaseDataDate
    | FireDatabaseDataSelect
    | FireDatabaseDataMultiSelect
    | FireDatabaseDataRelation;
export type FireDatabaseDataString = string;
export type FireDatabaseDataNumber = number | null;
export type FireDatabaseDataBoolean = boolean;
export type FireDatabaseDataDate = {
    start: Timestamp | null;
    end: Timestamp | null;
    includeEnd: boolean;
    includeTime: boolean;
};
export type FireDatabaseDataSelect = string;
export type FireDatabaseDataMultiSelect = string[];
export type FireDatabaseDataRelation = {
    databaseId: string;
    rowId: string;
} | null;
