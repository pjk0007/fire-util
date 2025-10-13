import { TASK_STATUS_OPTIONS, TaskStatus } from '@/lib/FireTask/settings';

export default function FireTaskStatusDot({ status }: { status: TaskStatus }) {
    return (
        <div className="w-4 h-4 flex items-center justify-center">
            <div
                className="w-2 h-2 rounded-full"
                style={{
                    backgroundColor: TASK_STATUS_OPTIONS.find(
                        (option) => option.value === status
                    )?.color,
                }}
            />
        </div>
    );
}
