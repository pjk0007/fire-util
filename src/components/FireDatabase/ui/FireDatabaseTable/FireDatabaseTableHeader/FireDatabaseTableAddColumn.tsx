import { TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import AddColumnPopover from '@/components/FireDatabase/ui/FireDatabaseTable/FireDatabaseTableHeader/AddColumnDialog';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { useFireDatabase } from '@/components/FireDatabase/contexts/FireDatabaseContext';

export default function FireDatabaseTableAddColumn({
    databaseId,
}: {
    databaseId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <TableCell className="p-0 border-b">
            <AddColumnPopover
                databaseId={databaseId}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                                // TODO: 속성 추가 로직
                                setIsOpen(true);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>속성 추가</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </TableCell>
    );
}
