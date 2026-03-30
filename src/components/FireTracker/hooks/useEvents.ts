import { useQuery } from '@tanstack/react-query';
import { getEvents } from '@/components/FireTracker/api';
import { FireTrackerEvent } from '@/components/FireTracker/settings';

interface UseEventsParams {
    startDate?: Date;
    endDate?: Date;
    visitorIds?: string[];
    enabled?: boolean;
}

export function useEvents({
    startDate,
    endDate,
    visitorIds,
    enabled = true,
}: UseEventsParams) {
    return useQuery<FireTrackerEvent[]>({
        queryKey: [
            'firetracker',
            'events',
            startDate?.toISOString(),
            endDate?.toISOString(),
            visitorIds?.join(','),
        ],
        queryFn: async () => {
            const events = await getEvents({
                startDate,
                endDate,
            });

            // visitorIds가 지정되면 필터링
            if (visitorIds && visitorIds.length > 0) {
                const visitorSet = new Set(visitorIds);
                return events.filter((e) => visitorSet.has(e.visitorId));
            }

            return events;
        },
        enabled,
    });
}
