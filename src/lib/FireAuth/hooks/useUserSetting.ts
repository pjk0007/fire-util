import { useFireAuth } from "@/components/FireProvider/FireAuthProvider";
import { db } from "@/lib/firebase";
import createSetting from "../api/createSetting";
import turnOnChatAlarm from "../api/turnOnChatAlarm";
import { FireUser, IUserSetting, USER_SETTING_DOC_PATH } from "../settings";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useUserSetting() {
    const { user } = useFireAuth<FireUser>();
    const [userSetting, setUserSetting] = useState<IUserSetting>();

    useEffect(() => {
        if (!user) return undefined;
        const unsubscribe = onSnapshot(
            doc(db, USER_SETTING_DOC_PATH(user.id)),
            (querySnapshot) => {
                const setting = querySnapshot.data() as
                    | IUserSetting
                    | undefined;
                setUserSetting(setting);

                if (setting === undefined) {
                    createSetting(user.id);
                } else if (setting?.chatAlarm === undefined) {
                    turnOnChatAlarm(user.id);
                }
            }
        );
        return unsubscribe;
    }, [user]);

    return { userSetting };
}
