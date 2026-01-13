import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CampaignGroup } from './types';

interface CampaignListProps {
    campaigns: CampaignGroup[];
    total: number;
    searchTerms: [string, number][]; // [검색어, 횟수][]
    onSelect: (key: string) => void;
}

export function CampaignList({
    campaigns,
    total,
    searchTerms,
    onSelect,
}: CampaignListProps) {
    // Source별 집계
    const sourceStats = useMemo(() => {
        const stats: Record<string, number> = {};
        campaigns.forEach((c) => {
            stats[c.source] = (stats[c.source] || 0) + c.count;
        });
        return Object.entries(stats).sort(([, a], [, b]) => b - a) as [
            string,
            number
        ][];
    }, [campaigns]);

    // Medium별 집계
    const mediumStats = useMemo(() => {
        const stats: Record<string, number> = {};
        campaigns.forEach((c) => {
            stats[c.medium] = (stats[c.medium] || 0) + c.count;
        });
        return Object.entries(stats).sort(([, a], [, b]) => b - a) as [
            string,
            number
        ][];
    }, [campaigns]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {/* Source / Medium 조합별 유입 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                        Source / Medium 별 유입
                        <span className="text-muted-foreground font-normal ml-2">
                            (총 {total}명)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {campaigns.length === 0 ? (
                        <div className="py-4 text-center text-muted-foreground">
                            데이터가 없습니다
                        </div>
                    ) : (
                        campaigns.map((campaign, index) => {
                            const key = `${campaign.source}|${campaign.medium}`;
                            return (
                                <div
                                    key={key}
                                    className="flex justify-between text-sm cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-1 rounded"
                                    onClick={() => onSelect(key)}
                                >
                                    <span className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-[2px] flex-shrink-0"
                                            style={{
                                                backgroundColor: `hsl(var(--chart-${
                                                    (index % 5) + 1
                                                }))`,
                                            }}
                                        />
                                        <span className="font-medium">
                                            {campaign.source}
                                        </span>
                                        <span className="text-muted-foreground">
                                            /
                                        </span>
                                        <span>{campaign.medium}</span>
                                    </span>
                                    <span className="font-medium whitespace-nowrap">
                                        {campaign.count} (
                                        {(
                                            (campaign.count / total) *
                                            100
                                        ).toFixed(1)}
                                        %)
                                    </span>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                        검색어 (utm_term)
                        <span className="text-muted-foreground font-normal ml-2">
                            ({searchTerms.length}개)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {searchTerms.length === 0 ? (
                        <div className="py-4 text-center text-muted-foreground">
                            검색어 데이터가 없습니다
                        </div>
                    ) : (
                        searchTerms.slice(0, 20).map(([term, count], index) => (
                            <div
                                key={term}
                                className="flex justify-between text-sm -mx-2 px-2 py-1"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-[2px] flex-shrink-0"
                                        style={{
                                            backgroundColor: `hsl(var(--chart-${
                                                (index % 5) + 1
                                            }))`,
                                        }}
                                    />
                                    <span className="truncate">{term}</span>
                                </span>
                                <span className="font-medium whitespace-nowrap">
                                    {count} (
                                    {((count / total) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Source별 유입 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                        Source별 유입
                        <span className="text-muted-foreground font-normal ml-2">
                            ({sourceStats.length}개)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {sourceStats.length === 0 ? (
                        <div className="py-4 text-center text-muted-foreground">
                            데이터가 없습니다
                        </div>
                    ) : (
                        sourceStats.map(([source, count], index) => (
                            <div
                                key={source}
                                className="flex justify-between text-sm -mx-2 px-2 py-1"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-[2px] flex-shrink-0"
                                        style={{
                                            backgroundColor: `hsl(var(--chart-${
                                                (index % 5) + 1
                                            }))`,
                                        }}
                                    />
                                    <span className="truncate font-medium">
                                        {source}
                                    </span>
                                </span>
                                <span className="font-medium whitespace-nowrap">
                                    {count} (
                                    {((count / total) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Medium별 유입 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                        Medium별 유입
                        <span className="text-muted-foreground font-normal ml-2">
                            ({mediumStats.length}개)
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {mediumStats.length === 0 ? (
                        <div className="py-4 text-center text-muted-foreground">
                            데이터가 없습니다
                        </div>
                    ) : (
                        mediumStats.map(([medium, count], index) => (
                            <div
                                key={medium}
                                className="flex justify-between text-sm -mx-2 px-2 py-1"
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-[2px] flex-shrink-0"
                                        style={{
                                            backgroundColor: `hsl(var(--chart-${
                                                (index % 5) + 1
                                            }))`,
                                        }}
                                    />
                                    <span className="truncate font-medium">
                                        {medium}
                                    </span>
                                </span>
                                <span className="font-medium whitespace-nowrap">
                                    {count} (
                                    {((count / total) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

        </div>
    );
}
