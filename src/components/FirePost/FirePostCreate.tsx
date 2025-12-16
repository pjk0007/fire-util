import Tiptap from '@/components/Tiptap/Tiptap';
import useCreatePost from '@/lib/FirePost/hooks/useCreatePost';
import FirePostContentViewDate from '@/components/FirePost/FirePostContent/FirePostContentViewDate';
import FirePostContentButtons from '@/components/FirePost/FirePostContent/FirePostContentButtons';
import FirePostContentTypes from '@/components/FirePost/FirePostContent/FirePostContentTypes';
import FirePostContentTitle from '@/components/FirePost/FirePostContent/FirePostContentTitle';
import {
    POST_COLLECTION,
    PostShowType,
    PostType,
} from '@/lib/FirePost/settings';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { formatSizeString } from '@/lib/FireUtil/sizeformat';

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
        id,
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
        onSubmit,
    } = useCreatePost<U>(user, onCreated);

    async function uploadFile(
        file: File,
        onProgress?: (event: { progress: number }) => void
    ): Promise<{
        fileName: string;
        fileSize: string;
        src: string;
    }> {
        const storageRef = ref(
            storage,
            `${POST_COLLECTION}/${id}/files/${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    if (onProgress) {
                        onProgress({
                            progress: progress,
                        });
                    }
                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(storageRef);

                    resolve({
                        fileName: file.name,
                        fileSize: formatSizeString(file.size),
                        src: downloadURL,
                    });
                }
            );
        });
    }

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
                uploadFile={uploadFile}
                imageMaxSize={20 * 1024 * 1024} // 20MB
            />
        </div>
    );
}
