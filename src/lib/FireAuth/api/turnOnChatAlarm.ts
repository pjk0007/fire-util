import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
    USER_SETTING_CHAT_ALARM_FIELD,
    USER_SETTING_DOC_PATH,
} from "../settings";

/**
 * 채팅 알림 설정 켜기
 * @param userId - 사용자 ID
 */
export default async function turnOnChatAlarm(userId: string) {
    await updateDoc(doc(db, USER_SETTING_DOC_PATH(userId)), {
        [USER_SETTING_CHAT_ALARM_FIELD]: true,
    });
}
