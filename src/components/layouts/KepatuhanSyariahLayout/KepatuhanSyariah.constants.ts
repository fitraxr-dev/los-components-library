import { KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';


export const DEFAULT_STEPS = [
  {
    enable: true,
    label: 'Informasi Customer',
    urlPath: KEPATUHAN_SYARIAH.DEBTOR_INFORMATION_PAGE,
  },
  {
    enable: true,
    label: 'Ringkasan Facilitas',
    urlPath: KEPATUHAN_SYARIAH.FACILITY_OVERVIEW_PAGE,
  },
  {
    enable: true,
    label: 'Checklist Kepatuhan Syariah',
    urlPath: KEPATUHAN_SYARIAH.SYARIAH_COMPLIANCE_CHECKLIST,
  },
  {
    enable: true,
    label: 'Kesimpulan',
    urlPath: KEPATUHAN_SYARIAH.SUMMARY_PAGE,
  },
  {
    enable: true,
    label: 'Draft Memo',
    urlPath: KEPATUHAN_SYARIAH.DRAFT_MEMO_PAGE,
  },
  {
    enable: true,
    label: 'View All Document',
    urlPath: KEPATUHAN_SYARIAH.VIEW_ALL_DOCUMENT_PAGE,
  },
  {
    enable: true,
    label: 'Validasi',
    urlPath: KEPATUHAN_SYARIAH.VALIDATION_PAGE,
  },
];
