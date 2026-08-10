export const formData: MasintonForm = {
  characteristic: {
    error: false,
    errorMessage: '',
    value: '',
  },
  currencyOrderValue: {
    error: false,
    errorMessage: '',
    value: 'IDR',
  },
  currencyOutstanding: {
    error: false,
    errorMessage: '',
    value: '',
  },
  debtorName: {
    error: false,
    errorMessage: '',
    value: '',
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
  portionPaymentPeriod: {
    error: false,
    errorMessage: '',
    value: '',
  },
  portionPurchasePeriod: {
    error: false,
    errorMessage: '',
    value: '',
  },
  product: {
    error: false,
    errorMessage: '',
    value: '',
  },
  profitSharingExpectations: {
    error: false,
    errorMessage: '',
    value: '',
  },
  projectId: {
    error: false,
    errorMessage: '',
    value: '',
  },
  providingFacilities: {
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
