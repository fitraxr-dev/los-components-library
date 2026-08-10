export const IDENTIFYRISKS_INITIAL_VALUES: MasintonForm = {
  otherRisk: {
    error: false,
    errorMessage: '',
    value: '',
  },
  valueTypeRisks: {
    error: false,
    errorMessage: '',
    value: '',
  },
};


export const validation: MasintonValidation = {
  otherRisk: [
    {
      errorMessage: 'Other Resiko Tidak  boleh kosong',
      rule: /\S/,
    }
  ],
  valueTypeRisks: [
    {
      errorMessage: 'Jenis Resiko Tidak  boleh kosong',
      rule: /\S/,
    }
  ],
};
