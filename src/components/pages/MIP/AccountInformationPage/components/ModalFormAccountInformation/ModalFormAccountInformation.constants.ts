import * as yup from 'yup';


export const modalAccountInformationSchema = yup.object().shape({
  bank: yup.object({
    id: yup.string().nonNullable().required('Required'),
    label: yup.string().nonNullable().required('Required'),
  }).nonNullable().required('Required'),
  bankType: yup.object({
    id: yup.string().nonNullable().required('Required'),
    label: yup.string().nonNullable().required('Required'),
  }).nonNullable().required('Required'),
  debtorName: yup.string().notRequired(),
  exchangeRate: yup.object({
    currency: yup.string().nullable(),
    value: yup.string().nullable(),
  }).when('nominal', {
    is: (val) => val?.currency === 'USD',
    otherwise: () => yup.object({
      currency: yup.string().nullable(),
      value: yup.string().nullable(),
    }).nullable(),
    then: () => yup.object({
      currency: yup.string().nonNullable().required('Exchange rate is required'),
      value: yup.string().nonNullable().required('Exchange rate is required'),
    }).required('Exchange rate is required'),
  }),
  nominal: yup.object({
    currency: yup.string().nullable(),
    value: yup.string().nonNullable().required('Nominal is required'),
  }),
  nominalIdr: yup.object({
    currency: yup.string(),
    value: yup.string(),
  }).notRequired(),
  product: yup.string().notRequired(),
  rates: yup.string().notRequired(),
  reference: yup.string().notRequired(),
  remark: yup.string().notRequired(),
});
