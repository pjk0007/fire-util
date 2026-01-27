import { db } from "@/lib/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

export type SurveyDismissAction = "submit" | "skip_7_days" | "skip_today";

/**
 * dismiss action에 따라 다음 설문 표시 날짜 계산
 */
function calculateNextSurveyDate(action: SurveyDismissAction): Date {
    const now = new Date();

    switch (action) {
        case "submit":
        case "skip_7_days":
            // 설문 제출 또는 7일간 그만보기 → 7일 후
            const after7Days = new Date(now);
            after7Days.setDate(after7Days.getDate() + 7);
            return after7Days;

        case "skip_today":
            // 오늘 그만보기 → 다음 날
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;

        default:
            return now;
    }
}

export async function updateUserNextSurveyDate(userId: string, action: SurveyDismissAction): Promise<void> {
    const nextDate = calculateNextSurveyDate(action);

    await updateDoc(doc(db, `users/${userId}`), {
        nextSurveyDate: Timestamp.fromDate(nextDate),
    });
}
