import * as yup from 'yup';


export const validationSchema = yup.object({
  address: yup.string().nullable().notRequired(),
  city: yup.string().nullable().notRequired(),
  collectability: yup.string().nullable().notRequired(),
  collectabilityStatusPer: yup.string().nullable().notRequired(),
  country: yup.string().nullable().notRequired(),
  district: yup.string().nullable().notRequired(),
  dob: yup.string().nullable().notRequired(),
  etnicOrigin: yup.string().nullable().notRequired(),
  gender: yup.string().nullable().notRequired(),
  idNo: yup.string().nullable().notRequired(),
  idType: yup.string().nullable().notRequired(),
  identityExpiry: yup.string().nullable().notRequired(),
  name: yup.string().nullable().notRequired(),
  nationality: yup.string().nullable().notRequired(),
  npwp: yup.string().test(
    'npwp', 'NPWP tidak boleh kurang dari 1 karakter', (value) => value?.length >= 1 || !value
  ).nullable(),
  phone: yup.string().nullable().notRequired(),
  position: yup.string().nullable().notRequired(),
  postalCode: yup.string().nullable().notRequired(),
  province: yup.string().nullable().notRequired(),
  status: yup.string().nullable().notRequired(),
  title: yup.string().nullable().notRequired(),
  village: yup.string().nullable().notRequired(),
});
