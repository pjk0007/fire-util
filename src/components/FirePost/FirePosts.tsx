import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import useFirePosts from '@/lib/FirePost/hooks/useFirePosts';
import { FireUser } from '@/lib/FireAuth/settings';
import {
    FIRE_POST_LOCALE,
    FirePost as FirePostType,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';
import { Bell, HelpCircle, PlusSquare } from 'lucide-react';
import FirePostList from './FirePostList';
import {
    FireTabs,
    FireTabsContent,
    FireTabsList,
    FireTabsTrigger,
} from '@/components/FireUI/FireTabs';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

interface FirePostProps<U> {
    postShowType: PostShowType[];
    onPostClick?: (post: FirePostType<U>) => void;
    itemsPerPage?: number;
    createPostLink?: string;
}

export default function FirePosts<U>({
    postShowType,
    onPostClick,
    itemsPerPage = 10,
    createPostLink,
}: FirePostProps<U>) {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<PostType>('notice');

    const { notices, faqs } = useFirePosts<U>(postShowType);

    return (
        <Card className="relative">
            {createPostLink && (
                <Button
                    variant={'outline'}
                    className="absolute top-2 right-4"
                    asChild
                >
                    <Link href={createPostLink}>
                        {isMobile ? (
                            <PlusSquare />
                        ) : (
                            FIRE_POST_LOCALE.CREATE_POST_BUTTON
                        )}
                    </Link>
                </Button>
            )}
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
