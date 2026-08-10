export const formData: MasintonForm = {
  document: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentName: {
    error: false,
    errorMessage: '',
    value: '',
  },
  noDraft: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const validation: MasintonValidation = {
  document: [
    {
      errorMessage: 'Dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
};
