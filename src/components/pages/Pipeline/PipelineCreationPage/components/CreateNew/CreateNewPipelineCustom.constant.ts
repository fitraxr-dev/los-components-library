import * as yup from 'yup';

import { forbiddenPrefixes } from '@/configs/constants/forbiddenPrefixes';

import type { FormDebtorFieldOptions } from '../FormDebtor/FormDebtor.type';


export const NEW_DISABLED_FIELDS: FormDebtorFieldOptions = {
  analyst: true,
  dataSource: true,
  debtorRating: true,
  debtorType: true,
  financingType: true,
  group: true,
  isGroup: true,
  isRelatedToSmi: true,
  remarks: true,
  typeProcess: true,
};

export const NEW_MANDATORY_FIELDS: FormDebtorFieldOptions = {
  debtorName: true,
  gam: true,
  insitutionTypeId: true,
};

export const EXISTING_DISABLED_FIELDS: FormDebtorFieldOptions = {
  createdDate: true,
  dataSource: true,
  debtorName: true,
  debtorNameOther: true,
  debtorRating: true,
  debtorType: true,
  gam: true,
  group: true,
  insitutionTypeId: true,
  isGroup: true,
  isRelatedToSmi: true,
  npwp: true,
};

export const EXISTING_MANDATORY_FIELDS: FormDebtorFieldOptions = {
  analyst: true,
  financingType: true,
  typeProcess: true,
};


// Context: { isExistingDebtor: boolean }
export const VALIDATION_SCHEMA = yup.object({
  analyst: yup.object({ id: yup.string(), label: yup.string() }).nullable().default(null)
    .when(
      '$isExistingDebtor',
      ([flag], schema) => flag
        ? schema.test(
          'analyst-required',
          'Nama Analis harus diisi',
          (value) => {
            if (value === null || value === undefined) return false;
            return value.id !== null && value.id !== undefined && value.id !== '';
          }
        )
        : schema
    ),
  debtorName: yup.string()
    .when(
      '$isExistingDebtor', ([flag], schema) => flag ? schema.nullable() : schema.required('Nama Customer harus diisi')
    ).test(
      'debtorName', 'Nama Customer tidak memiliki akhiran Persero/TBK', (value) => !value?.match(/(PERSERO|TBK)\s*$/i)
    ).test(
      'no-institution-prefix',
      'Nama Customer ditulis tanpa tipe institusi (PT/PEMKAB/PEMKOT/DLL)',
      function (value) {
        const { institutionTypeId } = this.parent;

        // Create a local copy to filter dynamically
        let adjustedPrefixes = [...forbiddenPrefixes];

        if (institutionTypeId === 'CENTRAL_GOVERNMENT') {
          adjustedPrefixes = adjustedPrefixes.filter((p) => p.toLowerCase() !== 'others');
        }

        if (!value) return true;
        return !adjustedPrefixes.some((prefix) =>
          value.toLowerCase().startsWith(prefix.toLowerCase())
        );
      }
    ),
  debtorNameOthers: yup.string()
    .when(
      'debtorName', {
        is: 'OTHERS', otherwise: (schema) => schema.nullable(), then: (schema) => schema.required('Required').test(
          'debtorNameOthers', 'Nama Customer minimal terdiri atas 3 karakter.', (value, context) => value?.length >= 3
        ),
      }
    ),
  financingType: yup.string().when(
    '$isExistingDebtor', ([flag], schema) => flag ? schema.required('Tipe pembiayaan tidak boleh kosong') : schema.nullable()
  ),
  gam: yup.object({
    id: yup.string().when(
      '$isExistingDebtor', ([flag], schema) => flag ? schema : schema.required()
    ), label: yup.string().when(
      '$isExistingDebtor', ([flag], schema) => flag ? schema : schema.required()
    ),
  }).nullable(),
  group: yup.object({ id: yup.string(), label: yup.string() }).nullable(),
  institutionTypeId: yup.string()
    .when(
      '$isExistingDebtor', ([flag], schema) => flag ? schema.nullable() : schema.required('Required')
    ),
  npwp: yup.string().nullable().notRequired(),
  refinaId: yup.string(),
  remark: yup.string().nullable(),
  remarks: yup.string(),
  typeProcess: yup.string().when(
    '$isExistingDebtor', ([flag], schema) => flag ? schema.required('Tipe proses tidak boleh kosong') : schema.nullable()
  ),
});

export const modal = {
  CUSTOMER_DK_VALIDATION: 'CUSTOMER_DK_VALIDATION',
  EXISTING_USER: 'EXISTING_USER',
  RECOMMENDED_GROUP: 'RECOMMENDED_GROUP',
};
