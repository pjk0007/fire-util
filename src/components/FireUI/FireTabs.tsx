import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useEffect, useRef, useState } from 'react';

function FireTabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <Tabs className={cn('flex flex-col gap-2', className)} {...props} />;
}

function FireTabsList({
    children,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsList
            className="h-8 w-full border-b justify-start rounded-none bg-transparent p-0"
            {...props}
        >
            <div className="w-40 flex gap-2 h-8">{children}</div>
        </TabsList>
    );
}

function FireTabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isSelected, setIsSelected] = useState(false);
    

    useEffect(() => {
        const handleAttributeChange = (mutations: MutationRecord[]) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === 'attributes' &&
                    mutation.attributeName === 'aria-selected'
                ) {
                    const selected =
                        ref.current?.getAttribute('aria-selected') === 'true';
                    setIsSelected(!!selected);
                }
            });
        };

        const observer = new MutationObserver(handleAttributeChange);
        if (ref.current) {
            observer.observe(ref.current, {
                attributes: true,
            });
            // Initialize the state
            const selected =
                ref.current.getAttribute('aria-selected') === 'true';
            setIsSelected(!!selected);
        }

        return () => {
            observer.disconnect();
        };
    }, []);
    
    
    return (
        <TabsPrimitive.Trigger
            ref={ref}
            data-slot="tabs-trigger"
            className={cn(
                'text-foreground inline-flex items-center justify-center gap-1.5 px-2 py-1 text-sm font-medium whitespace-nowrap disabled:pointer-events-none disabled:opacity-50',
                className
            )}
            style={{
                borderBottom: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
            }}
            {...props}
        />
    );
}

function FireTabsContent(
    props: React.ComponentProps<typeof TabsPrimitive.Content>
) {
    return <TabsContent {...props} />;
}

export { FireTabs, FireTabsList, FireTabsTrigger, FireTabsContent };
