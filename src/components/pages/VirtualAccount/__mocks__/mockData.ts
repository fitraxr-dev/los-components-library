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

export const VA_LIST_DATA = {
  contents: [
    {
      bank: 'BNI',
      currency: 'IDR',
      customerType: 'PEN | Pemda',
      id: '0',
      noVa: '00782233',
      status: 'Active',
      vaType: 'Fee', // Tambahkan id unik untuk key
    },
    {
      bank: 'Mandiri',
      currency: 'IDR',
      customerType: 'Swasta',
      id: '1',
      noVa: '00782234',
      status: 'Inactive',
      vaType: 'Non-Fee',
    },
    {
      bank: 'BNI',
      currency: 'USD',
      customerType: 'BUMN',
      id: '2',
      noVa: '00782235',
      status: 'Pending',
      vaType: 'Fee',
    },
    {
      bank: 'Mandiri',
      currency: 'IDR',
      customerType: 'Pemda',
      id: '3',
      noVa: '00782236',
      status: 'Active',
      vaType: 'Non-Fee',
    },
  ],
  page: {
    itemPerPage: 2,
    noPage: 1,
    totalData: 4,
    totalPage: 2 },
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
    status: 'REJECTED',
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
    status: 'APPROVED_PIPELINE',
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
    status: 'WAITING_APPROVAL_TL',
  },
];

export const SORT_OPTIONS = [
  {
    label: 'Customer ID',
    value: 'Customer ID',
  },
  {
    label: 'CIF',
    value: 'CIF',
  },
  {
    label: 'Nama Customer',
    value: 'Nama Customer',
  },
];

export const LIST_DATA_APPROVAL = {
  contents: [
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'UM-1234',
      cif: '202302501',
      createdDate: '2023-01-20',
      customerId: '202302501',
      customerName: 'Adhi Karya (Persero) Tbk. PT',
      gam: '[gam]',
      id: '0',
      pic: '[pic]',
      requestDate: '2023-01-21',
      status: 'VA Creation',
    },
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'UM-1235',
      cif: '202302601',
      createdDate: '2023-01-20',
      customerId: '202302601',
      customerName: 'Adhi Karya (Persero) Tbk. PT',
      gam: '[gam]',
      id: '1',
      pic: '[pic]',
      requestDate: '2023-01-21',
      status: 'Waiting Approval TL',
    },
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'UM-1236',
      cif: '202302701',
      createdDate: '2023-01-20',
      customerId: '202302701',
      customerName: 'Adhi Karya (Persero) Tbk. PT',
      gam: '[gam]',
      id: '2',
      pic: '[pic]',
      requestDate: '2023-01-21',
      status: 'Waiting VA Activation',
    },
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'UM-1237',
      cif: '202302801',
      createdDate: '2023-01-20',
      customerId: '202302801',
      customerName: 'Adhi Karya (Persero) Tbk. PT',
      gam: '[gam]',
      id: '3',
      pic: '[pic]',
      requestDate: '2023-01-21',
      status: 'Return to staff',
    },
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'UM-1238',
      cif: '202302901',
      createdDate: '2023-01-20',
      customerId: '202302901',
      customerName: 'Adhi Karya (Persero) Tbk. PT',
      gam: '[gam]',
      id: '4',
      pic: '[pic]',
      requestDate: '2023-01-21',
      status: 'VA Creation',
    },
    {
      aging: '1 Hari 4 Jam',
      bucketProcessId: 'UM-1239',
      cif: '202303001',
      createdDate: '2023-01-20',
      customerId: '202303001',
      customerName: 'Adhi Karya (Persero) Tbk. PT',
      gam: '[gam]',
      id: '5',
      pic: '[pic]',
      requestDate: '2023-01-21',
      status: 'DRAFT', // Status tambahan yang belum ada
    },
  ],
  page: {
    totalPage: 1,
  },
};
