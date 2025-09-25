import { db } from '@/lib/firebase';
import {
    FcUser,
    USER_COLLECTION,
    USER_ID_FIELD,
} from '@/lib/FireChat/settings';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function useUsers<U extends FcUser>(userIds?: string[]) {
    const [users, setUsers] = useState<U[]>([]);

    useEffect(() => {
        if (!userIds || userIds.length === 0) {
            setUsers([]);
            return;
        }
        getDocs(
            query(
                collection(db, USER_COLLECTION),
                where(USER_ID_FIELD, 'in', userIds)
            )
        ).then((querySnapshot) => {
            const us: U[] = [];
            querySnapshot.forEach((doc) => {
                const u = doc.data() as U;
                us.push(u);
            });

            setUsers(us);
        });
    }, [userIds]);

    return { users };
}
