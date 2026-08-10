export const MOCK_REQUEST_TYPE_OPTIONS = [
  { label: 'Sangat Segera', value: 'IMMEDIATE' },
  { label: 'Segera', value: 'QUICK' },
  { label: 'Biasa', value: 'NORMAL' },
];

export const MOCK_EXPOSURE_DEBTOR = [
  {
    currency: 'IDR',
    label: 'Plafond Existing',
    value: '50,000,000,000',
    viewOnly: true,
  },
  {
    currency: 'USD',
    label: 'Plafond Existing',
    value: '0',
    viewOnly: true,
  },
  {
    currency: 'IDR',
    label: 'O/S',
    value: '35,000,000,000',
    viewOnly: true,
  },
  {
    currency: 'USD',
    label: 'O/S',
    value: '0',
    viewOnly: true,
  },
  {
    currency: 'IDR',
    label: 'Propose',
    value: '60,000,000,000',
    viewOnly: true,
  },
  {
    currency: 'USD',
    label: 'Propose',
    value: '0',
    viewOnly: true,
  },
];

export const MOCK_EXPOSURE_GROUP = [
  {
    groupName: 'SMI Group',
    idr: {
      outstanding: '120,000,000,000',
      plafond: '150,000,000,000',
      propose: '180,000,000,000',
    },
    usd: {
      outstanding: '0',
      plafond: '0',
      propose: '0',
    },
    yearFounded: '2009',
  },
];
