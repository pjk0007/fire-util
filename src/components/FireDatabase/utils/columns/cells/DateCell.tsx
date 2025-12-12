import { memo, useMemo, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ColumnCellDate from '@/components/FireDatabase/utils/columns/ColumnCellDate';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import { FireDatabaseRow, FireDatabaseDataDate } from '@/components/FireDatabase/settings/types/row';
import moment from 'moment-timezone';

interface DateCellProps {
    databaseId: string;
    column: FireDatabaseColumn;
    data: FireDatabaseRow;
}

function DateCell({ databaseId, column, data }: DateCellProps) {
    const [open, setOpen] = useState(false);
    const dateData = data.data?.[column.id] as FireDatabaseDataDate;

    const dateDisplay = useMemo(() => {
        if (!dateData?.start) return '';

        const startDate = `${moment(dateData.start.toDate())
            .tz('Asia/Seoul')
            .format('YYYY년 MM월 DD일')} ${
            dateData.includeTime
                ? Intl.DateTimeFormat('default', {
                      hour: '2-digit',
                      minute: '2-digit',
                  }).format(dateData.start.toDate())
                : ''
        }`;

        const endDate = dateData.includeEnd && dateData.end
            ? ` → ${moment(dateData.end.toDate())
                  .tz('Asia/Seoul')
                  .format('YYYY년 MM월 DD일')} ${
                  dateData.includeTime
                      ? Intl.DateTimeFormat('default', {
                            hour: '2-digit',
                            minute: '2-digit',
                        }).format(dateData.end.toDate())
                      : ''
              }`
            : '';

        return startDate + endDate;
    }, [dateData]);

    return (
        <Popover key={`${databaseId}-${data.id}-${column.id}`} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="p-2 flex items-center w-full h-full focus:outline-none focus:shadow-lg focus:border focus:rounded-lg focus:z-[100]">
                    {dateDisplay}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
                <ColumnCellDate
                    databaseId={databaseId}
                    rowData={data}
                    column={column}
                />
            </PopoverContent>
        </Popover>
    );
}

export default memo(DateCell);
