import * as yup from 'yup';


export const modalFacilityOtherBankSchema = yup.object({
  bank: yup.object({
    id: yup.string().nonNullable().required('Required'),
    label: yup.string().nonNullable().required('Required'),
  }).nonNullable().required('Required'),
  bankType: yup.object({
    id: yup.string().nonNullable().required('Required'),
    label: yup.string().nonNullable().required('Required'),
  }).nonNullable().required('Required'),
  callType: yup.string().nonNullable().required('Required'),
  collectability: yup.string().notRequired(),
  debtorName: yup.string().notRequired(),
  exchangeRate: yup.object({
    currency: yup.string().nullable(),
    value: yup.string().nullable(),
  }).when('plafond', {
    is: (val) => val?.currency && val?.currency !== 'IDR',
    otherwise: (schema) => schema.nullable().notRequired(),
    then: () => yup.object({
      currency: yup.string().nonNullable().required('Required'),
      value: yup.string().nonNullable().required('Required'),
    }),
  }),
  isSyndication: yup.boolean().notRequired(),
  otherBank: yup.array(),
  outstanding: yup.object({
    currency: yup.string().nonNullable().required('Required'),
    value: yup.string().when({
      is: (val) => {
        return typeof val === 'string' && val.length === 0;
      },
      then: () => yup.string().required('Required'),
    }),
  }).required('Required'),
  outstandingIdr: yup.object({
    currency: yup.string(),
    value: yup.string(),
  }).notRequired(),
  plafond: yup.object({
    currency: yup.string().nonNullable().required('Required'),
    value: yup.string().when({
      is: (val) => {
        return typeof val === 'string' && val.length === 0;
      },
      then: () => yup.string().required('Required'),
    }),
  }).required('Required'),
  plafondIdr: yup.object({
    currency: yup.string().notRequired(),
    value: yup.string().notRequired(),
  }).notRequired(),
  product: yup.string().notRequired(),
  rates: yup.string().notRequired(),
  remark: yup.string().notRequired(),
});
