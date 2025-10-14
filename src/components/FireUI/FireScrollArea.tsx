import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type FireScrollAreaProps = {
    children: ReactNode;
    dir?: 'col' | 'row';
    disabled?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function FireScrollArea({
    children,
    dir = 'col',
    style,
    className,
    disabled,
    ...props
}: FireScrollAreaProps) {
    return (
        <div
            style={{
                overflowX: disabled ? 'hidden' : dir === 'row' ? 'auto' : 'hidden',
                overflowY: disabled ? 'hidden' : dir === 'col' ? 'auto' : 'hidden',
                ...style,
            }}
            className={cn(
                '[&::-webkit-scrollbar]:w-1',
                '[&::-webkit-scrollbar]:h-2',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-thumb]:bg-gray-300',
                'dark:[&::-webkit-scrollbar-track]:bg-neutral-700',
                'dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
