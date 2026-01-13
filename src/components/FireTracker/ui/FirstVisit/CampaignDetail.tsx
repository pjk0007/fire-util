import { useMemo } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { StatsCard } from './StatsCard';
import { aggregateDeviceStats } from './utils';
import type { CampaignGroup, ParamStats, DeviceType } from './types';

const deviceIcons: Record<DeviceType, React.ReactNode> = {
    pc: <Monitor className="h-4 w-4" />,
    mobile: <Smartphone className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
};

const deviceLabels: Record<DeviceType, string> = {
    pc: 'PC',
    mobile: '모바일',
    tablet: '태블릿',
};

interface CampaignDetailProps {
    campaign: CampaignGroup | null;
    stats: { utmDetails: ParamStats[]; customParams: ParamStats[] } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CampaignDetail({ campaign, stats, open, onOpenChange }: CampaignDetailProps) {
    const deviceStats = useMemo(
        () => (campaign ? aggregateDeviceStats(campaign.sessions) : []),
        [campaign]
    );

    if (!campaign || !stats) return null;

    const hasNoData = stats.utmDetails.length === 0 && stats.customParams.length === 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>{campaign.source}</span>
                        <span className="text-muted-foreground font-normal">/</span>
                        <span>{campaign.medium}</span>
                        <span className="text-muted-foreground font-normal ml-2">
                            ({campaign.count}명)
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* 디바이스 통계 */}
                    {deviceStats.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">
                                디바이스
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {deviceStats.map((stat) => (
                                    <div
                                        key={stat.deviceType}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50"
                                    >
                                        {deviceIcons[stat.deviceType]}
                                        <span className="text-sm font-medium">
                                            {deviceLabels[stat.deviceType]}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {stat.count}명 ({stat.percentage}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {stats.utmDetails.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {stats.utmDetails.map(({ key, values }) => (
                                <StatsCard key={key} title={key} values={values} total={campaign.count} />
                            ))}
                        </div>
                    )}

                    {stats.customParams.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {stats.customParams.map(({ key, values }) => (
                                <StatsCard key={key} title={key} values={values} total={campaign.count} />
                            ))}
                        </div>
                    )}

                    {hasNoData && deviceStats.length === 0 && (
                        <div className="py-8 text-center text-muted-foreground">
                            추가 파라미터 데이터가 없습니다
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
