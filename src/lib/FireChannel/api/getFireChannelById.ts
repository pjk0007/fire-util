import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FireMessage, FireMessageContent } from "@/lib/FireChat/settings";
import { CHANNEL_COLLECTION, FireChannel } from "../settings";

export async function getFireChannelById<
    T extends FireMessageContent = FireMessageContent,
    M extends FireMessage<T> = FireMessage<T>
>(channelId: string): Promise<FireChannel<M, T> | null> {
    const channelDoc = await getDoc(doc(db, `${CHANNEL_COLLECTION}/${channelId}`));

    if (!channelDoc.exists()) {
        return null;
    }

    return channelDoc.data() as FireChannel<M, T>;
}
