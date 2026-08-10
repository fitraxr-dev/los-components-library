import * as yup from 'yup';


export const HISTORY_DRAFT_MEMO_MODAL_SCHEMA = yup.object({
  document: yup.mixed(),
  documentDate: yup.date().required(),
  documentName: yup.string().required(),
  uploadBy: yup.string(),
  uploadDate: yup.string(),
});
