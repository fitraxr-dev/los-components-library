import { technicalStudyReview } from '@/configs/constants/pathname';


export const DEFAULT_STEPS = [
  {
    enable: true,
    label: 'Informasi Customer',
    urlPath: technicalStudyReview.DEBTOR_INFORMATION_PAGE,
  },
  {
    enable: true,
    label: 'Permintaan Kajian Teknis',
    urlPath: technicalStudyReview.TECHNICAL_REVIEW_REQUEST_PAGE,
  },
  {
    enable: true,
    label: 'Draft Memo',
    urlPath: technicalStudyReview.DRAFT_MEMO_PAGE,
  },
  {
    enable: true,
    label: 'View All Documents',
    urlPath: technicalStudyReview.VIEW_ALL_DOCUMENT_PAGE,
  },
  {
    enable: true,
    label: 'Validasi',
    urlPath: technicalStudyReview.VALIDATION_PAGE,
  },
];
