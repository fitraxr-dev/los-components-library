export const formData: MasintonForm = {
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
  financingSegment: {
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
  remark: {
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
  financingSegment: [
    {
      errorMessage: 'Segment Pembiayaan tidak boleh kosong',
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
