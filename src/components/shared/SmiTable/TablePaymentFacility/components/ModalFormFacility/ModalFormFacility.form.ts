export const formData: MasintonForm = {
  childFacilityAlias: {
    error: false,
    errorMessage: '',
    value: '',
  },
  currencyOrderValue: {
    error: false,
    errorMessage: '',
    value: 'IDR',
  },
  exchangeRate: {
    error: false,
    errorMessage: '',
    value: '',
  },
  financingObjectives: {
    error: false,
    errorMessage: '',
    value: '',
  },
  financingSegment: {
    error: false,
    errorMessage: '',
    value: '',
  },
  floatingReference: {
    error: false,
    errorMessage: '',
    value: '',
  },
  governmentMandate: {
    error: false,
    errorMessage: '',
    value: '',
  },
  gracePeriod: {
    error: false,
    errorMessage: '',
    value: '',
  },
  mappingFinancingSegment: {
    error: false,
    errorMessage: '',
    value: '',
  },
  mappingOrderType: {
    error: false,
    errorMessage: '',
    value: 'NEW',
  },
  mappingProduct: {
    error: false,
    errorMessage: '',
    value: '',
  },
  orderType: {
    error: false,
    errorMessage: '',
    value: 'NEW',
  },
  orderValue: {
    error: false,
    errorMessage: '',
    value: '',
  },
  orderValueAfterExchangeRate: {
    error: false,
    errorMessage: '',
    value: '',
  },
  product: {
    error: false,
    errorMessage: '',
    value: '',
  },
  projectId: {
    error: false,
    errorMessage: '',
    value: '',
  },
  rateType: {
    error: false,
    errorMessage: '',
    value: '',
  },
  rates: {
    error: false,
    errorMessage: '',
    value: '',
  },
  remark: {
    error: false,
    errorMessage: '',
    value: '',
  },
  timePeriod: {
    error: false,
    errorMessage: '',
    value: '',
  },
  withdrawalPeriod: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const validation: MasintonValidation = {
  childFacilityAlias: [
    {
      errorMessage: 'Alias Fasilitas Anak hanya bisa input angka dan huruf',
      rule: /^[a-zA-Z0-9 ]*$/,
    },
  ],
  exchangeRate: [
    {
      errorMessage: 'Exchange Rate tidak boleh kosong',
      rule: /\S/,
    },
  ],
  financingSegment: [
    {
      errorMessage: 'Segment Pembiayaan tidak boleh kosong',
      rule: /\S/,
    },
  ],
  floatingReference: [
    {
      errorMessage: 'Referensi Floating tidak boleh kosong',
      rule: /\S/,
    },
  ],
  mappingFinancingSegment: [
    {
      errorMessage: 'Produk tidak boleh kosong',
      rule: /\S/,
    },
  ],
  mappingOrderType: [
    {
      errorMessage: 'Mapping order type tidak boleh kosong',
      rule: /\S/,
    },
  ],
  mappingProduct: [
    {
      errorMessage: 'Produk tidak boleh kosong',
      rule: /\S/,
    },
  ],
  orderType: [
    {
      errorMessage: 'Order Type tidak boleh kosong',
      rule: /\S/,
    },
  ],
  orderValue: [
    {
      errorMessage: 'Nominal Pengajuan tidak boleh kosong',
      rule: /\S/,
    },
  ],
  product: [
    {
      errorMessage: 'Produk tidak boleh kosong',
      rule: /\S/,
    },
  ],
};

export const AlIjarahFormDataFields = [
  'currencyExchangeRate',
  'currencyOrderValue',
  'currencyOrderValueinRp',
  'currencyRentValue',
  'currencyRentValueinRp',
  'currencyUjrohKurs',
  'exchangeRate',
  'financingTimePeriod',
  'governmentMandate',
  'ijarahObject',
  'orderValue',
  'orderValueinRp',
  'remark',
  'rentPaymentPeriod',
  'rentReviewPeriod',
  'rentReviewType',
  'rentValue',
  'rentValueinRp',
  'returnExpectation',
  'tenant',
  'ujrohKurs',
];
export const AlMusyarakahFormDataFields = [
  'SyirkahNasabahValue',
  'financing_period',
  'fundUtilizationPurpose',
  'governmentMandate',
  'otherReviewNisbahResult',
  'partner',
  'profitSharingExpectations',
  'profitSharingPartner',
  'profitSharingSMI',
  'profitSharingType',
  'remark',
  'reviewNisbahResult',
  'syirkahNasabahCurrency',
  'syirkahNasabahIdr',
  'syirkahNasabahRate',
  'syirkahSmiCurrency',
  'syirkahSmiIdr',
  'syirkahSmiRate',
  'syirkahSmiValue',
  'totalSyirkahCurrency',
  'totalSyirkahValue'
];
