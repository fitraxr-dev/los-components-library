import * as Yup from 'yup';


const fileSchema = Yup.object().shape({
  extension: Yup.string().notRequired(),
  file: Yup.mixed().notRequired(),
  name: Yup.string().notRequired(),
  url: Yup.string().notRequired(),
});

export const validationSchema = Yup.object().shape({
  dob: Yup.string().notRequired(),
  name: Yup.string().required('Name is required'),
  nik: Yup.string().test(
    'npwp', 'NIK harus 16 karakter', (value) => value?.length === 16 || !value
  ).nullable().notRequired(),
  nikFile: fileSchema.notRequired(),
  npwp: Yup.string().test(
    'npwp', 'NPWP tidak boleh kurang dari 1 karakter', (value) => value?.length >= 1 || !value
  ).nullable().notRequired(),
  npwpFile: fileSchema.notRequired(),
  position: Yup.string().notRequired(),
});
