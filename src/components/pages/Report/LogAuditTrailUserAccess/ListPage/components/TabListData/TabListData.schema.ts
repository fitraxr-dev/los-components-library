import * as yup from 'yup';


export const validationSchema = yup.object().shape({
  changeDate: yup.string().optional(),
  destination: yup.array().optional(),
  originDivision: yup.array().optional(),
  requestName: yup.string().optional(),
  username: yup.string().optional(),
});
