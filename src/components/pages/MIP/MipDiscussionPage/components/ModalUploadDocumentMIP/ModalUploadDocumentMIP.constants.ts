import * as yup from 'yup';


export const modal = {
  UPLOAD_DOCUMENT_MIP: 'UPLOAD_DOCUMENT_MIP',
};

export const modalUploadDocumentMipSchema = yup.object({
  document: yup.object({
    extension: yup.string().notRequired(),
    file: yup.string().notRequired(),
    name: yup.string().notRequired(),
    url: yup.string().notRequired(),
  }).notRequired(),
  documentName: yup.string().when('document', {
    is: (doc) => !!doc.name,
    then: (schema) => schema.nonNullable().required('Required'),
  }),
  uploadBy: yup.string().notRequired(),
  uploadDate: yup.string().notRequired(),
});
