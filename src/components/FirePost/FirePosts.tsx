'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import useFirePosts from '@/lib/FirePost/hooks/useFirePosts';
import { FireUser } from '@/lib/FireAuth/settings';
import {
    FIRE_POST_LOCALE,
    FirePost as FirePostType,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';
import {
    Bell,
    HelpCircle,
    SquareArrowOutUpRight,
    SquareArrowUpRight,
} from 'lucide-react';
import FirePostList from './FirePostList';
import {
    FireTabs,
    FireTabsContent,
    FireTabsList,
    FireTabsTrigger,
} from '@/components/FireUI/FireTabs';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface FirePostProps<U extends FireUser> {
    postShowType: PostShowType[];
    onPostClick?: (post: FirePostType<U>) => void;
    itemsPerPage?: number;
}

export default function FirePosts<U extends FireUser>({
    postShowType,
    onPostClick,
    itemsPerPage = 10,
}: FirePostProps<U>) {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<PostType>('notice');

    const { notices, faqs } = useFirePosts<U>(postShowType);

    return (
        <Card className="relative">
            <Button variant={'outline'} className="absolute top-2 right-4">
                {isMobile ? (
                    <SquareArrowOutUpRight />
                ) : (
                    FIRE_POST_LOCALE.MORE_POST
                )}
            </Button>
            <CardContent className="px-4">
                <FireTabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as PostType)}
                >
                    <FireTabsList>
                        <FireTabsTrigger value="notice">
                            <Bell className="w-4 h-4" />
                            {FIRE_POST_LOCALE.TAB_NOTICE}
                        </FireTabsTrigger>
                        <FireTabsTrigger value="faq">
                            <HelpCircle className="w-4 h-4" />
                            {FIRE_POST_LOCALE.TAB_FAQ}
                        </FireTabsTrigger>
                    </FireTabsList>

                    <FireTabsContent value="notice" className="mt-4">
                        <FirePostList
                            posts={notices}
                            type="notice"
                            onPostClick={onPostClick}
                            itemsPerPage={itemsPerPage}
                        />
                    </FireTabsContent>

                    <FireTabsContent value="faq" className="mt-4">
                        <FirePostList
                            posts={faqs}
                            type="faq"
                            onPostClick={onPostClick}
                            itemsPerPage={itemsPerPage}
                        />
                    </FireTabsContent>
                </FireTabs>
            </CardContent>
        </Card>
    );
}
