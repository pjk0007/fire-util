import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { CaseSensitive, Clock3 } from 'lucide-react';

export default function ColumnHeader({
    column,
}: {
    column: FireDatabaseColumn;
}) {
    switch (column.type) {
        case 'id':
            return 'ID';
        case 'name':
            return (
                <div className="flex gap-2 items-center">
                    <CaseSensitive className="size-4" />
                    {column.name}
                </div>
            );
        case 'createdAt':
        case 'updatedAt':
            return (
                <div className="flex items-center gap-2">
                    <Clock3 className="size-4" />
                    {column.name}
                </div>
            );
        default:
            return column.name;
    }
}
