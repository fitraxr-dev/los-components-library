import * as yup from 'yup';


export const ShareHolderSchema = yup.object().shape({
  beneficialOwner: yup.string().nullable().notRequired(),
  informationSource: yup.string().nullable().notRequired(),
  isParentLevel: yup.boolean().nullable(),
  level: yup.number().nullable(),
  module: yup.string().nullable().notRequired(),
  name: yup.string().nullable().notRequired(),
  percentage: yup.string().nullable().notRequired(),
  prefix: yup.string().nullable().notRequired(),
  shareholder: yup.string().nullable().notRequired().notRequired(),
  shares: yup.string().nullable().notRequired(),
  suffix: yup.string().nullable().notRequired(),
  type: yup.string().nullable().notRequired(),
  typeLabel: yup.string().nullable().notRequired(),
});
