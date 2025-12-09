export type FireDatabaseViewGroup = {
    columnId: string;
};

export type FireDatabaseViewSort = {
    columnId: string;
    direction: 'asc' | 'desc';
};

export type FireDatabaseViewFilter =
    | FireDatabaseViewFilterString
    | FireDatabaseViewFilterNumber
    | FireDatabaseViewFilterBoolean
    | FireDatabaseViewFilterDate;

export type FireDatabaseViewFilterString = {
    columnId: string;
    operator:
        | 'equals'
        | 'notEquals'
        | 'contains'
        | 'notContains'
        | 'empty'
        | 'notEmpty';
    value: string | string[];
};

export type FireDatabaseViewFilterNumber = {
    columnId: string;
    operator:
        | 'equals'
        | 'notEquals'
        | 'greaterThan'
        | 'lessThan'
        | 'empty'
        | 'notEmpty';
    value: number;
};

export type FireDatabaseViewFilterBoolean = {
    columnId: string;
    operator: 'equals';
    value: boolean;
};

export type FireDatabaseViewFilterDate = {
    columnId: string;
    // 기준(영어로) (start 또는 end)
    reference: 'start' | 'end';
    // 동일, 이전(당일 불포함), 이전(당일 포함), 이후(당일 불포함), 이후(당일 포함), 기간, 오늘기준, 비어있음, 비어있지않음
    operator:
        | 'equals'
        | 'before'
        | 'beforeOrOn'
        | 'after'
        | 'afterOrOn'
        | 'between'
        | 'today'
        | 'empty'
        | 'notEmpty';
    value: {
        start?: Date;
        end?: Date;
        // 오늘 기준일 경우: last, this, next
        period?: 'last' | 'this' | 'next';
        // 오늘 기준일 경우: day, week, month, year
        unit?: 'day' | 'week' | 'month' | 'year';
    };
};
