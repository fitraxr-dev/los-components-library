import * as yup from 'yup';


export const ShareHolderSchema = yup.object().shape({
  beneficialOwner: yup.string().nullable(),
  id: yup.number().nullable(),
  informationSource: yup.string().nullable(),
  isParentLevel: yup.boolean().nullable(),
  level: yup.number().nullable(),
  module: yup.string().nullable(),
  name: yup.string()
    .when('isParentLevel', {
      is: (val) => val === true,
      otherwise: (schema) => schema.required('Nama Shareholder wajib diisi'),
      then: (schema) => schema.nullable().notRequired(),
    }),
  parentId: yup.string()
    .when('isParentLevel', {
      is: (val) => val === true,
      otherwise: (schema) => schema.required('Nama Shareholder Tingkat Sebelumnya wajib diisi'),
      then: (schema) => schema.nullable().notRequired(),
    }),
  percentage: yup.string().nullable(),
  prefix: yup.string().nullable(),
  shares: yup.string().nullable(),
  suffix: yup.string().nullable(),
  type: yup.string().required('Tipe Shareholder wajib diisi'),
});
