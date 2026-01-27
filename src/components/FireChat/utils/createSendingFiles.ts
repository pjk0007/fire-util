import { SendingFile } from '@/components/FireChat/hooks/useFireChatSender';
import {
    LARGE_FILE_SIZE,
    MESSAGE_COLLECTION,
    MESSAGE_TYPE_FILE,
    MESSAGE_TYPE_IMAGE,
} from '@/components/FireChat/settings';
import isImageFile from '@/lib/FireUtil/isImageFile';
import { Timestamp } from 'firebase/firestore';

export default function createSendingFiles(channelId: string, files: File[]) {
    // 사이즈가 큰 파일이 포함되어 있는지 확인
    const smallImages = files.filter(
        (file) => file.size < LARGE_FILE_SIZE && isImageFile(file)
    );
    const largeImages = files.filter(
        (file) => file.size >= LARGE_FILE_SIZE && isImageFile(file)
    );
    const noImages = files.filter((file) => !isImageFile(file));

    const sendingFiles: SendingFile[] = [];
    if (smallImages.length > 0) {
        const now = Timestamp.now();
        const id = `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}_si`;
        sendingFiles.push({
            channelId,
            id,
            files: smallImages,
            type: MESSAGE_TYPE_IMAGE,
        });
    }
    if (largeImages.length > 0) {
        largeImages.forEach((file, i) => {
            const now = Timestamp.now();
            const id = `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}_li${i}`;
            sendingFiles.push({
                channelId,
                id,
                files: [file],
                type: MESSAGE_TYPE_IMAGE,
            });
        });
    }
    if (noImages.length > 0) {
        noImages.forEach((file, i) => {
            const now = Timestamp.now();
            const id = `${MESSAGE_COLLECTION}-${now.seconds}${now.nanoseconds}_ni${i}`;
            sendingFiles.push({
                channelId,
                id,
                files: [file],
                type: MESSAGE_TYPE_FILE,
            });
        });
    }
    return sendingFiles;
}
