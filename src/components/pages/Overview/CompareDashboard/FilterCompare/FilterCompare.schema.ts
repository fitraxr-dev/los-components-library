import * as yup from 'yup';


export const validationSchema = yup.object({
  direktorat: yup.string().optional(),
  divisi1: yup.string().required('Divisi 1 harus dipilih'),
  divisi2: yup.string().required('Divisi 2 harus dipilih'),
});
