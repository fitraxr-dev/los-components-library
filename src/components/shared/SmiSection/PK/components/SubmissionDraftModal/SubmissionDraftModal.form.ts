export const formData = {
  agreementMapping: {
    error: false,
    errorMessage: '',
    value: '',
  },
  agreementType: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const formValidation: MasintonValidation = {
  agreementMapping: [
    {
      errorMessage: 'Lengkapi pilihan mapping PK/Adendum',
      rule: /\S/,
    },
  ],
  agreementType: [
    {
      errorMessage: 'Lengkapi pilihan mapping tipe perjanjian',
      rule: /\S/,
    }
  ],
};
