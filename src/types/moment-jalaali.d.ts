declare module 'moment-jalaali' {
    export interface JalaliMoment {
        jYear(): number;
        jMonth(): number;
        jDate(): number;
        jDayOfYear(): number;
        jWeek(): number;
        jWeekday(): number;
        jWeekday(day: number): JalaliMoment;
        isValid(): boolean;
        format(formatString?: string): string;
        clone(): JalaliMoment;
        add(amount: number, unit: string): JalaliMoment;
        subtract(amount: number, unit: string): JalaliMoment;
        startOf(unit: string): JalaliMoment;
        endOf(unit: string): JalaliMoment;
        isSame(other: JalaliMoment | string | Date, unit?: string): boolean;
        toDate(): Date;
        day(): number;
        hours(): number;
        minutes(): number;
        seconds(): number;
    }

    export interface JalaliMomentStatic {
        (value?: string | number | Date | JalaliMoment | null, format?: string, strict?: boolean): JalaliMoment;
        jIsLeapYear(year: number): boolean;
        jDaysInMonth(year: number, month: number): number;
        jMonths(): string[];
        jMonthsShort(): string[];
        jWeekdays(): string[];
        jWeekdaysShort(): string[];
        jWeekdaysMin(): string[];
        loadPersian(options?: Record<string, unknown>): void;
    }

    const jMoment: JalaliMomentStatic;
    export default jMoment;
}