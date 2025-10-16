export default function FireDesignToolComponents({ width }: { width: number }) {
    return (
        <div
            className={`flex flex-col h-full bg-background border-r`}
            style={{
                width,
            }}
        >
            Fire Design Tool
        </div>
    );
}
