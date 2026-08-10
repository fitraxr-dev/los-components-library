import * as yup from 'yup';


export const modal = {
  UPLOAD_DOCUMENT_MUP: 'UPLOAD_DOCUMENT_MUP',
};

export const modalUploadDocumentMupSchema = yup.object({
  document: yup.object({
    extension: yup.string().notRequired(),
    file: yup.string().notRequired(),
    name: yup.string().notRequired(),
    url: yup.string().notRequired(),
  }).notRequired().test('fileType', 'File wajib format PDF', (value) =>
    ['.pdf'].includes(value.extension)
  ),
  documentName: yup.string().nullable().notRequired(),
  uploadBy: yup.string().notRequired(),
  uploadDate: yup.string().notRequired(),
});
