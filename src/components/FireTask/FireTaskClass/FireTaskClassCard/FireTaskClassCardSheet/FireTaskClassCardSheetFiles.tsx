import FireImageViewDialog from '@/components/FireUI/FireImageViewDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useIsMobile } from '@/hooks/use-mobile';
import { FireUser } from '@/lib/FireAuth/settings';
import downloadFileFromUrl from '@/lib/FireChat/utils/downloadFileFromUrl';
import { formatSizeString } from '@/lib/FireChat/utils/sizeformat';
import truncateFilenameMiddle from '@/lib/FireChat/utils/truncateFilenameMiddle';
import updateTaskImagesAndFiles from '@/lib/FireTask/api/updateTaskImages';
import uploadFilesToTask from '@/lib/FireTask/api/uploadFilesToTask';
import {
    FireTask,
    TASK_CHANNEL_ID_FIELD,
    TASK_FILES_FIELD,
    TASK_ID_FIELD,
    TASK_IMAGES_FIELD,
    TASK_LOCALE,
    TASK_TITLE_FIELD,
} from '@/lib/FireTask/settings';
import { Link, Trash, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface FireTaskClassCardSheetFilesProps<
    FT extends FireTask<FU>,
    FU extends FireUser
> {
    task: FT;
}

export default function FireTaskClassCardSheetFiles<
    FT extends FireTask<FU>,
    FU extends FireUser
>({ task }: FireTaskClassCardSheetFilesProps<FT, FU>) {
    const isMobile = useIsMobile();
    const [uploadingImages, setUploadingImages] = useState<File[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center group">
                <div className="text-sm font-medium flex gap-1 py-2">
                    <span>{TASK_LOCALE.SHEET.FILES}</span>
                    <span className="text-muted-foreground">
                        {task[TASK_FILES_FIELD].length +
                            task[TASK_IMAGES_FIELD].length}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs hidden group-hover:flex"
                    asChild
                >
                    <Label htmlFor="task-file-upload">
                        {TASK_LOCALE.SHEET.ADD_FILE}
                    </Label>
                </Button>
                <Input
                    type="file"
                    className="hidden"
                    multiple
                    id="task-file-upload"
                    onChange={async (e) => {
                        const files = e.target.files
                            ? Array.from(e.target.files)
                            : [];
                        const imageFiles = files.filter((file) =>
                            file.type.startsWith('image/')
                        );
                        const otherFiles = files.filter(
                            (file) => !file.type.startsWith('image/')
                        );
                        setUploadingImages(imageFiles);
                        setUploadingFiles(otherFiles);

                        await uploadFilesToTask(
                            task[TASK_CHANNEL_ID_FIELD],
                            task[TASK_ID_FIELD],
                            files
                        );

                        setUploadingImages([]);
                        setUploadingFiles([]);

                        // uploadFiles(task[TASK_CHANNEL_ID_FIELD], task[TASK_ID_FIELD], Array.from(files));
                        e.target.value = '';
                    }}
                />
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
                {task[TASK_IMAGES_FIELD].map((image, index) => (
                    <FireImageViewDialog
                        defaultIdx={index}
                        images={task[TASK_IMAGES_FIELD]}
                        key={index}
                        dialogTitle={task[TASK_TITLE_FIELD]}
                    >
                        <div className="w-20 h-20 rounded-sm relative group border">
                            <Image
                                width={80}
                                height={80}
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="cursor-pointer object-cover w-full h-full rounded-sm"
                            />
                            <X
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskImagesAndFiles(
                                        task[TASK_CHANNEL_ID_FIELD],
                                        task[TASK_ID_FIELD],
                                        task[TASK_IMAGES_FIELD].filter(
                                            (img) => img !== image
                                        ),
                                        task[TASK_FILES_FIELD]
                                    );
                                }}
                                className="md:opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 bg-background rounded-full border text-muted-foreground p-[1px] hover:text-foreground"
                                size={16}
                            />
                        </div>
                    </FireImageViewDialog>
                ))}
                {uploadingImages.map((image, index) => (
                    <div
                        className="w-20 h-20 rounded-sm relative group"
                        key={index}
                    >
                        <img
                            src={URL.createObjectURL(image)}
                            alt={`Image ${index + 1}`}
                            className="cursor-pointer object-cover w-full h-full rounded-sm"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-sm">
                            <Spinner className="text-muted" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-1">
                {task[TASK_FILES_FIELD].map((file, index) => (
                    <div
                        key={index}
                        className="cursor-pointer p-2 group flex items-center justify-between text-xs bg-accent md:bg-transparent md:hover:bg-accent rounded-sm"
                        onClick={() => {
                            downloadFileFromUrl(file.url, file.name);
                        }}
                    >
                        <div className="flex gap-3 items-center">
                            <Link size={16} />
                            <div className="text-sm flex gap-2 items-center">
                                <div className="font-semibold text-card-foreground">
                                    {truncateFilenameMiddle(
                                        file.name,
                                        isMobile ? 28 : 40
                                    )}
                                </div>
                                <div className="text-muted-foreground md:block hidden">
                                    {file.size
                                        ? formatSizeString(file.size)
                                        : ''}
                                </div>
                            </div>
                        </div>
                        <Trash
                            onClick={(e) => {
                                e.stopPropagation();
                                updateTaskImagesAndFiles(
                                    task[TASK_CHANNEL_ID_FIELD],
                                    task[TASK_ID_FIELD],
                                    task[TASK_IMAGES_FIELD],
                                    task[TASK_FILES_FIELD].filter(
                                        (f) => f.url !== file.url
                                    )
                                );
                            }}
                            className="cursor-default md:opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-[1px] hover:bg-accent"
                            size={16}
                        />
                    </div>
                ))}
                {uploadingFiles.map((file, index) => (
                    <div
                        key={index}
                        className="cursor-pointer p-2 group flex items-center justify-between text-xs bg-accent rounded-sm"
                    >
                        <div className="flex gap-3 items-center">
                            <Spinner />
                            <div className="text-sm flex gap-2 items-center">
                                <div className="font-semibold text-card-foreground">
                                    {file.name}
                                </div>
                                <div className="text-muted-foreground">
                                    {file.size
                                        ? formatSizeString(file.size)
                                        : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
