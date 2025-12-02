import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
    USER_SETTING_CHAT_ALARM_FIELD,
    USER_SETTING_DOC_PATH,
} from "../settings";

/**
 * 사용자 설정 생성
 * @param userId - 사용자 ID
 */
export default async function createSetting(userId: string) {
    await setDoc(doc(db, USER_SETTING_DOC_PATH(userId)), {
        [USER_SETTING_CHAT_ALARM_FIELD]: true,
    });
}
