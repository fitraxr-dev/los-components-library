import { ESDD } from '@/configs/constants/pathname';


export const DEFAULT_STEPS = [
  {
    enable: true,
    label: 'Informasi Customer',
    urlPath: ESDD.DEBTOR_INFORMATION_PAGE,
  },
  {
    enable: true,
    label: 'Ringkasan Facilitas',
    urlPath: ESDD.FACILITY_OVERVIEW_PAGE,
  },
  {
    enable: true,
    label: 'Executive Summary',
    urlPath: ESDD.EXECUTIVE_SUMMARY_PAGE,
  },
  {
    enable: true,
    label: 'Environtmental and Social Due Diligence Report',
    urlPath: ESDD.ESDD_REPORT_PAGE,
  },
  {
    enable: true,
    label: 'Corrective Action Plan',
    urlPath: ESDD.CORRECTIVE_ACTION_PLAN_PAGE,
  },
  {
    enable: true,
    label: 'Daftar Pelaporan Rutin',
    urlPath: ESDD.REPORTING_LIST_ROUTINE_PAGE,
  },
  {
    enable: true,
    label: 'Kesimpulan',
    urlPath: ESDD.SUMMARY_PAGE,
  },
  {
    enable: true,
    label: 'Draft Memo',
    urlPath: ESDD.DRAFT_MEMO_PAGE,
  },
  {
    enable: true,
    label: 'View All Document',
    urlPath: ESDD.VIEW_ALL_DOCUMENT_PAGE,
  },
  {
    enable: true,
    label: 'Validasi',
    urlPath: ESDD.VALIDATION_PAGE,
  },
];
