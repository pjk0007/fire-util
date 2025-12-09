import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';

export function rowsToTableData(rows: FireDatabaseRow[]) {
    return rows.map((row) => {
        const rowData: { [key: string]: any } = {
            id: row.id,
            name: row.name,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
        if (row.data) {
            Object.keys(row.data).forEach((key) => {
                rowData[key] = row.data[key];
            });
        }

        return rowData;
    });
}
