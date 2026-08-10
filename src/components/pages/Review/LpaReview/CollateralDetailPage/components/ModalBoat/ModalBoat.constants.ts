import * as yup from 'yup';


export const boatValidation = yup.object().shape({
  condition: yup.string().notRequired(),
  countryManufacture: yup.string().nullable().notRequired(),
  deadWeight: yup.string().notRequired(),
  document: yup.object().nullable().notRequired(),
  flag: yup.string().notRequired(),
  id: yup.string().nullable().notRequired(),
  identificationLetterNumber: yup.string().notRequired(),
  imoNo: yup.string().notRequired(),
  in: yup.string().notRequired(),
  indicationLiquidationValue: yup.string().notRequired(),
  length: yup.string().notRequired(),
  mainEngine: yup.string().notRequired(),
  marketValue: yup.string().notRequired(),
  name: yup.string().notRequired(),
  netWeight: yup.string().notRequired(),
  parentId: yup.string().nullable().notRequired(),
  portOfRegistration: yup.string().nullable().notRequired(),
  remark: yup.string().nullable().notRequired(),
  wide: yup.string().notRequired(),
  year: yup.string().notRequired(),
});
