import { roles } from '@/configs/constants/index';

import { HOME_PAGE, LOGIN_PAGE, TESTING_PAGE } from './constants/pathname';


export const accessPage = {
  [HOME_PAGE]: [roles.ALL],
  [LOGIN_PAGE]: [roles.ALL],
  [TESTING_PAGE]: [roles.ALL],
};
