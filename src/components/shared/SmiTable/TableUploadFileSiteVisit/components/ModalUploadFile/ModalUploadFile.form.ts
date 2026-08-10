export const formData: MasintonForm = {
  file: {
    error: false,
    errorMessage: '',
    value: '',
  },
  fileName: {
    error: false,
    errorMessage: '',
    value: '',
  },
  typeFile: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const validation: MasintonValidation = {
  file: [
    {
      errorMessage: 'File tidak boleh kosong',
      rule: /\S/,
    },
  ],
};
