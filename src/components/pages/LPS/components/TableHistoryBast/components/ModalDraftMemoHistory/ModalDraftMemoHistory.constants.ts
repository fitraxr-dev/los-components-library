import * as yup from 'yup';


export const HISTORY_DRAFT_MEMO_INITIAL_VALUES = {
  document: {
    extension: '',
    name: '',
    url: '',
  },
  documentDate: '',
  documentName: '',
  uploadBy: '',
  uploadDate: '',
};

export const HISTORY_DRAFT_MEMO_MODAL_SCHEMA = yup.object({
  document: yup.mixed(),
  documentDate: yup.string().nullable().notRequired(),
  documentName: yup.string(),
  uploadBy: yup.string(),
  uploadDate: yup.string(),
});
