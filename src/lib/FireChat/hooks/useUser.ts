import getUser from '@/lib/FireChat/api/getUser';
import { FcUser } from '@/lib/FireChat/settings';
import { useEffect, useState } from 'react';

export default function useUser<U extends FcUser>(userId?: string) {
    const [user, setUser] = useState<U | undefined>(undefined);

    useEffect(() => {
        if (!userId) {
            setUser(undefined);
            return;
        }

        getUser<U>({
            id: userId,
        }).then((u) => {
            setUser(u);
        });
    }, [userId]);
    return { user };
}
