export const LIST_DATA = {
  contents: [
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'PIPE-4066',
      createdDate: '21 Maret 2001',
      debtorName: 'Arya Wiguna',
      dueDate: '11 Januari 2024',
      groupName: 'Angkasa Pura',
      id: '0',
      npwp: '129991772600001',
      staffName: 'Sulis',
      status: 'WAITING_APPROVAL_TL',
    },
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'PIPE-4067',
      createdDate: '21 Maret 2001',
      debtorName: 'Arya Wiguna',
      dueDate: '11 Januari 2024',
      groupName: 'Angkasa Pura',
      id: '1',
      npwp: '129991772600001',
      staffName: 'Sulis',
      status: 'REJECTED',
    },
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'PIPE-4068',
      createdDate: '21 Maret 2001',
      debtorName: 'Arya Wiguna',
      dueDate: '11 Januari 2024',
      groupName: 'Angkasa Pura',
      id: '2',
      npwp: '129991772600001',
      staffName: 'Sulis',
      status: 'APPROVED_PIPELINE',
    }
  ],
  page: {
    totalPage: 1,
  },
};

export const FILTER_OPTIONS = [
  {
    color: 'disabled',
    label: 'Request',
    value: 'request',
  },
  {
    color: 'primary',
    label: 'Return to staff',
    value: 'Return to staff',
  },
  {
    color: 'primary',
    label: 'Return to RM',
    value: 'Return to RM',
  },
  {
    color: 'primary',
    label: 'Return to TL',
    value: 'Return to TL',
  },
  {
    color: 'primary',
    label: 'Approval KADIV',
    value: 'Approval KADIV',
  },
  {
    color: 'primary',
    label: 'Ask for Info',
    value: 'Ask for Info',
  },
  {
    color: 'primary',
    label: 'Completed',
    value: 'Completed',
  }
];

export const FILTER_GAM_OPTIONS = [
  {
    label: 'DP1 - Garneta R',
    value: 'DP1 - Garneta R',
  },
  {
    label: 'DP2 - Isnaputra',
    value: 'DP2 - Isnaputra',
  },
  {
    label: 'DP1 - Arman P',
    value: 'DP1 - Arman P',
  },
  {
    label: 'DP2 -Arief Subekti',
    value: 'DP2 -Arief Subekti',
  },
];

export const FILTER_DIVISION_OPTIONS = [
  {
    label: 'DP1',
    value: 'DP1',
  },
  {
    label: 'DP2',
    value: 'DP2',
  },
  {
    label: 'DPB',
    value: 'DPB',
  },
  {
    label: 'DUS',
    value: 'DUS',
  },
  {
    label: 'DPPU 1',
    value: 'DPPU 1',
  }
];

export const LIST_DEBTOR_DATA = [
  {
    cif: '042023/000125',
    debtorId: 1,
    debtorName: 'Sulis',
    divisionName: 'DP2',
    gamName: 'DP2 -Arief Subekti',
    groupName: 'Angkasa Pura',
    npwp: '1291772600001',
    proposalId: '9',
    staffName: 'Ahmad',
  },
  {
    cif: '042023/000125',
    debtorId: 2,
    debtorName: 'Sulis',
    divisionName: 'DP2',
    gamName: 'DP2 -Arief Subekti',
    groupName: 'Angkasa Pura',
    npwp: '1291772600001',
    proposalId: '9',
    staffName: 'Ahmad',
  },
  {
    cif: '042023/000125',
    debtorId: 3,
    debtorName: 'Sulis',
    divisionName: 'DP2',
    gamName: 'DP2 -Arief Subekti',
    groupName: 'Angkasa Pura',
    npwp: '1291772600001',
    proposalId: '9',
    staffName: 'Ahmad',
  },
];

export const SORT_OPTIONS = [
  { label: 'ID', value: 'id' },
  {
    label: 'Divisi',
    value: 'Divisi',
  },
];

export const DETAIL_DEBTOR = {
  afiliate: 'yes',
  contactPerson: '0812998172',
  debtorName: 'Trial Mbah',
  groupName: 'Reimu Ichigo 117',
  position: 'Kadiv',
  relation: '2019',
  sectorBusiness: 'Pembangunan',
  year: '2017',
};

export const FINANCE_PERFORMANCE = {
  asset: 'IDR 200 Miliar',
  ebitda: 'IDR 10 Miliar',
  equity: 'IDR 50 Miliar',
  income: 'IDR 10 Miliar',
  liability: 'IDR 10 Miliar',
  omset: 'IDR 2 Miliar',
};

export const GROUP_LIST = [
  1, 2, 1, 3
];

export const EXPOSURE_GROUP = [
  {
    founded: '2017',
    groupName: 'Reimu Ichigo 117',
    outstanding: 'IDR 10 Miliar',
    plafond: 'IDR 10 Miliar',
    propose: 'IDR 10 Miliar',
  },
  {
    founded: '2017',
    groupName: 'Reimu Ichigo 117',
    outstanding: 'IDR 10 Miliar',
    plafond: 'IDR 10 Miliar',
    propose: 'IDR 10 Miliar',
  },
  {
    founded: '2017',
    groupName: 'Reimu Ichigo 117',
    outstanding: 'IDR 10 Miliar',
    plafond: 'IDR 10 Miliar',
    propose: 'IDR 10 Miliar',
  },
];

export const DROPDOWN_GROUP = [
  {
    label: 'Angkasa',
    value: 1,
  },
  {
    label: 'Bangkit',
    value: 2,
  },
  {
    label: 'Trisakti',
    value: 3,
  },
  {
    label: 'Jaya Maju',
    value: 4,
  },
];

export const ACTIVE_IN_OPTIONS = [
  {
    label: 'MIP',
    value: 'MIP',
  },
  {
    label: 'MUP',
    value: 'MUP',
  },
  {
    label: 'Risalah Rapat',
    value: 'Risalah Rapat',
  },
  {
    label: 'Pipeline',
    value: 'Pipeline',
  },
  {
    label: 'MIP Review',
    value: 'MIP Review',
  },
];

export const LIST_DRD_RATING_DOC = [
  {
    division: 'Divisi Pembiayaan 1',
    documentDate: '25 Mei 2024',
    documentGroup: '31- Supporting Document - DEPI',
    documentName: 'Rating Upload File Rating & History',
    documentNumber: 'SV-110/SMI/DPOP',
    documentType: '07 - Rating Upload File Rating & History',
    index: '1',
    status: 'Status 1',
    uploadedBy: 'Bung Towel',
    uploadedDate: '30 Mei 2024',
  }
];
