import Tiptap from '@/components/Tiptap/Tiptap';
import { Skeleton } from '@/components/ui/skeleton';
import useFirePostContent from '@/lib/FirePost/hooks/useFirePostContent';
import {
    POST_COLLECTION,
    POST_CREATED_AT_FIELD,
    POST_ID_FIELD,
    POST_VIEWS_FIELD,
} from '@/lib/FirePost/settings';
import FirePostContentViewDate from '@/components/FirePost/FirePostContent/FirePostContentViewDate';
import FirePostContentButtons from '@/components/FirePost/FirePostContent/FirePostContentButtons';
import FirePostContentTypes from '@/components/FirePost/FirePostContent/FirePostContentTypes';
import FirePostContentTitle from '@/components/FirePost/FirePostContent/FirePostContentTitle';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { formatSizeString } from '@/lib/FireUtil/sizeformat';

export default function FirePostContent<U>({
    postId,
    onClickGoBack,
    editable = false,
}: {
    postId: string;
    onClickGoBack: () => void;
    editable?: boolean;
}) {
    const {
        post,
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
        isNew,
        isChanged,
        onSave,
        onDelete,
    } = useFirePostContent<U>(postId, onClickGoBack);

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
            `${POST_COLLECTION}/${postId}/files/${file.name}`
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
                    editable={editable}
                    isChanged={isChanged}
                    onSave={onSave}
                    onClickGoBack={onClickGoBack}
                    onDelete={onDelete}
                />
                <FirePostContentTitle
                    isPinned={isPinned}
                    setIsPinned={setIsPinned}
                    isSecret={isSecret}
                    setIsSecret={setIsSecret}
                    title={title}
                    setTitle={setTitle}
                    editable={editable}
                    isNew={isNew}
                />
                <div className="flex md:items-center md:flex-row flex-col gap-2 md:gap-0 justify-between">
                    <FirePostContentTypes
                        editable={editable}
                        type={type}
                        showType={showType}
                        setType={setType}
                        setShowType={setShowType}
                    />

                    <FirePostContentViewDate
                        viewCount={post?.[POST_VIEWS_FIELD]}
                        createdAt={post?.[POST_CREATED_AT_FIELD]}
                    />
                </div>
            </div>

            {post && content !== undefined ? (
                <Tiptap
                    defaultContent={content}
                    id={post[POST_ID_FIELD]}
                    editable={editable}
                    onUpdate={(content) => setContent(content)}
                    uploadFile={uploadFile}
                    imageMaxSize={20 * 1024 * 1024} // 20MB
                />
            ) : (
                <div className="p-6">
                    <Skeleton className="h-10 w-80 mb-2" />
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-2" />
                </div>
            )}
        </div>
    );
}
