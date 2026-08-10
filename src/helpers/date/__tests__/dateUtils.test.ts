import {
  addDays,
  addMonths,
  addYears,
  getStartOfMonthFromDate,
  getEndOfMonthFromDate,
  differenceDate,
  isDateBetween,
  isDateBefore,
  isDateAfter,
  substractDays,
} from '../dateUtils';


describe('helpers/date/addDays', () => {
  it('should add days correctly to the starting date', () => {
    expect(
      addDays(new Date('2022-04-22T02:28:49.227996Z'), 10).toString(),
    ).toStrictEqual('Mon, 02 May 2022 02:28:49 GMT');
  });
});

describe('helpers/date/substractDays', () => {
  it('should subtract days correctly to the starting date', () => {
    expect(
      substractDays(new Date('2022-04-22T02:28:49.227996Z'), 10).toString(),
    ).toStrictEqual('Tue, 12 Apr 2022 02:28:49 GMT');
  });
});

describe('helpers/date/addMonths', () => {
  it('should add months correctly to the starting date', () => {
    expect(
      addMonths(new Date('2022-04-22T02:28:49.227996Z'), 10).toString(),
    ).toStrictEqual('Wed, 22 Feb 2023 02:28:49 GMT');
  });
});

describe('helpers/date/addYears', () => {
  it('should add years correctly to the starting date', () => {
    expect(
      addYears(new Date('2022-04-22T02:28:49.227996Z'), 10).toString(),
    ).toStrictEqual('Thu, 22 Apr 2032 02:28:49 GMT');
  });
});

describe('helpers/date/getStartOfMonthFromDate', () => {
  it('should return correct value start of month', () => {
    expect(
      getStartOfMonthFromDate(new Date('2022-04-22T02:28:49.227996Z')).toString(),
    ).toStrictEqual('Fri, 01 Apr 2022 00:00:00 GMT');
  });
});

describe('helpers/date/getEndOfMonthFromDate', () => {
  it('should return correct value end of month', () => {
    expect(getEndOfMonthFromDate(new Date('2021-07-22T02:28:49')).toString()).toStrictEqual(
      'Sat, 31 Jul 2021 23:59:59 GMT',
    );
  });
});

describe('helpers/date/differenceDate', () => {
  it('should return correct value differenceDate', () => {
    expect(
      differenceDate(
        new Date('2021-07-22T02:28:49.227996Z'),
        new Date('2021-07-24T02:28:49.227996Z'),
      ),
    ).toStrictEqual(2);
  });
});

describe('helpers/date/isDateBetween', () => {
  it('should return correct value is date between or not', () => {
    expect(
      isDateBetween(
        new Date('2021-07-23T02:28:49.227996Z'),
        new Date('2021-07-22T02:28:49.227996Z'),
        new Date('2021-07-24T02:28:49.227996Z'),
      ),
    ).toStrictEqual(true);
  });
});

describe('helpers/date/isDateBefore', () => {
  it('should return correct value is date before or not', () => {
    expect(
      isDateBefore(new Date('2021-07-23T02:28:49.227996Z'), new Date('2021-07-24T02:28:49.227996Z')),
    ).toStrictEqual(true);
  });
});

describe('helpers/date/isDateAfter', () => {
  it('should return correct value is date after or not', () => {
    expect(
      isDateAfter(new Date('2021-07-23T02:28:49.227996Z'), new Date('2021-07-24T02:28:49.227996Z')),
    ).toStrictEqual(false);
  });
});
