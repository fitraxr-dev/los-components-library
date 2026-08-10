import * as yup from 'yup';


export const PDF_MIME = 'application/pdf';
// export const MAX_DOC_SIZE_BYTES = 100 * 1024 * 1024;

export const addFinalDocumentInitialValues = {
  document: null,
  documentDate: '',
  documentName: '',
  documentNumber: '',
  uploadBy: '',
  uploadDate: '',
};

export const addFinalDocumentModalSchema = yup
  .object({
    document: yup
      .mixed<any>()
      .required('Dokumen wajib diunggah')
      .test('has-file', 'Dokumen wajib diunggah', (v) => !!v && !!v.file)
      .test(
        'is-docx',
        'Format file tidak didukung. Hanya file PDF yang diperbolehkan',
        (v) => !v?.file || v.file.type === PDF_MIME
      ),
    // .test(
    //   'file-size',
    //   'Ukuran file terlalu besar',
    //   (v) => !v?.file || v.file.size <= MAX_DOC_SIZE_BYTES
    // ),

    documentDate: yup
      .string()
      .required('Tanggal dokumen wajib diisi')
      .test('not-in-future', 'Tanggal dokumen tidak boleh di masa depan', (val) => {
        if (!val) return false;

        const d = new Date(val);
        if (Number.isNaN(d.getTime())) return true;
        const now = new Date();
        d.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        return d <= now;
      }),

    documentName: yup
      .string()
      .trim()
      .max(255, 'Maksimum 255 karakter')
      .required('Nama dokumen wajib diisi'),

    documentNumber: yup
      .string()
      .trim()
      .required('Nomor dokumen wajib diisi'),

    uploadBy: yup.string().trim().required(),
    uploadDate: yup.string().trim().required(),
  })
  .noUnknown(true);
