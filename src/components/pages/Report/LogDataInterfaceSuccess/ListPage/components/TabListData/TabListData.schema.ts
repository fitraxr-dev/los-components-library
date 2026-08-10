import * as yup from 'yup';


export const validationSchema = yup.object().shape({
  customerName: yup.array().optional(),
  divisionName: yup.array().optional(),
  statusDataSent: yup.array().optional(),
  tanggalKirim: yup.string().optional(),
  typeOfData: yup.array().optional(),
});
