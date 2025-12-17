import { useQuery } from '@tanstack/react-query';
import {
    getSessions,
    getSessionsToday,
    getSessionsThisWeek,
    getSessionsThisMonth,
} from '@/components/FireTracker/api';

export function useSessions(startDate?: Date, endDate?: Date) {
    return useQuery({
        queryKey: ['tracker-sessions', startDate?.toISOString(), endDate?.toISOString()],
        queryFn: () => getSessions({ startDate, endDate }),
    });
}

export function useSessionsToday() {
    return useQuery({
        queryKey: ['tracker-sessions-today'],
        queryFn: getSessionsToday,
    });
}

export function useSessionsThisWeek() {
    return useQuery({
        queryKey: ['tracker-sessions-week'],
        queryFn: getSessionsThisWeek,
    });
}

export function useSessionsThisMonth() {
    return useQuery({
        queryKey: ['tracker-sessions-month'],
        queryFn: getSessionsThisMonth,
    });
}
