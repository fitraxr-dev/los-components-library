import * as yup from 'yup';


const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '').trim();

export const SubItemModalSchema = yup.object().shape({
  additionalAction: yup.boolean(),
  isActive: yup.boolean(),
  needConfirmation: yup.boolean(),
  noSubItem: yup.string().required('Nomor Sub Item harus diisi'),
  referenceSubItem: yup.string().nullable(),
  subItem: yup
    .string()
    .required('Description harus diisi')
    .test(
      'richtext-not-empty',
      'Description harus diisi',
      (value) => !!value && stripHtml(value).length > 0
    ),
});
