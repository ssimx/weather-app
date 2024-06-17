export default function formatDateTimezone(timezone, date = new Date()) {
    const optionsYear = {
        timeZone: timezone,
        year: 'numeric',
    };
    const formatterYear = new Intl.DateTimeFormat([], optionsYear);
    const newDateYear = formatterYear.format(date);

    const optionsMonth = {
        timeZone: timezone,
        month: '2-digit',
    };
    const formatterMonth = new Intl.DateTimeFormat([], optionsMonth);
    const newDateMonth = formatterMonth.format(date);

    const optionsDay = {
        timeZone: timezone,
        day: '2-digit',
    };
    const formatterDay = new Intl.DateTimeFormat([], optionsDay);
    const newDateDay = formatterDay.format(date);

    const optionsTime = {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    };
    const formatterTime = new Intl.DateTimeFormat([], optionsTime);
    const newDateTime = formatterTime.format(date);

    let newDate = `${newDateYear}/${newDateMonth}/${newDateDay}T${newDateTime}`;

    newDate = new Date(Date.parse(newDate.replaceAll('/', '-')));
    return newDate;
}
