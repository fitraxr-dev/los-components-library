import { highRisk } from '@/configs/constants/pathname';


export const DEFAULT_STEPS = [
  {
    enable: true,
    label: 'Informasi Customer',
    urlPath: highRisk.DEBTOR_INFORMATION_PAGE,
  },
  {
    enable: true,
    label: 'Objective',
    urlPath: highRisk.OBJECTIVE_PAGE,
  },
  {
    enable: true,
    label: 'Legal Foundation',
    urlPath: highRisk.LEGAL_FOUDNATION_PAGE,
  },
  {
    enable: true,
    label: 'Assumptions and Qualifications',
    urlPath: highRisk.ASSUMPTIONS_AND_QUALIFICATIONS_PAGE,
  },
  {
    enable: true,
    label: 'Compliance Analysis',
    urlPath: highRisk.COMPLIANCE_ANALYSIS_PAGE,
  },
  {
    enable: true,
    label: 'Summary',
    urlPath: highRisk.SUMMARY_PAGE,
  },
  {
    enable: true,
    label: 'View All Documents',
    urlPath: highRisk.VIEW_ALL_DOCUMENT_PAGE,
  },
  {
    enable: true,
    label: 'Validation',
    urlPath: highRisk.VALIDATION_PAGE,
  },
];
