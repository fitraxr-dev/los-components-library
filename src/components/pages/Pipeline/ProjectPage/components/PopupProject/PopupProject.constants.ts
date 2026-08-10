import * as yup from 'yup';


export const INITIAL_VALUES = {
  city: '',
  district: '',
  exchangeRate: {
    currency: '',
    value: '0',
  },
  projectCode: '',
  projectName: '',
  province: '',
  sector: '',
  value: {
    currency: '',
    value: '0',
  },
  valueInIdr: {
    currency: '',
    value: '0',
  },
};

export const POPUP_PROJECT_SCHEMA = yup.object({
  city: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Kota-Kabupaten) is required'),
          module: yup.string().required('Alamat (Kota-Kabupaten) is required'),
          value: yup.string().required('Alamat (Kota-Kabupaten) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  district: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().nullable(),
          module: yup.string().nullable(),
          value: yup.string().nullable(),
        }).nullable().notRequired();
      default:
        return yup.string().nullable();
    }
  }),
  exchangeRate: yup.object({ currency: yup.string(), value: yup.string() })
    .when(
      'value', {
        is: (value) => value?.currency === 'USD',
        otherwise: (schema) => schema.shape({
          currency: yup.string().nullable().notRequired(),
          value: yup.string().nullable().notRequired(),
        }),
        then: (schema) => schema.shape({
          currency: yup.string().required('Currency is required'),
          value: yup.string()
            .test('greater-than-zero', 'Must be greater than 0', (value) => {
              const parsedValue = parseFloat(value?.replace(/,/g, '')) ?? 0;
              return parsedValue > 0;
            })
            .required('Value is required'),
        }),
      }),
  projectCode: yup.string(),
  projectName: yup.string().required('Required'),
  province: yup.lazy((value) => {
    switch (typeof value) {
      case 'object':
        return yup.object().shape({
          label: yup.string().required('Alamat (Provinsi) is required'),
          module: yup.string().required('Alamat (Provinsi) is required'),
          value: yup.string().required('Alamat (Provinsi) is required'),
        });
      default:
        return yup.string().nullable();
    }
  }),
  sector: yup.string().required('Required'),
  value: yup.object({
    currency: yup.string().required('Currency is required'),
    value: yup.string()
      .test('greater-than-zero', 'Must be greater than 0', (value) => {
        const parsedValue = parseFloat(value?.replace(/,/g, '')) ?? 0;
        return parsedValue > 0;
      })
      .required('Value is required'),
  }).required(),
  valueInIdr: yup.object({
    currency: yup.string(),
    value: yup.string(),
  }).when('value', {
    is: (value) => value?.currency === 'USD',
    otherwise: (schema) => schema.shape({
      currency: yup.string().nullable().notRequired(),
      value: yup.string().nullable().notRequired(),
    }),
    then: (schema) => schema.shape({
      currency: yup.string(),
      value: yup.string(),
    }),
  }),
});

export const PROVINCE = 'province';
export const SECTOR = 'sector';
export const CURRENCY = 'currency';
