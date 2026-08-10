import * as yup from 'yup';


export const validationSchema = yup.object({
  collectability: yup.string().nonNullable().required('Required'),
  dob: yup.string().notRequired(),
  googleResult: yup.string().nonNullable().required('Required'),
  jobPosition: yup.string().notRequired(),
  name: yup.string().max(255, 'Maksimal 255 karakter').notRequired(),
  nik: yup.string().notRequired(),
  nikFile: yup.object({
    extension: yup.string(),
    name: yup.string(),
    url: yup.string(),
  }).nullable().notRequired(),
  note: yup.string().nonNullable().required('Required'),
  npwp: yup.string().notRequired(),
  npwpFile: yup.object({
    extension: yup.string(),
    name: yup.string(),
    url: yup.string(),
  }).nullable().notRequired(),
  resultReporting: yup.string().nonNullable().required('Required'),
  type: yup.string().notRequired().notRequired(),
});
