/**
 * Migration script to move views from database document fields to subcollection
 *
 * Usage:
 * 1. Make sure you have the Firebase config in your environment
 * 2. Run: npx ts-node scripts/migrateViewsToSubcollection.ts
 */

const DATABASE_COLLECTION = 'databases';
const DATABASE_ROW_SUBCOLLECTION = 'rows';
const DATABASE_VIEW_SUBCOLLECTION = 'views';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

import { initializeApp } from 'firebase/app';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc,
} from 'firebase/firestore';

interface FireDatabaseView {
    id: string;
    type: 'table' | 'kanban' | 'gallery' | 'calendar';
    name: string;
    sorting: any[];
    columnOrder: string[];
    columnSizing: Record<string, number>;
    columnVisibility: Record<string, boolean>;
    groupBy: any | null;
    filterBy: any | null;
}

async function migrateViewsToSubcollection() {
    console.log('Starting migration: moving views to subcollection...');

    try {
        // Get all databases
        // const databasesSnapshot = await db
        //     .collection(DATABASE_COLLECTION)
        //     .get();
        const databasesSnapshot = await getDocs(
            collection(db, DATABASE_COLLECTION)
        );

        console.log(`Found ${databasesSnapshot.size} databases to migrate`);

        let migratedCount = 0;
        let errorCount = 0;

        // Process each database
        for (const databaseDoc of databasesSnapshot.docs) {
            const databaseId = databaseDoc.id;
            const databaseData = databaseDoc.data();

            console.log(
                `\nProcessing database: ${databaseId} (${databaseData.name})`
            );

            // Check if database has views in the old format
            if (!databaseData.views || !Array.isArray(databaseData.views)) {
                console.log(`  - No views found, skipping`);
                continue;
            }

            const views: FireDatabaseView[] = databaseData.views;
            console.log(`  - Found ${views.length} views to migrate`);

            try {
                // Create each view in the subcollection
                for (const view of views) {
                    const viewRef = doc(
                        db,
                        DATABASE_COLLECTION,
                        databaseId,
                        DATABASE_VIEW_SUBCOLLECTION,
                        view.id
                    );

                    await setDoc(viewRef, {
                        ...view,
                        createdAt: databaseData.createdAt || new Date(),
                        updatedAt: new Date(),
                    });

                    console.log(
                        `    ✓ Migrated view: ${view.name} (${view.id})`
                    );
                }

                await updateDoc(doc(db, DATABASE_COLLECTION, databaseId), {
                    views: null,
                });

                console.log(`  ✓ Removed views field from database document`);
                migratedCount++;
            } catch (error) {
                console.error(
                    `  ✗ Error migrating database ${databaseId}:`,
                    error
                );
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('Migration complete!');
        console.log(`Successfully migrated: ${migratedCount} databases`);
        console.log(`Errors: ${errorCount} databases`);
        console.log('='.repeat(50));
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateViewsToSubcollection()
    .then(() => {
        console.log('\nMigration script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nMigration script failed:', error);
        process.exit(1);
    });
