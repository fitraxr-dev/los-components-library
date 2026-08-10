export const formData: MasintonForm = {
  document: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentCategory: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentGroup: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentName: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentType: {
    error: false,
    errorMessage: '',
    value: '',
  },
  noDraft: {
    error: false,
    errorMessage: '',
    value: '',
  },
  signedDate: {
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
  documentCategory: [
    {
      errorMessage: 'Kategori Dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentGroup: [
    {
      errorMessage: 'Group Dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentType: [
    {
      errorMessage: 'Jenis Dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  signedDate: [
    {
      errorMessage: 'Tanggal Tanda Tangan tidak boleh kosong',
      rule: /\S/,
    },
  ],
};
