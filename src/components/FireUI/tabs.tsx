import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';

function FireTabs({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <Tabs className={cn('flex flex-col gap-2', className)} {...props} />;
}

function FireTabsList({
    className,
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
    children,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsTrigger {...props}>
            <div
                style={{
                    height: '32px',
                    margin: 0,
                    borderRadius: 0,
                    borderLeft: 'none',
                    borderTop: 'none',
                    borderRight: 'none',
                    boxShadow: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                }}
                className="data-[state=active]:border-black data-[state=inactive]:border-transparent border-b"
            >
                {children}
            </div>
        </TabsTrigger>
    );
}

function FireTabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return <TabsContent {...props} />;
}

export { FireTabs, FireTabsList, FireTabsTrigger, FireTabsContent };
