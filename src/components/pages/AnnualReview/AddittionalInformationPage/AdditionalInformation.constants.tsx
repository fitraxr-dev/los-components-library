import { roles } from '@/configs/constants';
import { ASPECT_LEGAL_REVIEW } from '@/configs/constants/pathname';


export const ListSuccessSubmit = [
  {
    module: 'assignment',
    role: roles.TL,
    url: ASPECT_LEGAL_REVIEW.ASSIGNMENT_PAGE,
  },
  {
    module: 'monitoring',
    role: roles.TL,
    url: ASPECT_LEGAL_REVIEW.MONITORING_LIST_PAGE,
  },
  {
    module: 'bucket-list',
    role: roles.RM,
    url: ASPECT_LEGAL_REVIEW.LIST_PAGE,
  },
  {
    module: 'monitoring',
    role: roles.KADIV,
    url: ASPECT_LEGAL_REVIEW.MONITORING_LIST_PAGE,
  },
];
