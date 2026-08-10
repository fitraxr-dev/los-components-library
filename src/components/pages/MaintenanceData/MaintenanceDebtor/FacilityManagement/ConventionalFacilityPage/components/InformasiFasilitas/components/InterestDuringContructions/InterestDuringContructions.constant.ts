import * as yup from 'yup';


export const interestDuringContructionsSchema = yup.object().shape({
  availabilityPeriodIDC: yup.string().required('Availability Period IDC harus diisi'),
  baseRateIDC: yup.string().notRequired().nullable(),
  currencyIDC: yup.string().notRequired().nullable(),
  effectiveRateIDC: yup.string().required('Effective Rate IDC harus diisi'),
  interestIDCPaymentBy: yup.string().required('Interest IDC Payment By harus diisi'),
  interestTypeIDC: yup.string().required('Interest Type IDC harus diisi'),
  marginRateIDC: yup.string().required('Margin Rate IDC harus diisi'),
  modifiedBy: yup.string().notRequired(),
  modifiedDate: yup.string().notRequired(),
  paymentPortionIDC: yup.string().required('Payment Portion IDC harus diisi'),
  plafondIDC: yup.string().required('Plafond IDC harus diisi'),
  startDateIDC: yup.string().notRequired().nullable(),
});
