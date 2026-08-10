export const formData = {
  category: {
    error: false,
    errorMessage: '',
    value: '',
  },
  categoryLabel: {
    error: false,
    errorMessage: '',
    value: '',
  },
  constrainingFactor: {
    error: false,
    errorMessage: '',
    value: '',
  },
  description: {
    error: false,
    errorMessage: '',
    value: '',
  },
  note: {
    error: false,
    errorMessage: '',
    value: '',
  },
  othersRatingType: {
    error: false,
    errorMessage: '',
    value: '',
  },
  rating: {
    error: false,
    errorMessage: '',
    value: '',
  },
  ratingLabel: {
    error: false,
    errorMessage: '',
    value: '',
  },
  ratingPeriod: {
    error: false,
    errorMessage: '',
    value: '',
  },
  ratingType: {
    error: false,
    errorMessage: '',
    value: '',
  },
  supportingFactor: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const validation: MasintonValidation = {
  othersRatingType: [
    {
      errorMessage: 'Rating Lainnya tidak boleh kosong',
      rule: /\S/,
    },
  ],
  rating: [
    {
      errorMessage: 'Rating tidak boleh kosong',
      rule: new RegExp(/^(?!-)(?!null)(?!undefined).+$/),
    },
  ],
  ratingLabel: [
    {
      errorMessage: 'Kategori Rating tidak boleh kosong',
      rule: /\S/,
    },
  ],
  ratingPeriod: [
    {
      errorMessage: 'Periode Rating tidak boleh kosong',
      rule: /\S/,
    },
  ],
  ratingType: [
    {
      errorMessage: 'Jenis Rating tidak boleh kosong',
      rule: new RegExp(/^(?!-)(?!null)(?!undefined).+$/),
    },
  ],
};
