import * as yup from 'yup';


export const buildingValidation = yup.object().shape({
  allotment: yup.string().notRequired(),
  builtYear: yup.number().notRequired(),
  condition: yup.string().notRequired(),
  document: yup.object().notRequired(),
  id: yup.string().notRequired(),
  imbDate: yup.date().notRequired(),
  imbNumber: yup.string().notRequired(),
  indicationLiquidationValue: yup.string().notRequired(),
  marketValue: yup.string().notRequired(),
  name: yup.string().notRequired(),
  parentId: yup.string().notRequired(),
  publishedPlace: yup.string().notRequired(),
  remark: yup.string().notRequired(),
  wide: yup.string().notRequired(),
});
