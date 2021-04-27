export enum DateFormat {
    /** yyyy-MM-dd */
    Date = 'DATE',
    /** yyyy-MM-ddThh:mm */
    Input = 'INPUT',
    /** April 1, 2 AM */
    Locale = 'LOCALE'
}

function formatValue (value: number): number | string {
    if (value < 10)
        return '0' + value;

    return value;
}

export function formatDate (originalDate: Date | string, format = DateFormat.Input): string {
    const date = new Date(originalDate);
    const month = formatValue(date.getMonth() + 1);
    const day = formatValue(date.getDate());
    const hours = formatValue(date.getHours());
    const minutes = formatValue(date.getMinutes());

    if (format === DateFormat.Input) {
        return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
    }

    if (format === DateFormat.Date) {
        return `${date.getFullYear()}-${month}-${day}`;
    }

    return date.toLocaleString('en-US', { month: 'numeric', day: 'numeric', hour: 'numeric' });
}
