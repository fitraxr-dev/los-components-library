import {
  formatDate,
  toJSDate,
  toHourMinuteSecond,
  toHourMinute,
  toMonthStringNumber,
  toYearStringNumber,
  toDateStringNumber,
  toDateString,
  toDayString,
  toDaysDateString,
} from '../dateFormat';


describe('helpers/date/formatDate', () => {
  it('should return correct value formated date', () => {
    expect(formatDate(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('22 Jul 2021');
  });
});

describe('helpers/date/toJSDate', () => {
  it('should return correct value formated date (toJSDate)', () => {
    expect(toJSDate(new Date('2021-07-22T02:28:49.227996Z'))).toBeInstanceOf(Date);
  });
});

describe('helpers/date/toHourMinuteSecond', () => {
  it('should return correct value formated date (toHourMinuteSecond)', () => {
    expect(toHourMinuteSecond(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('02:28:49');
  });
});

describe('helpers/date/toHourMinute', () => {
  it('should return correct value formated date (toHourMinute)', () => {
    expect(toHourMinute(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('02:28');
  });
});

describe('helpers/date/toMonthStringNumber', () => {
  it('should return correct value formated date (toMonthStringNumber)', () => {
    expect(toMonthStringNumber(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('07');
  });
});

describe('helpers/date/toYearStringNumber', () => {
  it('should return correct value formated date (toYearStringNumber)', () => {
    expect(toYearStringNumber(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('2021');
  });
});

describe('helpers/date/toDateStringNumber', () => {
  it('should return correct value formated date (toDateStringNumber)', () => {
    expect(toDateStringNumber(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('22-07-2021');
  });
});

describe('helpers/date/toDaysDateString', () => {
  it('should return correct value formated date (toDaysDateString)', () => {
    expect(toDaysDateString(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('Kamis, 22/07/2021');
  });
});

describe('helpers/date/toDateString', () => {
  it('should return correct value formated date (toDateString)', () => {
    expect(toDateString(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('22 Juli 2021');
  });
});

describe('helpers/date/toDayString', () => {
  it('should return correct value formated date (toDayString)', () => {
    expect(toDayString(new Date('2021-07-22T02:28:49.227996Z'))).toStrictEqual('Kamis');
  });
});
