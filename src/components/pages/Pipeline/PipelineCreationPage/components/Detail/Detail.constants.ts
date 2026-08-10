import * as yup from 'yup';

import type { FormDebtorFieldOptions } from '../FormDebtor/FormDebtor.type';


export const DISABLED_FIELDS: FormDebtorFieldOptions = {
  debtorName: true,
  gam: true,
  insitutionTypeId: true,
};

export const MANDATORY_FIELDS: FormDebtorFieldOptions = {
  analyst: true,
  debtorRating: true,
  debtorType: true,
  financingType: true,
  isGroup: true,
  isRelatedToSmi: true,
  typeProcess: true,
};

export const DISABLED_FIELDS_EXISTING: FormDebtorFieldOptions = {
  createdDate: true,
  debtorName: true,
  debtorRating: true,
  debtorType: true,
  gam: true,
  insitutionTypeId: true,
  isGroup: true,
  isRelatedToSmi: true,
  npwp: true,
};

export const MANDATORY_FIELDS_EXISTING: FormDebtorFieldOptions = {
  analyst: true,
  financingType: true,
  typeProcess: true,
};

export const VALIDATION_SCHEMA = yup.object().shape(
  {
    analyst: yup.object({ id: yup.string().required(), label: yup.string().required() }).test({
      name: 'empty-analyst',
      skipAbsent: true,
      test(value, ctx) {
        if (!value.id) {
          return ctx.createError({ message: 'Required' });
        }
        return true;
      },
    }),
    debtorType: yup.string().when(
      ['$isExistingDebtor', '$isPemda'], ([isExistingDebtor, isPemda], schema) => !isExistingDebtor && !isPemda ? schema.required('Tipe debtor harap di isi') : schema.nullable()
    ),
    financingType: yup.string().required('Tipe pembiayaan tidak boleh kosong'),
    group: yup.object({ id: yup.string(), label: yup.string() }).nullable(),
    isGroup: yup.boolean().when(
      ['$isExistingDebtor', '$isPemda'], ([isExistingDebtor, isPemda], schema) => !isExistingDebtor && !isPemda ? schema.required('Required') : schema.nullable()
    ),
    isRelatedToSmi: yup.boolean().when(
      '$isExistingDebtor', ([flag], schema) => !flag ? schema.required('Required') : schema.nullable()
    ),
    npwp: yup.string().test(
      'npwp', 'NPWP tidak boleh kurang dari 1 karakter', (value) => value?.length >= 1 || !value
    ).nullable(),
    remark: yup.string().nullable(),
    typeProcess: yup.string().required('Tipe proses tidak boleh kosong'),
  },
);
