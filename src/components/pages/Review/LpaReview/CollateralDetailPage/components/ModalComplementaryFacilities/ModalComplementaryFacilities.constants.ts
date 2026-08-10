import * as yup from 'yup';


export const complimentaryValidation = yup.object().shape({
  amount: yup.mixed().nullable().notRequired(),
  capacity: yup.mixed().nullable().notRequired(),
  condition: yup.string().notRequired(),
  document: yup.object().nullable().notRequired(),
  id: yup.string().nullable().notRequired(),
  indicationLiquidationValue: yup.string().notRequired(),
  magnitude: yup.mixed().nullable().notRequired(),
  marketValue: yup.string().notRequired(),
  name: yup.string().notRequired(),
  parentId: yup.string().nullable().notRequired(),
  remark: yup.mixed().nullable().notRequired(),
  year: yup.mixed().nullable().notRequired(),
});
