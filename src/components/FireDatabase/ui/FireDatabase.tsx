import updateDatabase from '@/components/FireDatabase/api/updateDatabase';
import useDatabase from '@/components/FireDatabase/hooks/useDatabase';
import useDatabaseRows from '@/components/FireDatabase/hooks/useDatabaseRows';
import FireDatabaseTable from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTable';
import FireDatabaseViewButton, {
    FireDatabaseViewAddButton,
} from '@/components/FireDatabase/ui/FireDatabaseViewButton';
import { useEffect, useState } from 'react';

export default function FireDatabase({
    refetchDatabases,
    databaseId,
}: {
    refetchDatabases: () => void;
    databaseId: string;
}) {
    const { database } = useDatabase(databaseId as string);
    const { rows, refetch: refetchRows } = useDatabaseRows(
        databaseId as string
    );
    const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
    const [databaseName, setDatabaseName] = useState(database?.name || '');

    const currentView = database?.views.find(
        (view) => view.id === selectedViewId
    );

    useEffect(() => {
        setDatabaseName(database?.name || '');
        if (database?.views.length && !selectedViewId) {
            setSelectedViewId(database.views[0].id);
        }
    }, [database]);

    return (
        <div className="w-full h-full overflow-auto py-20 ">
            <input
                className="w-full text-2xl font-bold mb-4 focus:outline-none sticky left-0 px-20"
                value={databaseName}
                placeholder="새 데이터베이스"
                onChange={(e) => setDatabaseName(e.target.value)}
                onBlur={() =>
                    updateDatabase(databaseId, {
                        name: databaseName,
                    }).then(() => {
                        refetchDatabases();
                    })
                }
            />
            <div className="flex gap-1 mb-4 group sticky left-0 px-20">
                {database?.views.map((view) => (
                    <FireDatabaseViewButton
                        view={view}
                        key={view.id}
                        selectedViewId={selectedViewId}
                        setSelectedViewId={setSelectedViewId}
                    />
                ))}
                <FireDatabaseViewAddButton />
            </div>

            {database && currentView && (
                <FireDatabaseTable
                    rows={rows}
                    databaseId={database.id}
                    columns={database.columns}
                    refetchRows={refetchRows}
                    view={currentView}
                />
            )}
            {database && currentView && (
                <FireDatabaseTable
                    rows={rows}
                    databaseId={database.id}
                    columns={database.columns}
                    refetchRows={refetchRows}
                    view={currentView}
                />
            )}
        </div>
    );
}
