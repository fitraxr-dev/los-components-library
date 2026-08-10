import { roles } from '@/configs/constants';
import { eligibilityReview } from '@/configs/constants/pathname';


export const ListSuccessSubmit = [
  {
    module: 'assignment',
    role: roles.TL,
    url: eligibilityReview.ASSIGNMENT_PAGE,
  },
  {
    module: 'bucket-list',
    role: roles.RM,
    url: eligibilityReview.LIST_PAGE,
  },
  {
    module: 'monitoring',
    role: roles.KADIV,
    url: eligibilityReview.MONITORING_LIST_PAGE,
  },
  {
    module: 'monitoring',
    role: roles.TL,
    url: eligibilityReview.MONITORING_LIST_PAGE,
  },
  {
    module: 'assignment',
    role: roles.MAKER,
    url: eligibilityReview.ASSIGNMENT_PAGE,
  },
  {
    module: 'bucket-list',
    role: roles.MAKER,
    url: eligibilityReview.LIST_PAGE,
  },
  {
    module: 'monitoring',
    role: roles.MAKER,
    url: eligibilityReview.MONITORING_LIST_PAGE,
  },
  {
    module: 'assignment',
    role: roles.CHECKER,
    url: eligibilityReview.ASSIGNMENT_PAGE,
  },
  {
    module: 'bucket-list',
    role: roles.CHECKER,
    url: eligibilityReview.LIST_PAGE,
  },
  {
    module: 'monitoring',
    role: roles.CHECKER,
    url: eligibilityReview.MONITORING_LIST_PAGE,
  },
];
