import * as Yup from 'yup';


const fileSchema = Yup.object().shape({
  extension: Yup.string().notRequired(),
  file: Yup.mixed().notRequired(),
  name: Yup.string().notRequired(),
  url: Yup.string().notRequired(),
});

export const validationSchema = Yup.object().shape({
  dob: Yup.string().notRequired(),
  identityDocFile: fileSchema.notRequired(),
  identityDocNumber: Yup.string().when('identityTypeKey', {
    is: '04',
    otherwise: (schema) => schema
      .matches(/^[a-zA-Z0-9]*$/, 'ID Number tidak boleh mengandung simbol')
      .notRequired(),
    then: (schema) => schema
      .matches(/^[0-9]{16}$/, 'NIK harus 16 digit angka'),
  }),
  identityTypeKey: Yup.string().notRequired(),
  name: Yup.string()
    .required('Name is required')
    .test(
      'capitalization-first-only',
      'Huruf kapital hanya di awal nama setiap kata',
      (value) => {
        if (!value) return true;
        const words = value.split(' ');
        return words.every((word) => {
          const trimmed = word.trim();
          const rest = trimmed.slice(1);
          return !/[A-Z]/.test(rest);
        });
      },
    ),
  npwp: Yup.string().nullable().notRequired(),
  npwpFile: fileSchema.notRequired(),
  position: Yup.string().notRequired(),
});
