import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DPOP_DIVISION,
  DEPI_DIVISION,
  DK_DIVISION,
  DH_DIVISION,
  DELST_DIVISION,
  DKHI_DIVISION,
  DPPIK_DIVISION,
} from '@/configs/constants';


export const BusinessTATBarKeys = [
  'Pipeline',
  'MIP Creation',
  'Request APU PPT / Pengkinian Data',
  'Request Credit Checking',
  'Request Kajian Teknis',
  'Site Visit',
  'Request LPA',
  'MIP',
  'MIP Review',
  'MUP',
  'Risalah Rapat',
  'SPFP',
  'SPFP Final',
  'Pengajuan Perikatan',
  'LPS BAST',
  'LPS Core',
];

export const DpopTATBarKeys = [
  'Credit Checking',
  'APU PPT',
  'LPA',
  'Compliance Check',
  'Loan Processing Summary',
];

export const DepiTATBarKeys = [
  'Rating Process & Review Kelayakan',
  'Kajian Pembiayaan Khusus',
  'Re-rating',
];

export const DkTATBarKeys = [
  'High Risk',
  'Review Kepatuhan Syariah',
];

export const DhTATBarKeys = [
  'Review Legal & Hukum',
  'Legal Signing',
];

export const DelstEsddTATBarKeys = [
  'Review ESDD',
];

export const DelstTeknisTATBarKeys = [
  'Kajian Teknis',
];

export const DkhiTATBarKeys = [
  'Virtual Account',
];

export const DppikTATBarKeys = [
  'MIR',
  'MIR Review',
  'MUR',
  'Risalah Rapat',
  'SPFP',
  'Pengajuan Perikatan',
  'Loan Processing Summary - BAST',
  'Loan Processing Summary - Core',
];

export const MakerTATBarKeys = BusinessTATBarKeys;

export const DivisionTATBarKeysMap: Record<string, string[]> = {
  [BUSINESS_DIVISION]: BusinessTATBarKeys,
  [DELST_DIVISION]: DelstEsddTATBarKeys,
  [DEPI_DIVISION]: DepiTATBarKeys,
  [DH_DIVISION]: DhTATBarKeys,
  [DKHI_DIVISION]: DkhiTATBarKeys,
  [DK_DIVISION]: DkTATBarKeys,
  [DPB_DIVISION]: BusinessTATBarKeys,
  [DPOP_DIVISION]: DpopTATBarKeys,
  [DPPIK_DIVISION]: DppikTATBarKeys,
  [DPPU_1_DIVISION]: BusinessTATBarKeys,
  [DPPU_3_DIVISION]: BusinessTATBarKeys,
  [DUS_DIVISION]: BusinessTATBarKeys,
  [SECOND_FINANCING_DIVISION]: BusinessTATBarKeys,
};

export const TATBarLabels: Record<string, string> = {
  'APU PPT': 'APU PPT/Pengkinian Data',
  'Annual Review': 'Annual Review',
  'Compliance Check': 'Compliance Check',
  'Credit Checking': 'Credit Checking',
  'High Risk': 'High Risk',
  'Kajian Pembiayaan Khusus': 'Kajian Pembiayaan Khusus',
  'Kajian Teknis': 'Kajian Teknis',
  'LPA': 'LPA',
  'LPS BAST': 'LPS BAST',
  'LPS Core': 'LPS Core',
  'Legal Signing': 'Legal Signing',
  'Loan Processing Summary': 'Loan Processing Summary',
  'Loan Processing Summary - BAST': 'Loan Processing Summary - BAST',
  'Loan Processing Summary - Core': 'Loan Processing Summary - Core',
  'MIP': 'MIP',
  'MIP Creation': 'MIP',
  'MIP Review': 'MIP Review',
  'MIR': 'MIR',
  'MIR Review': 'MIR Review',
  'MUP': 'MUP',
  'MUR': 'MUR',
  'Pengajuan Perikatan': 'Pengajuan Perikatan',
  'Perikatan Pembiayaan': 'Perikatan Pembiayaan',
  'Pipeline': 'Pipeline',
  'Rating Process & Review Kelayakan': 'Rating Process & Review Kelayakan',
  'Re-rating': 'Re-rating',
  'Request APU PPT / Pengkinian Data': 'Request APU PPT / Pengkinian Data',
  'Request Credit Checking': 'Request Credit Checking',
  'Request Kajian Teknis': 'Request Kajian Teknis',
  'Request LPA': 'Request LPA',
  'Review ESDD': 'Review ESDD',
  'Review Kepatuhan Syariah': 'Review Kepatuhan Syariah',
  'Review Legal & Hukum': 'Review Legal & Hukum',
  'Risalah Rapat': 'Risalah Rapat',
  'SPFP': 'SPFP',
  'SPFP Final': 'SPFP Final',
  'Site Visit': 'Site Visit',
  'Virtual Account': 'Virtual Account',
};
