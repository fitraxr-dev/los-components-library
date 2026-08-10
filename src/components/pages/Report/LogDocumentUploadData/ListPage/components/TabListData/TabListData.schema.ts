import * as yup from 'yup';


export const validationSchema = yup.object().shape({
  customerName: yup.array().optional(),
  divisionName: yup.array().optional(),
  documentStatus: yup.array().optional(),
  documentStorage: yup.string().optional(),
  groupDokumen: yup.object().nullable(),
  jenisDokumen: yup.array().optional(),
  kategori: yup.string().optional(),
  namaDokumen: yup.string().optional(),
  nomorDokumen: yup.string().optional(),
  uploadDate: yup.string().optional(),
});
