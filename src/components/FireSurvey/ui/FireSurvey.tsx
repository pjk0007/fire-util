import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FireSurveyProvider, useFireSurvey } from '../contexts/FireSurveyProvider';
import { FireSurveyTemplateList } from './FireSurveyTemplateList/FireSurveyTemplateList';
import { FireSurveyResponseList } from './FireSurveyResponseList/FireSurveyResponseList';
import { FireSurveyNewTemplateDialog } from './FireSurveyDialog/FireSurveyNewTemplateDialog';
import { FIRE_SURVEY_LOCALE } from '../settings/constants';
import type { FireSurveyTab } from '../settings/types';

function FireSurveyInner() {
    const { activeTab, setActiveTab } = useFireSurvey();
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* 페이지 설명 + 새 설문 버튼 */}
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                    설문 항목을 관리하고 응답 결과를 확인하세요
                </p>
                <Button onClick={() => setIsNewDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {FIRE_SURVEY_LOCALE.TEMPLATE.NEW}
                </Button>
            </div>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as FireSurveyTab)}
            >
                <TabsList>
                    <TabsTrigger value="templates">
                        {FIRE_SURVEY_LOCALE.TABS.TEMPLATES}
                    </TabsTrigger>
                    <TabsTrigger value="responses">
                        {FIRE_SURVEY_LOCALE.TABS.RESPONSES}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="templates">
                    <FireSurveyTemplateList />
                </TabsContent>
                <TabsContent value="responses">
                    <FireSurveyResponseList />
                </TabsContent>
            </Tabs>

            <FireSurveyNewTemplateDialog
                open={isNewDialogOpen}
                onOpenChange={setIsNewDialogOpen}
            />
        </div>
    );
}

export default function FireSurvey() {
    return (
        <FireSurveyProvider>
            <FireSurveyInner />
        </FireSurveyProvider>
    );
}
