export const formData: MasintonForm = {
  assumptionsQualifications: {
    error: false,
    errorMessage: '',
    value: '',
  },
  commercialDescription: {
    error: false,
    errorMessage: '',
    value: '',
  },
  description: {
    error: false,
    errorMessage: '',
    value: '',
  },
  descriptionInformation: {
    error: false,
    errorMessage: '',
    value: '',
  },
  effectiveConditions: {
    error: false,
    errorMessage: '',
    value: '',
  },
  effectiveDate: {
    error: false,
    errorMessage: '',
    value: '',
  },
  legalProcessStatusRequirement: {
    error: false,
    errorMessage: '',
    value: '',
  },
  nonCommercialDescription: {
    error: false,
    errorMessage: '',
    value: '',
  },
  otherCommercialDescription: {
    error: false,
    errorMessage: '',
    value: '',
  },
  otherLegalProcessStatusRequirement: {
    error: false,
    errorMessage: '',
    value: '',
  },
  pkDate: {
    error: false,
    errorMessage: '',
    value: '',
  },
  pkName: {
    error: false,
    errorMessage: '',
    value: '',
  },
  pkNumber: {
    error: false,
    errorMessage: '',
    value: '',
  },
  signingConditions: {
    error: false,
    errorMessage: '',
    value: '',
  },
};

export const validation: MasintonValidation = {
  commercialDescription: [
    {
      errorMessage: 'Keterangan komersial tidak boleh kosong',
      rule: /\S/,
    }
  ],
  description: [
    {
      errorMessage: 'Deskripsi tidak boleh kosong',
      rule: /\S/,
    }
  ],
  descriptionInformation: [
    {
      errorMessage: 'Keterangan deskripsi tidak boleh kosong',
      rule: /\S/,
    }
  ],
  effectiveConditions: [
    {
      errorMessage: 'Syarat efektif tidak boleh kosong',
      rule: /\S/,
    }
  ],
  effectiveDate: [
    {
      errorMessage: 'Tanggal efektif tidak boleh kosong',
      rule: /\S/,
    }
  ],
  legalProcessStatusRequirement: [
    {
      errorMessage: 'Status Proses Legal tidak boleh kosong',
      rule: /\S/,
    }
  ],
  nonCommercialDescription: [
    {
      errorMessage: 'Keterangan non-komersial tidak boleh kosong',
      rule: /\S/,
    }
  ],
  otherLegalProcessStatusRequirement: [
    {
      errorMessage: 'Other Legal Proses Tidak boleh kosong',
      rule: /\S/,
    }
  ],
  pkDate: [
    {
      errorMessage: 'Tanggal PK/Adendum tidak boleh kosong',
      rule: /\S/,
    }
  ],
  pkName: [
    {
      errorMessage: 'Nama PK tidak boleh kosong',
      rule: /\S/,
    }
  ],
  pkNumber: [
    {
      errorMessage: 'NO PK/Adendum tidak boleh kosong',
      rule: /\S/,
    }
  ],
  signingConditions: [
    {
      errorMessage: 'Syarat penandatanganan tidak boleh kosong',
      rule: /\S/,
    }
  ],
};
