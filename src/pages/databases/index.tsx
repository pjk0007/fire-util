import createDatabase from '@/components/FireDatabase/api/createDatabase';
import useDatabases from '@/components/FireDatabase/hooks/useDatabases';
import FireDatabaseTable from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTable';
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

export default function Databases() {
    const { databases, refetch } = useDatabases();
    return (
        <SidebarProvider>
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
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        Tables
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
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
            <SidebarInset></SidebarInset>
        </SidebarProvider>
    );
}
