import * as yup from 'yup';


export const TabProcessSchema = yup.object().shape({
  ariumCode: yup.string().nullable(),
  currency: yup.string().nullable(),
  exchangeRate: yup.string().required('Exchange Rate harus diisi'),
  isActive: yup.boolean(),
  temenosCode: yup.string().nullable(),
});
