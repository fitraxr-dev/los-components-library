import * as Yup from 'yup';

import type { AutocompleteOption } from '../../Autocomplete/types';


export const modal = {
  MODAL_UPLOAD_DOCUMENT: 'MODAL_UPLOAD_DOCUMENT',
};

export const fileType = {
  FILE_CONSTRAINT: '.pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,application/x-zip-compressed,application/zip,application/x-compressed',
};

export const documentCategoryDropdownList: AutocompleteOption[] = [
  {
    id: 'FINANCING_DOCUMENT',
    label: 'Document Pembiayaan',
  },
  {
    id: 'SUPPORTING_DOCUMENT',
    label: 'Supporting Document',
  }
];

export const schema = Yup.object().shape({
  document: Yup.object().shape({
    extension: Yup.string().required('Dokumen tidak boleh kosong 1'),
    file: Yup.mixed(),
    name: Yup.string().required('Dokumen tidak boleh kosong 3'),
    url: Yup.string().required('Dokumen tidak boleh kosong 4'),
  }),

  documentCategory: Yup.object().shape({
    id: Yup.mixed()
      .test(
        'is-string-or-number',
        'Kategori dokumen tidak boleh kosong',
        (value) => typeof value === 'string' || typeof value === 'number'
      )
      .required('Kategori dokumen tidak boleh kosong'),
    label: Yup.string().required('Kategori dokumen tidak boleh kosong'),
  })
    .test(
      'not-empty',
      'Kategori dokumen tidak boleh kosong',
      (value) => !!value && (value.id !== '' && value.label !== '')
    ),

  documentDate: Yup.string().required('Tanggal dokumen tidak boleh kosong'),

  documentGroup: Yup.object().shape({
    id: Yup.string().required('Grup dokumen tidak boleh kosong'),
    label: Yup.string().required('Grup dokumen tidak boleh kosong'),
  })
    .test(
      'not-empty',
      'Grup dokumen tidak boleh kosong',
      (value) => !!value && (value.id !== '' && value.label !== '')
    ),

  documentName: Yup.string().required('Nama dokumen tidak boleh kosong'),

  documentNumber: Yup.string().required('Nomor dokumen tidak boleh kosong'),

  documentType: Yup.object().shape({
    id: Yup.string().required('Jenis dokumen tidak boleh kosong'),
    label: Yup.string().required('Jenis dokumen tidak boleh kosong'),
  })
    .test(
      'not-empty',
      'Jenis dokumen tidak boleh kosong',
      (value) => !!value && (value.id !== '' && value.label !== '')
    ),
});
