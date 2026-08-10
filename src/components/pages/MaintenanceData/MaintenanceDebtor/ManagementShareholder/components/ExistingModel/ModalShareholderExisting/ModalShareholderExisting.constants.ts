import * as yup from 'yup';


export const validationSchema = yup.object({
  exchangeRate: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).when('valuePerShares.currency', ([currency]: [string]) => {
    if (currency === 'USD') {
      return yup.object({
        currency: yup.string().required('Mata uang tidak boleh kosong'),
        value: yup.string().required('Nilai Tukar tidak boleh kosong'),
      }).required('Nilai Tukar tidak boleh kosong');
    }
    return yup.object({
      currency: yup.string().notRequired(),
      value: yup.string().notRequired(),
    });
  }),
  jobPosition: yup.string().notRequired(),
  name: yup.string().required('Nama tidak boleh kosong'),
  nik: yup.string().matches(/^[a-zA-Z0-9]*$/, 'NIK tidak boleh mengandung simbol').notRequired(),
  nikFile: yup.object({
    extension: yup.string().notRequired(),
    file: yup.string().nullable(),
    name: yup.string().notRequired(),
    url: yup.string().notRequired(),
  }).notRequired(),
  nominal: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).notRequired(),
  npwp: yup.string().test(
    'npwp', 'NPWP tidak boleh kurang dari 1 karakter', (value) => value?.length >= 1 || !value
  ).nullable(),
  npwpFile: yup.object({
    extension: yup.string().notRequired(),
    file: yup.string().nullable(),
    name: yup.string().notRequired(),
    url: yup.string().notRequired(),
  }).notRequired(),
  percentage: yup.string().notRequired(),
  shares: yup.string().matches(/^[a-zA-Z0-9]*$/, 'Lembar saham hanya boleh angka').notRequired(),
  type: yup.string().required('Tipe tidak boleh kosong'),
  valuePerShares: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).notRequired(),
});
