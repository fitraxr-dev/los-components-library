import dayjs from 'dayjs';
import localeId from 'dayjs/locale/id';
import isBetween from 'dayjs/plugin/isBetween';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';


dayjs.locale(localeId);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(tz);


const timezone = dayjs.tz.guess();


/**
 * Adds a number of days to the given date.
 * https://day.js.org/docs/en/manipulate/add
 * @param {*} date The date string to check for the first date.
 * @param {*} days The number of days to add.
 * @return {object} Returns a cloned Day.js object with the additional days.
 */
export const addDays = (date, days) => dayjs(date).add(days, 'day');

/**
 * Substact a number of days to the given date.
 * https://day.js.org/docs/en/manipulate/subtract
 * @param {*} date The date string to check for the first date.
 * @param {*} days The number of days to substract.
 * @return {object} Returns a cloned Day.js object with the substact days.
 */
export const substractDays = (date, days) => dayjs(date).subtract(days, 'day');

/**
 * Adds a number of months to the given date.
 * https://day.js.org/docs/en/manipulate/add
 * @param {*} date The date string to check for the first date.
 * @param {*} months The number of months to add.
 * @return {object} Returns a cloned Day.js object with the additional months.
 */
export const addMonths = (date, months) => dayjs(date).add(months, 'month');

/**
 * Adds a number of years to the given date.
 * https://day.js.org/docs/en/manipulate/add
 * @param {*} date The date string to check for the first date.
 * @param {*} years The number of years to add.
 * @return {object} Returns a cloned Day.js object with the additional years.
 */
export const addYears = (date, years) => dayjs(date).add(years, 'year');

/**
 * Get the first date of the month.
 * https://day.js.org/docs/en/manipulate/start-of
 * @param {string} date The date string to check for the first date.
 * @return {object} Returns a cloned Day.js object and set it to the start of a unit of time.
 */
export const getStartOfMonthFromDate = (date) => dayjs.utc(date).startOf('month').tz(timezone);

/**
 * Get the last date of the month.
 * https://day.js.org/docs/en/manipulate/end-of
 * @param {string} date The date string to check for the last date.
 * @return {object} Returns a cloned Day.js object and set it to the end of a unit of time.
 */
export const getEndOfMonthFromDate = (date) => dayjs.utc(date).endOf('month').tz(timezone);

/**
 * Indicates the difference between two date-time in the specified unit
 * https://day.js.org/docs/en/display/difference
 * @param {string} startDate The start date as parameter to check.
 * @param {string} endDate The end date as parameter to check.
 * @param {string} unit The unit of time, eg: 'day'(default) / 'month' / 'hour' / 'minute' / 'second' etc
 * @param {boolean} isFloat The default return an integer. If you want a floating point number, pass true
 * @param {number} The result of the comparison.
 */
export const differenceDate = (
  startDate,
  endDate,
  unit = 'day',
  isFloat = false,
) => dayjs(endDate).diff(startDate, unit, isFloat);

/**
 * Check is input date between start and end date.
 * @param {string} date The date string you need to check is between start and end date.
 * @param {string} startDate The start date as parameter to check.
 * @param {string} endDate The end date as parameter to check.
 * @return {boolean} True if the date is between start and end date, false otherwise.
 */
export const isDateBetween = (date, startDate, endDate) => dayjs(date).isBetween(startDate, endDate);

/**
 * Check is input date before parameter date.
 * @param {string} date The date string you need to check is before parameter date.
 * @param {string} beforeDate The before date as parameter to check.
 * @return {boolean} True if the date is before parameter date, false otherwise.
 */
export const isDateBefore = (date, beforeDate) => dayjs(date).isBefore(beforeDate);

/**
 * Check is input date after parameter date.
 * @param {string} date The date string you need to check is after parameter date.
 * @param {string} afterDate The after date as parameter to check.
 * @return {boolean} True if the date is after parameter date, false otherwise.
 */
export const isDateAfter = (date, afterDate) => dayjs(date).isAfter(afterDate);
