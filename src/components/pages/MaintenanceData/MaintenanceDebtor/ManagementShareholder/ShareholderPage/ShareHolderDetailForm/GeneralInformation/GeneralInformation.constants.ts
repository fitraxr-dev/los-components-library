import * as yup from 'yup';


const optionalValidasi = ['INDIVIDUAL'];
export const shareHolderSchema = yup.object().shape({
  beneficialOwner: yup.string().nullable().optional(),
  dataInformationSource: yup.string().nullable().optional(),
  establishmentAct: yup.string().nullable().optional(),
  establishmentActFile: yup.mixed().nullable().notRequired(),
  exchangeRate: yup.object({
    currency: yup.string().nullable().optional(),
    value: yup.mixed().nullable().optional(),
  }).nullable().optional().default(undefined),
  idDocFile: yup.mixed().when('institutionType', {
    is: (val) => optionalValidasi?.includes(val),
    otherwise: (schema) => schema.nullable().optional(),
    then: (schema) => schema.nullable().optional(),
  }),
  idNo: yup.string().when('institutionType', {
    is: (val) => optionalValidasi?.includes(val),
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.notRequired(),
  }),
  idRefShareholder: yup.string().nullable().notRequired(),
  idType: yup.string().when('institutionType', {
    is: (val) => optionalValidasi?.includes(val),
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.notRequired(),
  }),
  identityExpiry: yup.string().nullable().optional(),
  institutionType: yup.string().nullable().optional(),
  lastChangeAct: yup.string().nullable().optional(),
  lastChangeActFile: yup.mixed().nullable().optional(),
  lastModified: yup.string().nullable().optional(),
  level: yup.string().nullable().optional(),
  modifiedBy: yup.string().nullable().optional(),
  name: yup.string().nullable().optional()
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
      'capitalization-first-only-in-every-word',
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
  npwp: yup.string().nullable().optional(),
  npwpFile: yup.mixed().nullable().notRequired(),
  percentage: yup.number().transform((value, originalValue) => (originalValue === '' ? null : value)).nullable().notRequired().moreThan(0, 'Percentage harus lebih besar dari 0')
    .max(100, 'Percentage tidak boleh lebih dari 100').typeError('percentage harus berupa angka').test('is-positive', 'Harus lebih besar dari 0', (value) => {
      if (value === null || value === undefined) return true;
      return value > 0;}),
  plafondIdr: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).notRequired(),
  prefix: yup.string().when('institutionType', {
    is: (val) => optionalValidasi?.includes(val),
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.notRequired(),
  }),
  stockSheet: yup.number().transform((value, originalValue) => (originalValue === '' ? null : value)).nullable().notRequired().min(1, 'Lembar Saham harus lebih besar dari 0').typeError('Lembar Saham harus berupa angka'),
  suffix: yup.string().when('institutionType', {
    is: (val) => optionalValidasi?.includes(val),
    otherwise: (schema) => schema.nullable().notRequired(),
    then: (schema) => schema.notRequired(),
  }),
  valuePersheet: yup.object({
    currency: yup.string().notRequired(),
    value: yup.number().transform((value, originalValue) => (originalValue === '' ? null : value)).nullable().notRequired().min(1, 'Nilai per Lembar harus lebih besar dari 0').typeError('Nilai per Lembar harus berupa angka'),
  }),

});
