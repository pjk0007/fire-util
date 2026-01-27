import { SendingFile } from '@/components/FireChat/hooks/useFireChatSender';
import useFireChatSendingImages from '@/components/FireChat/hooks/useFireChatSendingImages';
import getImageColSpan from '@/components/FireChat/utils/getImageColSpan';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function FireChatSendingImages({
    sendingFile,
}: {
    sendingFile: SendingFile;
}) {
    const { progress, isCompleted, cancelUpload } =
        useFireChatSendingImages({
            id: sendingFile.id,
            files: sendingFile.files,
            channelId: sendingFile.channelId,
        });
    if (isCompleted) return null;

    return (
        <div className={cn('flex w-full gap-4 justify-end')}>
            <div className={cn('flex flex-col max-w-[78%] gap-2 items-end')}>
                <div className="relative grid grid-cols-6 gap-2 max-w-64 md:max-w-full">
                    {sendingFile.files.map((file, idx) => {
                        const colSpan = getImageColSpan(
                            sendingFile.files.length,
                            idx
                        );
                        return (
                            <Image
                                width={150}
                                height={150}
                                key={idx}
                                src={file ? URL.createObjectURL(file) : ''}
                                className={cn(
                                    'rounded-xs object-cover object-top',
                                    {
                                        'h-[320px] w-full min-w-[200px] cursor-pointer':
                                            colSpan === 'col-span-6',
                                        'w-[160px] h-[160px] cursor-pointer':
                                            colSpan === 'col-span-3',
                                        'w-[100px] h-[100px] cursor-pointer':
                                            colSpan === 'col-span-2',
                                    },
                                    colSpan
                                )}
                                alt={`${file.name}-${idx}`}
                            />
                        );
                    })}
                    <div className="absolute inset-0 rounded-xs bg-black/60 flex flex-col justify-center items-center">
                        {/* 원형 프로그레스 바 */}
                        <div className="relative flex flex-col gap-4 items-center justify-center">
                            <svg
                                className="w-16 h-16 transform -rotate-90"
                                viewBox="0 0 100 100"
                            >
                                <circle
                                    className="text-gray-300"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="44"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className="text-primary"
                                    strokeWidth="8"
                                    strokeDasharray={276.46} // 2 * π * r (r = 44)
                                    strokeDashoffset={
                                        276.46 - (progress / 100) * 276.46
                                    }
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="44"
                                    cx="50"
                                    cy="50"
                                />
                            </svg>
                            <div
                                className="absolute text-white text-sm bg-white/10 rounded-full p-3 hover:bg-white/20 cursor-pointer"
                                onClick={cancelUpload}
                            >
                                <X />
                            </div>
                            <div className="absolute mt-28 text-white text-sm">
                                {Math.round(progress)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
