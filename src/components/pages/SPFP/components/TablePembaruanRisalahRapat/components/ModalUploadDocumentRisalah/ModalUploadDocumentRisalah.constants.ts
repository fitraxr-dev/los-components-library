export const modal = {
  MODAL_UPLOAD_DOCUMENT_RISALAH: 'MODAL_UPLOAD_DOCUMENT_RISALAH',
};

export const formData = {
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
  documentNumber: {
    error: false,
    errorMessage: '',
    value: '',
  },
  uploadDate: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const validation = {
  document: [
    {
      errorMessage: 'Upload Dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentName: [
    {
      errorMessage: 'Nama Dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
  documentNumber: [
    {
      errorMessage: 'Nomor Dokumen tidak boleh kosong',
      rule: /\S/,
    },
  ],
};
