import * as yup from 'yup';


export const inventoryValidation = yup.object().shape({
  amount: yup.mixed().nullable().default(0).notRequired(),
  condition: yup.string().notRequired(),
  document: yup.mixed().nullable().notRequired(),
  id: yup.string().nullable().notRequired(),
  indicationLiquidationValue: yup.string().notRequired(),
  marketValue: yup.string().notRequired(),
  name: yup.string().notRequired(),
  parentId: yup.string().nullable().notRequired(),
  remark: yup.string().nullable().notRequired(),
});
