import updateRowData from '@/components/FireDatabase/api/updateRowData';
import { FireDatabaseColumn } from '@/components/FireDatabase/settings/types/database';
import {
    FireDatabaseDataDate,
    FireDatabaseRow,
} from '@/components/FireDatabase/settings/types/row';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { ko } from 'react-day-picker/locale';

export default function ColumnCellDate({
    databaseId,
    column,
    rowData,
}: {
    databaseId: string;
    column: FireDatabaseColumn;
    rowData: FireDatabaseRow;
}) {
    const after2Years = new Date();
    after2Years.setFullYear(after2Years.getFullYear() + 2);
    const dateData = rowData.data?.[column.id] as FireDatabaseDataDate;
    const [start, setStart] = useState<Date | null>(
        dateData?.start ? dateData.start.toDate() : null
    );
    const [end, setEnd] = useState<Date | null>(
        dateData?.end ? dateData.end.toDate() : null
    );
    const [includeTime, setIncludeTime] = useState<boolean>(
        dateData?.includeTime || false
    );
    const [includeEnd, setIncludeEnd] = useState<boolean>(
        dateData?.includeEnd || false
    );

    useEffect(() => {
        updateRowData(databaseId, rowData.id, {
            [column.id]: {
                start: start ? Timestamp.fromDate(start) : null,
                end: includeEnd && end ? Timestamp.fromDate(end) : null,
                includeTime: includeTime,
                includeEnd: includeEnd,
            } as FireDatabaseDataDate,
        });
    }, [start, end, includeTime, includeEnd]);

    return (
        <>
            <div className="flex justify-center">
                <input
                    className={cn(
                        'px-2 py-3 text-sm h-6 focus:outline-none border bg-muted',
                        {
                            'rounded-l-sm w-30': includeTime,
                            'rounded-sm w-60': !includeTime,
                        }
                    )}
                    value={start ? start.toLocaleDateString() : ''}
                    onChange={(e) => {
                        const newDate = new Date(e.currentTarget.value);
                        if (!isNaN(newDate.getTime())) {
                            if (start) {
                                newDate.setHours(
                                    start.getHours(),
                                    start.getMinutes()
                                );
                            }
                            setStart(newDate);
                        }
                    }}
                />
                {includeTime && (
                    <input
                        className={cn(
                            'px-2 py-3 border-t border-b border-r w-30 text-sm h-6 focus:outline-none border bg-muted rounded-r-sm'
                        )}
                        defaultValue={
                            start
                                ? moment(start).tz('Asia/Seoul').format('HH:mm')
                                : ''
                        }
                        onChange={(e) => {
                            const newDateTime = moment(start)
                                .tz('Asia/Seoul')
                                .toDate();
                            const timeParts = e.currentTarget.value.split(':');

                            if (timeParts.length !== 2) return;
                            const hours = parseInt(timeParts[0], 10);
                            const minutes = parseInt(timeParts[1], 10);
                            if (isNaN(hours) || isNaN(minutes)) return;

                            newDateTime.setHours(hours);
                            newDateTime.setMinutes(minutes);

                            if (!isNaN(newDateTime.getTime())) {
                                setStart(newDateTime);
                            }
                        }}
                    />
                )}
            </div>
            {includeEnd && (
                <div className="flex justify-center mt-1.5">
                    <input
                        className={cn(
                            'px-2 py-3 text-sm h-6 focus:outline-none border bg-muted',
                            {
                                'rounded-l-sm w-30': includeTime,
                                'rounded-sm w-60': !includeTime,
                            }
                        )}
                        defaultValue={end ? end.toLocaleDateString() : ''}
                        onChange={(e) => {
                            const newDate = new Date(e.currentTarget.value);
                            if (!isNaN(newDate.getTime())) {
                                setEnd(newDate);
                            }
                        }}
                    />
                    {includeTime && (
                        <input
                            className={cn(
                                'px-2 py-3 border-t border-b border-r w-30 text-sm h-6 focus:outline-none border bg-muted rounded-r-sm'
                            )}
                            defaultValue={
                                end
                                    ? moment(end)
                                          .tz('Asia/Seoul')
                                          .format('HH:mm')
                                    : ''
                            }
                            onChange={(e) => {
                                const newDateTime = moment(end)
                                    .tz('Asia/Seoul')
                                    .toDate();
                                const timeParts =
                                    e.currentTarget.value.split(':');

                                if (timeParts.length !== 2) return;
                                const hours = parseInt(timeParts[0], 10);
                                const minutes = parseInt(timeParts[1], 10);
                                if (isNaN(hours) || isNaN(minutes)) return;

                                newDateTime.setHours(hours);
                                newDateTime.setMinutes(minutes);

                                if (!isNaN(newDateTime.getTime())) {
                                    setEnd(newDateTime);
                                }
                            }}
                        />
                    )}
                </div>
            )}
            {includeEnd ? (
                <Calendar
                    timeZone="Asia/Seoul"
                    className="mt-2"
                    locale={ko}
                    captionLayout="dropdown"
                    endMonth={after2Years}
                    mode={'range'}
                    selected={{
                        from: start || undefined,
                        to: end || undefined,
                    }}
                    onSelect={(selected: any) => {
                        if (selected?.from) {
                            const newFrom = selected?.from as Date;
                            if (start) {
                                newFrom.setHours(
                                    start.getHours(),
                                    start.getMinutes()
                                );
                            }
                            setStart(newFrom);
                        }
                        if (selected?.to) {
                            const newTo = selected?.to as Date;
                            if (end) {
                                newTo.setHours(
                                    end.getHours(),
                                    end.getMinutes()
                                );
                            }
                            setEnd(newTo);
                        }
                    }}
                />
            ) : (
                <Calendar
                    captionLayout="dropdown"
                    endMonth={after2Years}
                    mode={'single'}
                    selected={start || undefined}
                    onSelect={(selected: any) => {
                        if (selected) {
                            const newDate = selected as Date;
                            if (start) {
                                newDate.setHours(
                                    start.getHours(),
                                    start.getMinutes()
                                );
                            }
                            setStart(newDate);
                        }
                        setEnd(null);
                    }}
                />
            )}

            <Separator />
            <label className="px-2 py-1 w-full flex justify-between items-center mt-2 hover:bg-muted rounded-sm">
                <div className="text-sm flex items-center gap-2">
                    종료일
                </div>
                <Switch
                    checked={includeEnd}
                    onCheckedChange={(checked) => setIncludeEnd(!!checked)}
                />
            </label>
            <label className="px-2 py-1 w-full flex justify-between items-center mt-2 hover:bg-muted rounded-sm">
                <div className="text-sm flex items-center gap-2">
                    시간 포함
                </div>
                <Switch
                    checked={includeTime}
                    onCheckedChange={(checked) => setIncludeTime(!!checked)}
                />
            </label>
        </>
    );
}
