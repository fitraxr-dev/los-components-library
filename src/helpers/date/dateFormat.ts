import dayjs from 'dayjs';
import localeId from 'dayjs/locale/id';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';


dayjs.locale(localeId);
dayjs.extend(utc);
dayjs.extend(tz);

/*
  Read: https://day.js.org/docs/en/display/format
  to learn more about dayjs date format options
*/

/**
 * Parse date as native JS Date object
 * https://day.js.org/docs/en/display/as-javascript-date
 * @param {string} date The date string you need to parse
 * @return {Date} The date in native JS Date object
 */
export const toJSDate = (date) => dayjs(date).toDate();

// Current Date without format. Example: 2022-06-20T15:32:28+07:00
export const toCurrentDate = () => dayjs();

/**
 * The name of the day of the week. Example: Senin / Selasa / ... Minggu
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toDayString = (date) => dayjs(date).format('dddd');

/**
 * Custom date format. Example: 20 Desember 2021
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toDateString = (date) => dayjs(date).format('DD MMMM YYYY');

/**
 * Custom date format. Example: 25-06-2021
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toDateStringNumber = (date) => dayjs(date).format('DD-MM-YYYY');

/**
 * Four-digit year. Example: 2021
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toYearStringNumber = (date) => dayjs(date).format('YYYY');

/**
 * Four-digit year. Example: Tue, 20/01/2018
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toDaysDateString = (date) => dayjs(date).format('dddd, DD/MM/YYYY');

/**
 * The month, 2-digits. Example: 01 / 02 / 03 ... 12
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toMonthStringNumber = (date) => dayjs(date).format('MM');

/**
 * Hour, 2-digits + Minute, 2-digits. Example: 23:59
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toHourMinute = (date) => dayjs.utc(date).format('HH:mm');

/**
 * Hour, 2-digits + Minute, 2-digits + Second, 2-digits. Example: 23:59:05
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toHourMinuteSecond = (date) => dayjs(date).format('HH:mm:ss');

/**
 * Format date string to human readable format
 * reference: https://day.js.org/docs/en/display/format
 * @param {string} date The date string you need to format
 * @param {string} dateFormat The standart date format
 * @param {object} options The options object
 * @param {boolean} options.withTime Whether to include time in the format
 * @param {boolean} options.withSeconds Whether to include seconds in the format
 * @return {string}  The formatted date string
 */
export const formatDate = (date = new Date(), dateFormat = 'D MMM YYYY', options = { withSeconds: true, withTime: false }) => {
  const formattedDate = dayjs(date).format(dateFormat);
  if (options.withTime) {
    return `${formattedDate} ${options.withSeconds ? dayjs(date).format('HH:mm:ss') : dayjs(date).format('HH:mm')}`;
  }
  return formattedDate;
};

/**
 * To Local Day and Date Format
 * Example: Monday, 20 December 2021
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const toLocalDayAndDate = (date) => dayjs(date).format('dddd, DD MMMM YYYY');

/**
 * UTC to Local Time Format
 * @param date The date string you need to format
 * @returns The formatted date string
 * @example 15:32 WIB
 */
export const toLocalTime = (date, format = 'HH:mm') => dayjs(date).local().format(format);

/**
 * Convert UTC to Local Time Jakarta with Keep Local Time
 * @example 2022-06-20T15:32:28+07:00
 * @returns 2022-06-20T15:32:28+07:00
 */
export const dayJsJakartaKeep = (date) => {
  return dayjs(date).tz('Asia/Jakarta', true).local().format();
};

/**
 * Convert UTC to Local Time Jakarta with Keep Local Time Obj Local
 * @example 2022-06-20
 * @returns 2022-06-20
 */
export const dayJsJakartaKeepV2 = (date) => {
  return dayjs(date).tz('Asia/Jakarta', true).local();
};

export const dayJsJakartaIsoString = (date) => {
  if (!date) {
    return null;
  }
  const tempDate = new Date(date);
  if (isNaN(tempDate.getTime())) {
    return date;
  }
  tempDate.setHours(tempDate.getHours() + 7);
  return tempDate.toISOString();
};

/**
 * To Local Day and DateTime Format
 * Example: 27 Februari 2025, 11:24:42
 * @param {string} date The date string you need to format
 * @return {string} The formatted date string
 */
export const formatDateTime = (date, dateFormat = 'D MMM YYYY, HH:mm:ss') => dayjs(date).format(dateFormat);

/**
 * Format date string to UTC date format
 * @param {string} date The date string you need to format
 * @param {string} dateFormat The standart date format and time (11:24:42)
 * @return {string}  The formatted date string
 */
export const formatDateToUtc = (date = new Date(), dateFormat = 'D MMM YYYY, HH:mm:ss') => {
  if (!date) return null;
  const tempDate = new Date(date as any);
  if (isNaN(tempDate.getTime())) {
    return date;
  }
  return dayjs.utc(date).format(dateFormat);
};
