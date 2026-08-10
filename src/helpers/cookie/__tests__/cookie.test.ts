import Cookies from 'js-cookie';

import { getCookie, setCookie } from '../cookie';


jest.mock('js-cookie');

describe('helpers/cookie', () => {
  it('should call Cookies.get()', () => {
    Cookies.get.mockReturnValue('cookieValue');

    const result = getCookie('key');

    expect(Cookies.get).toBeCalledTimes(1);
    expect(Cookies.get).toBeCalledWith('key');
    expect(result).toBe('cookieValue');
  });

  it('should call Cookies.set()', () => {
    setCookie('cookieKey', 'cookieValue', 'cookieOptions');

    expect(Cookies.set).toBeCalledTimes(1);
    expect(Cookies.set).toBeCalledWith('cookieKey', 'cookieValue', 'cookieOptions');
  });
});
