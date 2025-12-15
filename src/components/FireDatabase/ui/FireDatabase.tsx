import { FireDatabaseProvider, useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';
import FireDatabaseTable from '@/components/FireDatabase/ui/FireDatabaseTable';
import FireDatabaseViewButton, {
    FireDatabaseViewAddButton,
} from '@/components/FireDatabase/ui/FireDatabaseViewButton';

function FireDatabaseContent() {
    const {
        views,
        databaseName,
        setDatabaseName,
        updateDatabaseName,
        selectedViewId,
        setSelectedViewId,
        currentView,
        refetchViews
    } = useFireDatabase();

    return (
        <div className="w-full h-full overflow-auto py-20">
            <input
                className="w-full text-2xl font-bold mb-4 focus:outline-none sticky left-0 px-20"
                value={databaseName}
                placeholder="새 데이터베이스"
                onChange={(e) => setDatabaseName(e.target.value)}
                onBlur={updateDatabaseName}
            />
            <div className="flex gap-1 mb-4 group sticky left-0 px-20">
                {views.map((view) => (
                    <FireDatabaseViewButton
                        view={view}
                        key={view.id}
                        selectedViewId={selectedViewId}
                        setSelectedViewId={setSelectedViewId}
                        refetchViews={refetchViews}
                    />
                ))}
                <FireDatabaseViewAddButton />
            </div>

            {currentView && <FireDatabaseTable />}
        </div>
    );
}

export default function FireDatabase({
    refetchDatabases,
    databaseId,
}: {
    refetchDatabases: () => void;
    databaseId: string;
}) {
    return (
        <FireDatabaseProvider databaseId={databaseId} refetchDatabases={refetchDatabases}>
            <FireDatabaseContent />
        </FireDatabaseProvider>
    );
}
