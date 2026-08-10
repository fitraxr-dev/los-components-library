import * as yup from 'yup';


export const machineEquipmentValidation = yup.object().shape({
  amount: yup.number().notRequired(),
  condition: yup.string().notRequired(),
  document: yup.object().nullable().notRequired(),
  engineName: yup.string().notRequired(),
  id: yup.string().nullable().notRequired(),
  indicationLiquidationValue: yup.string().notRequired(),
  marketValue: yup.string().notRequired(),
  number: yup.number().nullable().notRequired(),
  parentId: yup.string().nullable().notRequired(),
  remark: yup.string().nullable(),
  spesification: yup.string().notRequired(),
  year: yup.mixed().nullable(),
});
