import { useRef } from 'react';
import { NOTIFICATION_ALARM_SOUND, NOTIFICATION_ICON } from '../settings';
import useUserSetting from '@/lib/FireAuth/hooks/useUserSetting';

export default function usePushNotification() {
    const notificationRef = useRef<Notification | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { userSetting } = useUserSetting();

    const isNotificationSupported =
        typeof window !== 'undefined' && 'Notification' in window;

    const requestPermission = () => {
        if (!isNotificationSupported || Notification.permission === 'granted')
            return;

        try {
            Notification.requestPermission().then((permission) => {
                if (permission !== 'granted') {
                    console.log('Notification permission denied');
                }
            });
        } catch (error) {
            if (error instanceof TypeError) {
                Notification.requestPermission((permission) => {
                    if (permission !== 'granted') {
                        console.log('Notification permission denied');
                    }
                });
            } else {
                console.error(error);
            }
        }
    };

    const fireNotificationWithTimeout = (
        title: string,
        timeout: number,
        options: NotificationOptions = {}
    ) => {
        if (!isNotificationSupported || Notification.permission !== 'granted')
            return;

        const newOptions: NotificationOptions = {
            icon: NOTIFICATION_ICON,
            ...options,
        };

        if (!notificationRef.current) {
            if (!timerRef.current) {
                timerRef.current = setTimeout(() => {
                    notificationRef.current?.close();
                    notificationRef.current = null;
                    timerRef.current = null;
                }, timeout);
            }

            notificationRef.current = new Notification(title, newOptions);

            if (userSetting?.chatAlarm) {
                new Audio(NOTIFICATION_ALARM_SOUND).play();
            }

            notificationRef.current.onclick = (event) => {
                event.preventDefault();
                window.focus();
                notificationRef.current?.close();
            };
        }
    };

    return {
        requestPermission,
        fireNotificationWithTimeout,
    };
}
