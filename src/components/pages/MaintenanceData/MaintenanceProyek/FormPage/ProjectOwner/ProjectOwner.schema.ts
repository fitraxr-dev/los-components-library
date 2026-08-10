import * as yup from 'yup';


export const yupSchema = yup.object().shape({
  bucketProcessId: yup.string().nullable(),
  contractor: yup.object().nullable(),
  id: yup.string().nullable(),
  otherInformation: yup.object().nullable(),
  owner: yup.object().shape({
    address: yup.string().nullable(),
    contactName: yup.string().nullable(),
    email: yup.string().email('Format email tidak valid').nullable(),
    lastModified: yup.string().nullable(),
    modifiedBy: yup.string().nullable(),
    modifiedDate: yup.string().nullable(),
    name: yup.string().nullable(),
    phone: yup.object().shape({
      phoneCode: yup.string().nullable(),
      phoneExt: yup.string().nullable(),
      phoneNumber: yup.string().nullable(),
    }),
    phoneExt: yup.string().nullable(),
    phoneNumber: yup.string().nullable(),
    website: yup.string().nullable(),
  }),
  projectInformation: yup.object().nullable(),
});
