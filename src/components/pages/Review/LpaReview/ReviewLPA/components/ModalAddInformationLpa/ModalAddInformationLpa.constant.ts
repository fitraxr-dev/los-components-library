import * as yup from 'yup';


export const validationSchema = yup.object().shape({
  assessmentDate: yup.string()
    .required('Tanggal Penilaian harus diisi'),
  kjpp: yup.string()
    .required('Nama KJPP harus diisi')
    .max(50, 'Nama KJPP maksimal 50 karakter'),
  remark: yup.string()
    .required('Keterangan harus diisi'),
  reportDate: yup.string()
    .required('Tanggal Laporan harus diisi'),
  reportNo: yup.string()
    .required('Nomor Laporan harus diisi')
    .max(25, 'Nomor Laporan maksimal 25 karakter'),
});
