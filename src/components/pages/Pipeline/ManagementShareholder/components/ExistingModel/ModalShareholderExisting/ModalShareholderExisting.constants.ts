import * as yup from 'yup';


export const validationSchema = yup.object({
  exchangeRate: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).when('valuePerShare.currency', ([currency]: [string]) => {
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

  identityDocFile: yup.object({
    extension: yup.string().notRequired(),
    file: yup.string().nullable(),
    name: yup.string().notRequired(),
    url: yup.string().notRequired(),
  }).nullable().notRequired(),
  identityDocNumber: yup.string().when('identityTypeKey', {
    is: '04',
    otherwise: (schema) => schema
      .matches(/^[a-zA-Z0-9]*$/, 'ID Number tidak boleh mengandung simbol')
      .notRequired(),
    then: (schema) => schema
      .matches(/^[0-9]{16}$/, 'NIK harus 16 digit angka') }),
  identityTypeKey: yup.string().notRequired(),
  jobPosition: yup.string().notRequired(),
  name: yup.string()
    .required('Nama tidak boleh kosong')
    .test(
      'no-institution-words',
      'Nama diketik tanpa tipe institusi (PT/PEMKOT/PEMKAB/DLL)',
      (value) => {
        if (!value) return true;
        const banned = ['PT', 'PEMKOT', 'PEMKAB', 'PEMPROV', 'BUMN', 'BUMD', 'CV', 'KEMEN', 'PEMDES', 'BPD'];
        const upper = value.toUpperCase();
        return !banned.some((word) => new RegExp(`(^|\\s)${word}(\\s|$)`, 'i').test(upper));
      },
    )
    .test(
      'capitalization-first-only',
      'Huruf kapital hanya di awal nama setiap kata',
      (value) => {
        if (!value) return true;
        const words = value.split(' ');
        return words.every((word) => {
          const trimmed = word.trim();
          const rest = trimmed.slice(1);
          return !/[A-Z]/.test(rest);
        });
      },
    ),
  nominal: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).notRequired(),
  npwp: yup.string().nullable().notRequired(),
  npwpFile: yup.object({
    extension: yup.string().notRequired(),
    file: yup.string().nullable(),
    name: yup.string().notRequired(),
    url: yup.string().notRequired(),
  }).nullable().notRequired(),
  percentage: yup.string().notRequired(),
  shares: yup.string().matches(/^[a-zA-Z0-9]*$/, 'Lembar saham hanya boleh angka').notRequired(),
  type: yup.string().required('Tipe tidak boleh kosong'),
  valuePerShare: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).notRequired(),
});
