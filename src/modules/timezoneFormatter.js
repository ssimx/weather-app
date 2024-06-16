export default function formatDateTimezone(timezone, date = new Date()) {
    const options = {
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const newDate = new Date(Date.parse(formatter.format(date)));

    return newDate;
}
