import Tiptap from '@/components/Tiptap/Tiptap';
import { FireUser } from '@/lib/FireAuth/settings';
import useCreatePost from '@/lib/FirePost/hooks/useCreatePost';
import FirePostContentViewDate from '@/components/FirePost/FirePostContent/FirePostContentViewDate';
import FirePostContentButtons from '@/components/FirePost/FirePostContent/FirePostContentButtons';
import FirePostContentTypes from '@/components/FirePost/FirePostContent/FirePostContentTypes';
import FirePostContentTitle from '@/components/FirePost/FirePostContent/FirePostContentTitle';
import { PostShowType, PostType } from '@/lib/FirePost/settings';

export default function FirePostCreate<U>({
    user,
    onClickGoBack,
    onCreated,
}: {
    user: U;
    onClickGoBack: () => void;
    onCreated?: (postId: string) => void;
}) {
    const {
        title,
        setTitle,
        content,
        setContent,
        type,
        setType,
        showType,
        setShowType,
        isPinned,
        setIsPinned,
        isSecret,
        setIsSecret,
        isSubmitting,
        onSubmit,
    } = useCreatePost<U>(user, onCreated);

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="border-b p-6">
                <FirePostContentButtons
                    editable={true}
                    isChanged={true}
                    onSave={onSubmit}
                    onClickGoBack={onClickGoBack}
                />
                <FirePostContentTitle
                    isPinned={isPinned}
                    setIsPinned={setIsPinned}
                    isSecret={isSecret}
                    setIsSecret={setIsSecret}
                    title={title}
                    setTitle={setTitle}
                    editable={true}
                    isNew={true}
                />
                <div className="flex md:items-center md:flex-row flex-col gap-2 md:gap-0 justify-between">
                    <FirePostContentTypes
                        editable={true}
                        type={type}
                        showType={showType}
                        setType={
                            setType as React.Dispatch<
                                React.SetStateAction<PostType | undefined>
                            >
                        }
                        setShowType={
                            setShowType as React.Dispatch<
                                React.SetStateAction<PostShowType | undefined>
                            >
                        }
                    />

                    <FirePostContentViewDate viewCount={0} />
                </div>
            </div>

            <Tiptap
                defaultContent={content}
                id="new-post"
                editable={true}
                onUpdate={(content) => setContent(content)}
            />
        </div>
    );
}
