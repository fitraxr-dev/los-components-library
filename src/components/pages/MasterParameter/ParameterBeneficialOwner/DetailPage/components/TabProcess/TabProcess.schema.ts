import * as yup from 'yup';


const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '').trim();

export const TabProcessSchema = yup.object().shape({
  additionalAction: yup.boolean(),
  applicationType: yup.string().required('Jenis Permohonan harus diisi'),
  isActive: yup.boolean(),
  itemGroup: yup
    .string()
    .required('Description harus diisi')
    .test(
      'richtext-not-empty',
      'Description harus diisi',
      (value) => !!value && stripHtml(value).length > 0
    ), needConfirmation: yup.boolean(),
  noItemGroup: yup.string().required('Nomor Item Group harus diisi'),
  referenceGroup: yup.string().nullable(),
});
