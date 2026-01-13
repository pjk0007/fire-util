import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FirstVisitTab from './FirstVisit';
import BehaviorTab from './Behavior';
import ConversionTab from './Conversion';

export default function FireTrackerDashboard() {
    return (
        <div className="w-full p-4 md:p-8 space-y-4 md:space-y-6">
            <Tabs defaultValue="first-visit">
                <TabsList>
                    <TabsTrigger value="first-visit">최초 유입</TabsTrigger>
                    <TabsTrigger value="behavior">행동 분석</TabsTrigger>
                    <TabsTrigger value="conversion">
                        전환
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="first-visit" className="mt-4 md:mt-6">
                    <FirstVisitTab />
                </TabsContent>

                <TabsContent value="behavior" className="mt-4 md:mt-6">
                    <BehaviorTab />
                </TabsContent>

                <TabsContent value="conversion" className="mt-4 md:mt-6">
                    <ConversionTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
