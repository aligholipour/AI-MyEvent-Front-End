import jMoment from "moment-jalaali";

/**
 * تبدیل تاریخ میلادی به تاریخ جلالی
 * @param gregorianDate - تاریخ میلادی (Date یا string ISO)
 * @returns تاریخ جلالی به فرمت "YYYY/MM/DD"
 */
export const toJalaali = (gregorianDate: Date | string | null | undefined): string => {
    if (!gregorianDate) return '';

    try {
        const m = typeof gregorianDate === 'string'
            ? jMoment(gregorianDate, 'YYYY-MM-DD')
            : jMoment(gregorianDate);

        if (!m.isValid()) return '';

        return m.format('jYYYY/jMM/jDD');
    } catch (error) {
        console.error('خطا در تبدیل تاریخ میلادی به جلالی:', error);
        return '';
    }
};

/**
 * تبدیل تاریخ جلالی به تاریخ میلادی
 * @param jalaaliDate - تاریخ جلالی به فرمت "YYYY/MM/DD" یا "۱۴۰۲/۰۱/۰۱"
 * @returns تاریخ میلادی (Date object)
 */
export const toGregorian = (jalaaliDate: string): Date => {
    if (!jalaaliDate) return new Date();

    try {
        // تبدیل ارقام فارسی به انگلیسی
        const persianToEnglish = (str: string) => {
            const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
            return str.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d).toString());
        };

        const normalizedDate = persianToEnglish(jalaaliDate.trim());
        const m = jMoment(normalizedDate, 'jYYYY/jMM/jDD');

        if (!m.isValid()) {
            console.error('تاریخ جلالی نامعتبر:', jalaaliDate);
            return new Date();
        }

        return m.toDate();
    } catch (error) {
        console.error('خطا در تبدیل تاریخ جلالی به میلادی:', error);
        return new Date();
    }
};

/**
 * تبدیل تاریخ جلالی مستقیماً به ISO string برای ارسال به سرور
 * @param jalaaliDate - تاریخ جلالی به فرمت "YYYY/MM/DD" یا "۱۴۰۲/۰۱/۰۱"
 * @returns تاریخ به فرمت ISO string
 */
export const jalaaliToISOString = (jalaaliDate: string): string => {
    if (!jalaaliDate) return '';

    const gregorianDate = toGregorian(jalaaliDate);
    return gregorianDate.toISOString();
};

/**
 * دریافت تاریخ جلالی به فرمت نمایشی با ارقام فارسی
 * @param date - تاریخ میلادی (Date یا string ISO)
 * @returns تاریخ جلالی با ارقام فارسی "۱۴۰۲/۰۱/۰۱"
 */
export const toJalaaliDisplay = (date: Date | string | null | undefined): string => {
    const jalaaliDate = toJalaali(date);
    if (!jalaaliDate) return '';

    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return jalaaliDate.replace(/\d/g, (digit) => farsiDigits[parseInt(digit, 10)]);
};

/**
 * دریافت تاریخ جلالی فقط بخش سال
 * @param date - تاریخ میلادی
 * @returns سال جلالی
 */
export const getJalaaliYear = (date: Date | string | null | undefined): number => {
    if (!date) {
        const m = jMoment();
        return m.jYear();
    }

    try {
        const m = typeof date === 'string'
            ? jMoment(date, 'YYYY-MM-DD')
            : jMoment(date);
        return m.jYear();
    } catch {
        const m = jMoment();
        return m.jYear();
    }
};
/**
 * دریافت تاریخ جلالی فقط بخش ماه
 * @param date - تاریخ میلادی
 * @returns ماه جلالی (1-12)
 */
export const getJalaaliMonth = (date: Date | string | null | undefined): number => {
    if (!date) {
        const m = jMoment();
        return m.jMonth() + 1;
    }

    try {
        const m = typeof date === 'string'
            ? jMoment(date, 'YYYY-MM-DD')
            : jMoment(date);
        return m.jMonth() + 1;
    } catch {
        const m = jMoment();
        return m.jMonth() + 1;
    }
};

/**
 * دریافت تاریخ جلالی فقط بخش روز
 * @param date - تاریخ میلادی
 * @returns روز جلالی (1-31)
 */
export const getJalaaliDay = (date: Date | string | null | undefined): number => {
    if (!date) {
        const m = jMoment();
        return m.jDate();
    }

    try {
        const m = typeof date === 'string'
            ? jMoment(date, 'YYYY-MM-DD')
            : jMoment(date);
        return m.jDate();
    } catch {
        const m = jMoment();
        return m.jDate();
    }
};

/**
 * سازی ترکیب سال، ماه، روز به یک تاریخ میلادی
 * @param jYear - سال جلالی
 * @param jMonth - ماه جلالی (1-12)
 * @param jDay - روز جلالی (1-31)
 * @returns تاریخ میلادی
 */
export const makeJalaaliDate = (jYear: number, jMonth: number, jDay: number): Date => {
    try {
        const m = (jMoment() as any).jYear(jYear).jMonth(jMonth - 1).jDate(jDay);
        return m.toDate();
    } catch (error) {
        console.error('خطا در ساخت تاریخ جلالی:', error);
        return new Date();
    }
};

/**
 * فرمت کردن تاریخ برای ارسال به سرور (ISO 8601)
 * @param date - تاریخ میلادی یا جلالی
 * @returns تاریخ به فرمت ISO "YYYY-MM-DDTHH:mm:ss.sssZ"
 */
export const formatForServer = (date: Date | string | null | undefined): string | null => {
    if (!date) return null;

    try {
        let m: any; // یا می‌توانید از type: import('moment-jalaali').Moment استفاده کنید

        if (typeof date === 'string') {
            // اگر فرمت جلالی باشد
            if (date.includes('/') && date.length === 10) {
                m = jMoment(date, 'jYYYY/jMM/jDD');
            } else {
                // اگر فرمت ISO باشد
                m = jMoment(date);
            }
        } else {
            m = jMoment(date);
        }

        if (!m.isValid()) return null;

        return m.toISOString();
    } catch (error) {
        console.error('خطا در فرمت کردن تاریخ برای سرور:', error);
        return null;
    }
};

/**
 * مقایسه دو تاریخ
 * @param date1 - تاریخ اول
 * @param date2 - تاریخ دوم
 * @returns -1 اگر date1 < date2، 0 اگر برابر، 1 اگر date1 > date2
 */
export const compareDates = (
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
): number => {
    if (!date1 || !date2) return 0;

    try {
        const m1 = typeof date1 === 'string' ? jMoment(date1) : jMoment(date1);
        const m2 = typeof date2 === 'string' ? jMoment(date2) : jMoment(date2);

        // تبدیل به timestamp و مقایسه
        const time1 = m1.valueOf();
        const time2 = m2.valueOf();

        if (time1 < time2) return -1;
        if (time1 > time2) return 1;
        return 0;
    } catch {
        return 0;
    }
};

/**
 * بررسی آیا تاریخ معتبر است
 * @param date - تاریخ
 * @returns true اگر معتبر باشد
 */
export const isValidDate = (date: Date | string | null | undefined): boolean => {
    if (!date) return false;

    try {
        const m = typeof date === 'string' ? jMoment(date) : jMoment(date);
        return m.isValid();
    } catch {
        return false;
    }
};


// export const toPersian = (date: Date | string | null | undefined): string => {
//     if (!date) return '';

//     const d = typeof date === 'string' ? new Date(date) : date;
//     if (isNaN(d.getTime())) return '';

//     const m = jMomentt(d);
//     return m.format('jYYYY/jMM/jD');
// };

// export const toGregorian = (persianDate: string): Date => {
//     if (!persianDate) return new Date();

//     const cleanVal = persianDate.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

//     const m = jMoment(cleanVal, 'jYYYY/jMM/jD');
//     if (!m.isValid()) return new Date();

//     const date = m.toDate();
//     date.setHours(12, 0, 0, 0);

//     return date;
// };