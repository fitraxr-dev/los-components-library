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
    extension: yup.string().required('Document Extension is required'),
    file: yup.string(),
    name: yup.string().required('Document Name is required'),
    url: yup.string().required('Document URL is required'),
  }),
  documentCategory: yup.string().required('Document Category is required'),
  documentDate: yup.string().required('Document Date is required'),
  documentGroup: yup.object().shape({
    id: yup.string().required('Document Group is required'),
    label: yup.string().required('Document Group is required'),
  }).required(),
  documentName: yup.string().required('Document Name is required'),
  documentNumber: yup.string()
    .required('Document Number is required')
    .max(25, 'Nomor Dokumen maksimal 25 karakter'),
  documentType: yup.object().shape({
    id: yup.string().required('Document Type is required'),
    label: yup.string().required('Document Type is required'),
  }).required(),
  readonly: yup.boolean(),
  uploadBy: yup.string(),
  uploadDate: yup.string(),
});
