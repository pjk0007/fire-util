import { DATABASE_COLLECTION } from "@/components/FireDatabase/settings/constants";
import { FireDatabaseView } from "@/components/FireDatabase/settings/types/database";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function updateDatabaseView(
    databaseId: string,
    viewId: string,
    updateView: Partial<FireDatabaseView>
) {
    const databaseDoc = doc(db, DATABASE_COLLECTION, databaseId);
    const databaseSnap = await getDoc(databaseDoc);

    if (!databaseSnap.exists()) {
        throw new Error("Database not found");
    }

    const databaseData = databaseSnap.data();
    const views: FireDatabaseView[] = databaseData.views || [];

    const updatedViews = views.map((view) =>
        view.id === viewId ? { ...view, ...updateView } : view
    );

    return await updateDoc(databaseDoc, { views: updatedViews });
}
