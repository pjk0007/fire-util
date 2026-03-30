import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
    title: string;
    values: [string, number][];
    total: number;
}

export function StatsCard({ title, values, total }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {values.slice(0, 10).map(([value, count]) => (
                    <div key={value} className="flex justify-between text-sm">
                        <span className="truncate mr-2">{value}</span>
                        <span className="font-medium whitespace-nowrap">
                            {count} ({((count / total) * 100).toFixed(1)}%)
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
