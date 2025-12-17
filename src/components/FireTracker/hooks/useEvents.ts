import { useQuery } from '@tanstack/react-query';
import {
    getEvents,
    getEventsToday,
    getEventsThisWeek,
    getEventsThisMonth,
} from '@/components/FireTracker/api';
import { EventType } from '@/components/FireTracker/settings';

export function useEvents(startDate?: Date, endDate?: Date, type?: EventType) {
    return useQuery({
        queryKey: ['tracker-events', startDate?.toISOString(), endDate?.toISOString(), type],
        queryFn: () => getEvents({ startDate, endDate, type }),
    });
}

export function useEventsToday() {
    return useQuery({
        queryKey: ['tracker-events-today'],
        queryFn: getEventsToday,
    });
}

export function useEventsThisWeek() {
    return useQuery({
        queryKey: ['tracker-events-week'],
        queryFn: getEventsThisWeek,
    });
}

export function useEventsThisMonth() {
    return useQuery({
        queryKey: ['tracker-events-month'],
        queryFn: getEventsThisMonth,
    });
}
