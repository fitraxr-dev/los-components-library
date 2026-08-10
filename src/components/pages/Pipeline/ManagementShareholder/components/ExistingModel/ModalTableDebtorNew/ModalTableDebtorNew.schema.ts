import * as yup from 'yup';


export const validationSchema = yup.object({
  documentNpwp: yup.object({
    extension: yup.string().nullable(),
    file: yup.string().nullable(),
    name: yup.string().nullable(),
  }).nullable().notRequired(),
  name: yup.string().nullable().notRequired(),
  npwp: yup.string().test(
    'npwp', 'NPWP tidak boleh kurang dari 1 karakter', (value) => value?.length >= 1 || !value
  ).nullable(),
});
