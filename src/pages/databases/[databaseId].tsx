import createDatabase from '@/components/FireDatabase/api/createDatabase';
import useDatabase from '@/components/FireDatabase/hooks/useDatabase';
import useDatabaseRows from '@/components/FireDatabase/hooks/useDatabaseRows';
import useDatabases from '@/components/FireDatabase/hooks/useDatabases';
import FireDatabase from '@/components/FireDatabase/ui/FireDatabase';
import FireDatabaseTable from '@/components/FireDatabase/ui/FireDatabaseTable';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@/components/ui/sidebar';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Databases() {
    const router = useRouter();
    const { databases, refetch } = useDatabases();
    const { databaseId } = router.query;

    return (
        <SidebarProvider className="overflow-hidden">
            <Sidebar>
                <SidebarHeader>Database Page</SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Database List
                            <SidebarGroupAction
                                onClick={() => {
                                    createDatabase('New Database').then(() => {
                                        refetch();
                                    });
                                }}
                                className="text-foreground/50"
                            >
                                <PlusCircle />
                            </SidebarGroupAction>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            {databases.map((db) => (
                                <SidebarMenu key={db.id}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <Link href={`/databases/${db.id}`}>
                                                {db.name}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="overflow-hidden max-h-[100dvh]">
                {databaseId && (
                    <FireDatabase
                        refetchDatabases={refetch}
                        databaseId={databaseId as string}
                    />
                )}
            </SidebarInset>
        </SidebarProvider>
    );
}
