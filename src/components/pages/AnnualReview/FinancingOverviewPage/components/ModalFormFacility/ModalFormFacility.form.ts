export const formData: MasintonForm = {

  currencyOrderValue: {
    error: false,
    errorMessage: '',
    value: 'IDR',
  },
  currencyOutstanding: {
    error: false,
    errorMessage: '',
    value: 'IDR',
  },
  debtorName: {
    error: false,
    errorMessage: '',
    value: '',
  },
  exchangeRate: {
    error: false,
    errorMessage: '',
    value: '1',
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
    value: '',
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
  outstanding: {
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
  exchangeRate: [
    {
      errorMessage: 'Exchange Rate tidak boleh kosong',
      rule: /\S/,
    },
  ],
  financingObjectives: [
    {
      errorMessage: 'Tujuan Pembiayaan tidak boleh kosong',
      rule: /\S/,
    },
  ],
  financingSegment: [
    {
      errorMessage: 'Segment Pembiayaan tidak boleh kosong',
      rule: /\S/,
    },
  ],
  orderValue: [
    {
      errorMessage: 'Nominal Pembiayaan tidak boleh kosong',
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
