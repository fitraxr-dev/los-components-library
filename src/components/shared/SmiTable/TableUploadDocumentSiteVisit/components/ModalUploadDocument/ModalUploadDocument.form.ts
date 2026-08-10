export const formData: MasintonForm = {
  document: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentCategory: {
    error: false,
    errorMessage: '',
    value: 'FINANCING_DOCUMENT',
  },
  documentDate: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentGroup: {
    error: false,
    errorMessage: '',
    value: 'FINANCING_DOCUMENTS_REPORTS',
  },
  documentName: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentNumber: {
    error: false,
    errorMessage: '',
    value: '',
  },
  documentType: {
    error: false,
    errorMessage: '',
    value: 'SITE_VISIT_REPORT',
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
      errorMessage: 'Kategori dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentDate: [
    {
      errorMessage: 'Tanggal dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentGroup: [
    {
      errorMessage: 'Grup dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentNumber: [
    {
      errorMessage: 'Nomor dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentType: [
    {
      errorMessage: 'Jenis dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
};
