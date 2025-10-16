export default function FireDesignToolProperties({ width }: { width: number }) {
    return (
        <div
            className={`flex flex-col h-full bg-background border-l`}
            style={{
                width,
            }}
        ></div>
    );
}
