import * as yup from 'yup';


export const validationSchema = yup.object({
  address: yup.string().nullable().notRequired(),
  collectability: yup.string().nullable().notRequired(),
  collectabilityStatus: yup.string().nullable().notRequired(),
  currency: yup.string().nullable().notRequired(),
  district: yup.string().nullable().notRequired(),
  gender: yup.string().nullable().notRequired(),
  level: yup.string().nullable().notRequired(),
  name: yup.string().nullable().notRequired(),
  nik: yup.string().nullable().notRequired(),
  nominal: yup.string().nullable().notRequired(),
  npwp: yup.string().test(
    'npwp', 'NPWP tidak boleh kurang dari 1 karakter', (value) => value?.length >= 1 || !value
  ).nullable(),
  owner: yup.string().nullable().notRequired(),
  percentage: yup.string().nullable(),
  shareholderType: yup.string().nullable().notRequired(),
  shares: yup.string().nullable().notRequired(),
  village: yup.string().nullable().notRequired(),
});
