/* eslint-disable sort-keys */
/* eslint-disable sort-keys-fix/sort-keys-fix */

export const formData: MasintonForm = {
  userId: {
    error: false,
    errorMessage: '',
    value: null,
  },
  fullName: {
    error: false,
    errorMessage: '',
    value: '',
  },
  email: {
    error: false,
    errorMessage: '',
    value: '',
  },
  password: {
    error: false,
    errorMessage: '',
    value: '',
  },
  nik: {
    error: false,
    errorMessage: '',
    value: '',
  },
  roleCode: {
    error: false,
    errorMessage: '',
    value: '',
  },
  divisionCode: {
    error: false,
    errorMessage: '',
    value: [],
  },
  reportTo: {
    error: false,
    errorMessage: '',
    value: '',
  },
  privyId: {
    error: false,
    errorMessage: '',
    value: '',
  },
  status: {
    error: false,
    errorMessage: '',
    value: '',
  },
  position: {
    error: false,
    errorMessage: '',
    value: [],
  },
  lastLogin: {
    error: false,
    errorMessage: '',
    value: '',
  },
  bucketProcessId: {
    error: false,
    errorMessage: '',
    value: null,
  },
};

export const validation: MasintonValidation = {
  fullName: [
    {
      errorMessage: 'Nama tidak boleh kosong',
      rule: /\S/,
    },
  ],
};
