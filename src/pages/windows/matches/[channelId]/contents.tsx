import FireChatContents from "@/components/FireChat/FireChatContents";
import { useRouter } from "next/router";
import { CHANNEL_ID } from "@/lib/FireChannel/settings";

export default function ChannelPage() {
    const router = useRouter();
    const { tab } = router.query;

    const channelId = router.query[CHANNEL_ID] as string | undefined;

    if (!channelId) return null;

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            <FireChatContents
                channelId={channelId}
                defaultTab={typeof tab === "string" ? (tab as "image" | "file") : undefined}
            />
        </div>
    );
}
