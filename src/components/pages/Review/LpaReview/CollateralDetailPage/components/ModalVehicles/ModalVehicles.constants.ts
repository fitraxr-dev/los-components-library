import * as yup from 'yup';


export const vehichlesValidation = yup.object().shape({
  bpkbNumber: yup.string().notRequired(),
  condition: yup.string().notRequired(),
  document: yup.object().nullable().notRequired(),
  engineNumber: yup.string().nullable().notRequired(),
  id: yup.string().nullable(),
  indicationLiquidationValue: yup.string().notRequired(),
  marketValue: yup.string().notRequired(),
  name: yup.string().notRequired(),
  parentId: yup.string().nullable().notRequired(),
  policeNumber: yup.string().notRequired(),
  remark: yup.string().nullable().notRequired(),
  year: yup.string().nullable().notRequired(),
});
