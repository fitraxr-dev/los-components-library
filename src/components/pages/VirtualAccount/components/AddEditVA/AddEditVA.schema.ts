import * as yup from 'yup';


export const addEditVaSchema = yup.object().shape({
  bank: yup.string().required('Bank is mandatory'),
  currency: yup.string().required('Currency is mandatory'),
  customerType: yup.string().required('Customer Type is mandatory'),
  id: yup.number().optional(),
  vaType: yup.string().required('VA Type is mandatory'),
});
