import * as yup from 'yup';


export const validationSchema = yup.object({
  collectability: yup.string().nonNullable().required('Required'),
  currency: yup.string().nullable(),
  googleResult: yup.string().nonNullable().required('Required'),
  name: yup.string().nullable(),
  nik: yup.string().nullable(),
  note: yup.string().nonNullable().required('Required'),
  npwp: yup.string().test(
    'npwp', 'NPWP tidak boleh kurang dari 1 karakter', (value) => value?.length >= 1 || !value
  ).nullable(),
  ownershipType: yup.string().nullable(),
  percentage: yup.string().nullable(),
  position: yup.object({
    id: yup.string().nullable(),
    label: yup.string().nullable(),
  }).nullable().notRequired(),
  resultReporting: yup.string().nonNullable().required('Required'),
  shareValue: yup.string().nullable(),
  shares: yup.string().nullable(),
  type: yup.string().nullable(),
  uploadNik: yup.object({
    extension: yup.string(),
    name: yup.string(),
    url: yup.string(),
  }).nullable(),
  uploadNpwp: yup.object({
    extension: yup.string(),
    name: yup.string(),
    url: yup.string(),
  }).nullable(),
});
