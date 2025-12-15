import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    Dispatch,
    SetStateAction,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import {
    ColumnOrderState,
    ColumnSizingState,
    SortingState,
    VisibilityState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    Table as TanStackTable,
} from '@tanstack/react-table';
import {
    FireDatabase,
    FireDatabaseColumn,
    FireDatabaseView,
} from '@/components/FireDatabase/settings/types/database';
import { FireDatabaseRow } from '@/components/FireDatabase/settings/types/row';
import useDatabase from '@/components/FireDatabase/hooks/useDatabase';
import useDatabaseRows from '@/components/FireDatabase/hooks/useDatabaseRows';
import useDatabaseViews from '@/components/FireDatabase/hooks/useDatabaseViews';
import updateView from '@/components/FireDatabase/api/updateView';
import updateDatabase from '@/components/FireDatabase/api/updateDatabase';
import { databaseToTableColumns } from '@/components/FireDatabase/utils/columns';
import createRow from '@/components/FireDatabase/api/createRow';
import updateColumnAPI from '@/components/FireDatabase/api/updateColumn';
import createColumnAPI from '@/components/FireDatabase/api/createColumn';
import deleteColumnAPI from '@/components/FireDatabase/api/deleteColumn';

interface FireDatabaseContextValue {
    // Database
    databaseId: string;
    database: FireDatabase | null;
    databaseName: string;
    setDatabaseName: (name: string) => void;
    updateDatabaseName: () => Promise<void>;

    // View
    views: FireDatabaseView[];
    selectedViewId: string | null;
    setSelectedViewId: (id: string) => void;
    currentView: FireDatabaseView | null;

    // Table
    table: TanStackTable<FireDatabaseRow> | null;
    rows: FireDatabaseRow[];
    setRows: Dispatch<SetStateAction<FireDatabaseRow[]>>;
    columns: FireDatabaseColumn[];
    refetchRows: () => void;

    // Table State
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    columnSizing: ColumnSizingState;
    setColumnSizing: Dispatch<SetStateAction<ColumnSizingState>>;
    columnOrder: ColumnOrderState;
    setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>>;
    columnVisibility: VisibilityState;
    setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
    rowSelection: Record<string, boolean>;
    setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;

    // Actions
    addColumn: (column: FireDatabaseColumn) => Promise<void>;
    updateColumn: (
        columnId: string,
        updates: Partial<FireDatabaseColumn>
    ) => void;
    deleteColumn: (columnId: string) => Promise<void>;
    addRow: () => Promise<void>;
    refetchDatabases: () => void;
}

const FireDatabaseContext = createContext<FireDatabaseContextValue | null>(
    null
);

export function FireDatabaseProvider({
    databaseId,
    refetchDatabases,
    children,
}: {
    databaseId: string;
    refetchDatabases: () => void;
    children: ReactNode;
}) {
    const { database } = useDatabase(databaseId);
    const { rows: fetchedRows, refetch: refetchRows } =
        useDatabaseRows(databaseId);
    const { views, refetch: refetchViews } = useDatabaseViews(databaseId);
    console.warn(databaseId, fetchedRows);

    const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
    const [databaseName, setDatabaseName] = useState(database?.name || '');
    const [cols, setCols] = useState<FireDatabaseColumn[]>(
        database?.columns || []
    );
    const [rows, setRows] = useState<FireDatabaseRow[]>([]);

    const currentView = views.find((view) => view.id === selectedViewId);

    const [sorting, setSorting] = useState<SortingState>(
        currentView?.sorting || []
    );
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
        currentView?.columnSizing || {}
    );
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
        currentView?.columnOrder || cols.map((col) => col.id)
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        currentView?.columnVisibility || {}
    );
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
        {}
    );

    // Track if initial load has happened
    const initializedRef = useRef(false);
    const isUpdatingViewRef = useRef(false);
    const currentDatabaseIdRef = useRef(databaseId);

    // Reset state when database changes
    useEffect(() => {
        if (currentDatabaseIdRef.current !== databaseId) {
            console.log(
                'Database changed from',
                currentDatabaseIdRef.current,
                'to',
                databaseId
            );
            currentDatabaseIdRef.current = databaseId;
            initializedRef.current = false;
            setSelectedViewId(null);
            // Don't call setRows([]) or refetchRows() - let the sync effect handle it
        }
    }, [databaseId]);

    // Sync fetched rows to local state
    useEffect(() => {
        console.log('fetchedRows effect:', {
            databaseId,
            fetchedRowsLength: fetchedRows.length,
            currentRowsLength: rows.length,
        });

        // Always sync fetchedRows to rows when data changes
        setRows(fetchedRows);
    }, [fetchedRows]);

    // Initialize database state
    useEffect(() => {
        console.log('Database effect:', {
            database: database?.id,
            initialized: initializedRef.current,
            currentDbId: currentDatabaseIdRef.current,
            viewsLength: views.length,
        });

        if (database && views.length > 0 && !initializedRef.current) {
            console.log('Initializing database state for:', database.id);
            setDatabaseName(database.name);
            setCols(database.columns);

            // Set first view
            const firstView = views[0];
            console.log(
                'Setting first view:',
                firstView.id,
                firstView.columnVisibility
            );
            setSelectedViewId(firstView.id);

            // Set view states
            setSorting(firstView.sorting || []);
            setColumnSizing(firstView.columnSizing || {});
            setColumnOrder(
                firstView.columnOrder || database.columns.map((col) => col.id)
            );
            setColumnVisibility(firstView.columnVisibility || {});

            initializedRef.current = true;
        }
    }, [database, views]);

    // Update view states when selectedViewId or currentView changes (but not during initialization)
    useEffect(() => {
        if (currentView && initializedRef.current && selectedViewId) {
            console.log(
                'Loading view state:',
                currentView.id,
                'with visibility:',
                currentView.columnVisibility
            );
            isUpdatingViewRef.current = true;
            setSorting(currentView.sorting || []);
            setColumnSizing(currentView.columnSizing || {});
            setColumnOrder(
                currentView.columnOrder || cols.map((col) => col.id)
            );
            setColumnVisibility(currentView.columnVisibility || {});
            console.log(
                'Set columnVisibility to:',
                currentView.columnVisibility || {}
            );
            // Reset flag after a brief delay to allow state updates to settle
            setTimeout(() => {
                isUpdatingViewRef.current = false;
            }, 0);
        }
    }, [selectedViewId, currentView, cols]);

    // Persist view state changes (but not during view loading)
    useEffect(() => {
        console.log('View state changed', {
            sorting,
            columnOrder,
            columnSizing,
            columnVisibility,
        });
        if (
            currentView &&
            !isUpdatingViewRef.current &&
            initializedRef.current
        ) {
            updateView(databaseId, currentView.id, {
                sorting,
                columnOrder,
                columnSizing,
                columnVisibility,
            });
        }
    }, [columnOrder, columnSizing, columnVisibility, sorting]);

    // Memoize table columns to prevent unnecessary re-creation
    const tableColumns = useMemo(
        () => databaseToTableColumns(databaseId, cols),
        [databaseId, cols]
    );

    const table = useReactTable({
        data: rows,
        columns: tableColumns,
        state: {
            sorting,
            columnOrder,
            columnSizing,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnOrderChange: setColumnOrder,
        onColumnSizingChange: setColumnSizing,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange',
        enableRowSelection: true,
        enableColumnResizing: true,
        columnResizeDirection: 'ltr',
    });

    const updateDatabaseName = useCallback(async () => {
        await updateDatabase(databaseId, { name: databaseName });
        refetchDatabases();
    }, [databaseId, databaseName, refetchDatabases]);

    const addColumn = useCallback(
        async (column: FireDatabaseColumn) => {
            // Optimistic update - immediately add to UI
            setCols((prev) => [...prev, column]);
            setColumnOrder((prev) => [...prev, column.id]);

            // Update database in background
            try {
                await createColumnAPI(databaseId, column);
                // Refetch views to ensure we have the latest columnOrder from all views
                await refetchViews();
            } catch (error) {
                // Rollback on error
                setCols((prev) => prev.filter((col) => col.id !== column.id));
                setColumnOrder((prev) => prev.filter((id) => id !== column.id));
                console.error('Failed to create column:', error);
                throw error; // Re-throw so caller can handle if needed
            }
        },
        [databaseId, refetchViews]
    );

    const updateColumn = useCallback(
        (columnId: string, updates: Partial<FireDatabaseColumn>) => {
            // Optimistic update for immediate UI feedback
            setCols((prev) =>
                prev.map((col) =>
                    col.id === columnId ? { ...col, ...updates } : col
                )
            );
            // Update database in background
            updateColumnAPI(databaseId, columnId, updates);
        },
        [databaseId]
    );

    const deleteColumn = useCallback(
        async (columnId: string) => {
            // Optimistic update - immediately remove from UI
            const columnToDelete = cols.find((col) => col.id === columnId);
            if (!columnToDelete) return;

            setCols((prev) => prev.filter((col) => col.id !== columnId));
            setColumnOrder((prev) => prev.filter((id) => id !== columnId));

            try {
                await deleteColumnAPI(databaseId, columnId);
                // Refetch views to ensure we have the latest columnOrder from all views
                await refetchViews();
            } catch (error) {
                // Rollback on error
                setCols((prev) => [...prev, columnToDelete]);
                setColumnOrder((prev) => [...prev, columnId]);
                console.error('Failed to delete column:', error);
                throw error; // Re-throw so caller can handle if needed
            }
        },
        [databaseId, cols]
    );

    const addRow = useCallback(async () => {
        await createRow(databaseId, {});
        refetchRows();
    }, [databaseId, refetchRows]);

    // Don't memoize context value - it causes infinite loops with table object
    // The performance cost of re-creating this object is minimal compared to the complexity of memoization
    const value: FireDatabaseContextValue = {
        databaseId,
        database: database || null,
        databaseName,
        setDatabaseName,
        updateDatabaseName,
        views,
        selectedViewId,
        setSelectedViewId,
        currentView: currentView || null,
        table: table as TanStackTable<FireDatabaseRow> | null,
        rows,
        setRows,
        columns: cols,
        refetchRows,
        sorting,
        setSorting,
        columnSizing,
        setColumnSizing,
        columnOrder,
        setColumnOrder,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        addColumn,
        updateColumn,
        deleteColumn,
        addRow,
        refetchDatabases,
    };

    return (
        <FireDatabaseContext.Provider value={value}>
            {children}
        </FireDatabaseContext.Provider>
    );
}

export function useFireDatabase() {
    const context = useContext(FireDatabaseContext);
    if (!context) {
        throw new Error(
            'useFireDatabase must be used within FireDatabaseProvider'
        );
    }
    return context;
}
