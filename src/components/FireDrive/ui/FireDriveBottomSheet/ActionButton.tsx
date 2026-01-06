interface ActionButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
    destructive?: boolean;
}

export default function ActionButton({ icon: Icon, label, onClick, destructive }: ActionButtonProps) {
    return (
        <button
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors active:bg-accent ${
                destructive ? 'text-destructive' : ''
            }`}
            onClick={onClick}
        >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
