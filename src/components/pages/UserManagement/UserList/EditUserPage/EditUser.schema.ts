import * as yup from 'yup';


const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const yupSchema = yup.object({
  email: yup.string().nonNullable().required('Email is Required').matches(EMAIL_REGEX, 'Email invalid'),
  userType: yup.string().nonNullable().required('User Type is required'),
});
