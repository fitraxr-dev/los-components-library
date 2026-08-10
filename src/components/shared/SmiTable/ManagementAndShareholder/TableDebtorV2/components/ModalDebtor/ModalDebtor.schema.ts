import * as yup from 'yup';


export const validationSchema = yup.object({
  collectability: yup.string().nonNullable().required('Required'),
  googleResult: yup.string().nonNullable().required('Required'),
  name: yup.string().max(255, 'Maksimal 255 karakter').nullable().notRequired(),
  note: yup.string().nonNullable().required('Required'),
  npwp: yup.string().test(
    'npwp', 'NPWP tidak boleh kurang dari 15 karakter', (value) => value?.length >= 15 || !value
  ).nullable().notRequired(),
  npwpFile: yup.object({
    extension: yup.string(),
    name: yup.string(),
    url: yup.string(),
  }).nullable().notRequired(),
  resultReporting: yup.string().nonNullable().required('Required'),
  type: yup.string().nullable().notRequired(),
});
