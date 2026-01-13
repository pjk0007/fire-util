import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/components/FireTracker/api';
import { FireTrackerSession } from '@/components/FireTracker/settings';

interface UseSessionsParams {
    startDate?: Date;
    endDate?: Date;
    hasUtm?: boolean;
    isFirstVisit?: boolean;
    visitorId?: string;
    enabled?: boolean;
}

export function useSessions({
    startDate,
    endDate,
    hasUtm,
    isFirstVisit,
    visitorId,
    enabled = true,
}: UseSessionsParams) {
    return useQuery<FireTrackerSession[]>({
        queryKey: [
            'firetracker',
            'sessions',
            startDate?.toISOString(),
            endDate?.toISOString(),
            hasUtm,
            isFirstVisit,
            visitorId,
        ],
        queryFn: () => getSessions({ startDate, endDate, hasUtm, isFirstVisit, visitorId }),
        enabled,
    });
}
