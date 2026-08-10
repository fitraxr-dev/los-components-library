import * as yup from 'yup';


export const itemSchema = yup.object({
  active: yup.string().required('Active status is required'),
  kodeBusinessSummary: yup.string().required('Kategori Business Summary is required'),
});

export const schema = yup.object({
  items: yup.array().of(itemSchema).min(1, 'At least one item is required'),
  kodeBusinessCall: yup.string(),
});

export type ItemData = yup.InferType<typeof itemSchema>;
export type FormData = yup.InferType<typeof schema>;
