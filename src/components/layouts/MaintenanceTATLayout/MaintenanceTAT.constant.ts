import { maintenanceTAT } from '@/configs/constants/pathname';


export const DEFAULT_STEPS_BAR = [
  {
    enable: true,
    label: 'Maintenance Turn Around Time (TAT)',
    urlPath: maintenanceTAT.TAT_DETAIL,
  },
  {
    enable: true,
    label: 'Validasi',
    urlPath: maintenanceTAT.VALIDATION,
  },
];
