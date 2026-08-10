import * as yup from 'yup';


export const documentCategoryDropdownList = [
  {
    label: 'Document Pembiayaan',
    value: 'FINANCING_DOCUMENT',
  },
  {
    label: 'Supporting Document',
    value: 'SUPPORTING_DOCUMENT',
  }
];

export const DOCUMENT_SCHEMA = yup.object({
  document: yup.object().shape({
    extension: yup.string(),
    file: yup.string(),
    name: yup.string(),
    url: yup.string(),
  }),
  documentCategory: yup.string(),
  documentDate: yup.string(),
  documentGroup: yup.object().shape({
    id: yup.string(),
    label: yup.string(),
  }),
  documentName: yup.string(),
  documentNumber: yup.string().max(25, 'Nomor Dokumen maksimal 25 karakter'),
  documentType: yup.object().shape({
    id: yup.string(),
    label: yup.string(),
  }),
  readonly: yup.boolean(),
});
