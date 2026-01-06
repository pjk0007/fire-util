import { useFireDrive } from '../../contexts';
import { FIRE_DRIVE_LOCALE } from '../../settings';
import { Button } from '@/components/ui/button';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function FireDriveUploadProgress() {
    const { uploadTasks, cancelUpload, clearCompletedUploads, dismissError } = useFireDrive();

    if (uploadTasks.length === 0) {
        return null;
    }

    const hasCompleted = uploadTasks.some((task) => task.status === 'completed');

    return (
        <div className="border-t bg-background p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                    {FIRE_DRIVE_LOCALE.UPLOAD.UPLOADING}
                </span>
                {hasCompleted && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCompletedUploads}
                    >
                        {FIRE_DRIVE_LOCALE.UPLOAD.CLEAR_COMPLETED}
                    </Button>
                )}
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
                {uploadTasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center gap-3 p-2 bg-muted rounded-md"
                    >
                        {task.status === 'uploading' && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                        )}
                        {task.status === 'completed' && (
                            <Check className="h-4 w-4 text-green-500 shrink-0" />
                        )}
                        {task.status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{task.fileName}</p>
                            {task.status === 'uploading' && (
                                <div className="h-1 mt-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-200"
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                            )}
                            {task.status === 'error' && task.error && (
                                <p className="text-xs text-destructive mt-1">
                                    {task.error}
                                </p>
                            )}
                        </div>

                        {/* 에러 항목 닫기 버튼 */}
                        {task.status === 'error' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => dismissError(task.id)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}

                        {task.status === 'uploading' && (
                            <>
                                <span className="text-xs text-muted-foreground shrink-0">
                                    {Math.round(task.progress)}%
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 shrink-0"
                                    onClick={() => cancelUpload(task.id)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
