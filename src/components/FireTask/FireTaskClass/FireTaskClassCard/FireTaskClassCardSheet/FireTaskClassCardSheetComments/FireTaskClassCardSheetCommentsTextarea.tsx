import { useFireAuth } from '@/components/FireProvider/FireAuthProvider';
import FireImageViewDialog from '@/components/FireUI/FireImageViewDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { FireUser } from '@/lib/FireAuth/settings';
import { formatSizeString } from '@/lib/FireChat/utils/sizeformat';
import truncateFilenameMiddle from '@/lib/FireChat/utils/truncateFilenameMiddle';
import addTaskComment from '@/lib/FireTask/api/addTaskComment';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_ID_FIELD,
    TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { cn } from '@/lib/utils';
import { ArrowUp, Link, Paperclip, Trash, X } from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

interface FireTaskClassCardSheetCommentsTextareaProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSheetCommentsTextarea<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSheetCommentsTextareaProps<FT, FU>) {
    const { user } = useFireAuth(); // Assuming you have a useAuth hook to get the current user
    const [content, setContent] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [otherFiles, setOtherFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // create object URLs once per file array change to avoid recreating during unrelated re-renders
    const imageUrls = useMemo(() => {
        return imageFiles.map((f) => URL.createObjectURL(f));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageFiles]);

    useEffect(() => {
        return () => {
            imageUrls.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [imageUrls]);

    useEffect(() => {
        // message가 변경될 때마다 텍스트 영역의 높이를 조정
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // 높이를 초기화
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 스크롤 높이에 맞게 조정
        }
    }, [content]);

    useEffect(() => {
        // 초기 렌더링 시 텍스트 영역의 높이를 조정
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // 높이를 초기화
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 스크롤 높이에 맞게 조정
        }
    }, []);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    return (
        <>
            {isLoading && (
                <div className="w-full flex flex-col mb-4">
                    <div className="flex gap-3 items-center">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-20 h-5 rounded-xs" />
                        <Skeleton className="w-8 h-4 rounded-xs" />
                    </div>
                    <div className="pl-5 border-l ml-3 mt-1">
                        <Skeleton className="h-9 mt-2.5 rounded-lg" />
                        <Skeleton className="h-9 mt-1 rounded-lg" />
                    </div>
                </div>
            )}
            <div className="border rounded-lg py-2 px-3 flex flex-col gap-1 ">
                <div className="flex w-full gap-4 items-center">
                    <Label
                        htmlFor="task-comment-file-upload"
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        <Paperclip size={16} />
                    </Label>
                    <Input
                        type="file"
                        className="hidden"
                        multiple
                        id="task-comment-file-upload"
                        onChange={(e) => {
                            const files = e.target.files
                                ? Array.from(e.target.files)
                                : [];
                            setImageFiles((prev) => [
                                ...prev,
                                ...files.filter((file) =>
                                    file.type.startsWith('image/')
                                ),
                            ]);
                            setOtherFiles((prev) => [
                                ...prev,
                                ...files.filter(
                                    (file) => !file.type.startsWith('image/')
                                ),
                            ]);
                        }}
                    />
                    <div className="flex flex-col flex-1">
                        <textarea
                            ref={textareaRef}
                            className={cn(
                                'text-sm min-h-9 py-2 focus:outline-none border-none w-full flex items-center placeholder:text-muted-foreground resize-none'
                            )}
                            rows={1}
                            placeholder={
                                TASK_LOCALE.SHEET.ADD_COMMENT_PLACEHOLDER
                            }
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={'outline'}
                        className="rounded-full w-9 h-9"
                        onClick={() => {
                            setIsLoading(true);
                            addTaskComment(
                                task[TASK_CHANNEL_ID_FIELD],
                                task[TASK_ID_FIELD],
                                user,
                                content,
                                imageFiles,
                                otherFiles
                            ).then(() => {
                                setIsLoading(false);
                            });
                            setIsLoading(true);
                            setContent('');
                            setImageFiles([]);
                            setOtherFiles([]);
                        }}
                    >
                        <ArrowUp />
                    </Button>
                </div>
                {(imageFiles.length > 0 || otherFiles.length > 0) && (
                    <Separator />
                )}
                {imageFiles.length > 0 && (
                    <ImagePreviewList
                        images={imageFiles}
                        urls={imageUrls}
                        title={task[TASK_TITLE_FIELD]}
                        onRemove={(i) =>
                            setImageFiles((prev) =>
                                prev.filter((_, idx) => idx !== i)
                            )
                        }
                    />
                )}

                {otherFiles.length > 0 && (
                    <OtherFilesList
                        files={otherFiles}
                        onRemove={(i) =>
                            setOtherFiles((prev) =>
                                prev.filter((_, idx) => idx !== i)
                            )
                        }
                    />
                )}
            </div>
        </>
    );
}

// Memoized subcomponents moved to module scope to avoid JSX/TSX parse errors
const ImagePreviewList = memo(function ImagePreviewList({
    images,
    urls,
    title,
    onRemove,
}: {
    images: File[];
    urls: string[];
    title: string;
    onRemove: (i: number) => void;
}) {
    return (
        <div className="flex gap-2 mt-2.5 flex-wrap">
            {images.map((image, index) => (
                <FireImageViewDialog
                    defaultIdx={index}
                    images={urls}
                    key={index}
                    dialogTitle={title}
                >
                    <div className="w-20 h-20 rounded-sm relative group border">
                        <img
                            src={urls[index]}
                            alt={`Image ${index + 1}`}
                            className="cursor-pointer object-cover w-full h-full rounded-sm"
                        />
                        <X
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(index);
                            }}
                            className="md:opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 bg-background rounded-full border text-muted-foreground p-[1px] hover:text-foreground"
                            size={16}
                        />
                    </div>
                </FireImageViewDialog>
            ))}
        </div>
    );
});

const OtherFilesList = memo(function OtherFilesList({
    files,
    onRemove,
}: {
    files: File[];
    onRemove: (i: number) => void;
}) {
    const isMobile = useIsMobile();
    return (
        <div className="w-full flex flex-col gap-1 mt-2.5">
            {files.map((file, index) => (
                <div
                    key={index}
                    className="cursor-pointer p-2 group flex items-center justify-between text-xs bg-accent md:bg-transparent md:hover:bg-accent rounded-sm border"
                >
                    <div className="flex gap-3 items-center">
                        <Link size={16} />
                        <div className="text-sm flex gap-2 items-center">
                            <div className="font-semibold text-card-foreground">
                                {truncateFilenameMiddle(
                                    file.name,
                                    isMobile ? 24 : 36
                                )}
                            </div>
                            <div className="text-muted-foreground whitespace-nowrap hidden md:block">
                                {file.size ? formatSizeString(file.size) : ''}
                            </div>
                        </div>
                    </div>
                    <Trash
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(index);
                        }}
                        className="cursor-default md:opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-[1px] hover:bg-accent"
                        size={16}
                    />
                </div>
            ))}
        </div>
    );
});
