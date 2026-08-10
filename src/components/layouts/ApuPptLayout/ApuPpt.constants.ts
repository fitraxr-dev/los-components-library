import { apuPpt } from '@/configs/constants/pathname';


export const DEFAULT_STEPS = [
  {
    enable: true,
    label: 'Informasi Customer',
    urlPath: apuPpt.REQUEST_LIST_PAGE,
  },
  {
    enable: true,
    label: 'Informasi Profil Customer',
    urlPath: apuPpt.REQUEST_DEBTOR_INFORMATION_PROFILE_PAGE,
  },
  {
    enable: true,
    label: 'Struktur Kepemilikan Saham',
    urlPath: apuPpt.REQUEST_SHARE_OWNERSHIP_STRUCTURE_PAGE,
  },
  {
    enable: true,
    label: 'Document Customer',
    urlPath: apuPpt.REQUEST_DEBTOR_DOCUMENT,
  },
  {
    enable: true,
    label: 'Beneficial Owner',
    urlPath: apuPpt.REQUEST_BENEFICIAL_OWNER,
  },
  {
    enable: true,
    label: 'Customer Due DIligence',
    urlPath: apuPpt.REQUEST_CUSTOMER_DUE_DILIGENCE_PAGE,
  },
  {
    enable: true,
    label: 'Catatan',
    urlPath: apuPpt.REQUEST_NOTE_PAGE,
  },
  {
    enable: true,
    label: 'Draft Memo',
    urlPath: apuPpt.REQUEST_DRAFT_MEMO,
  },
  {
    enable: true,
    label: 'View All Documents',
    urlPath: apuPpt.REQUEST_VIEW_ALL_DOCUMENT_PAGE,
  },
  {
    enable: true,
    label: 'Validasi',
    urlPath: apuPpt.REQUEST_VALIDATION_PAGE,
  },
];

///mockdata
export const mockData = {
  progress: '',
  steps: [
    {
      action: null,
      bucketProcessId: 123456,
      enable: true,
      isDone: true,
      key: '',
    }
  ],
};
