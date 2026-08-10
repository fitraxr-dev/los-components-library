import * as yup from 'yup';


const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '').trim();

export const ItemPageSchema = yup.object().shape({
  additionalAction: yup.boolean(),
  isActive: yup.boolean(),
  item: yup
    .string()
    .required('Description harus diisi')
    .test(
      'richtext-not-empty',
      'Description harus diisi',
      (value) => !!value && stripHtml(value).length > 0
    ),
  itemNo: yup.string().required('Nomor Item harus diisi'),
  needConfirmation: yup.boolean(),
  referenceItem: yup.string().nullable(),
});
