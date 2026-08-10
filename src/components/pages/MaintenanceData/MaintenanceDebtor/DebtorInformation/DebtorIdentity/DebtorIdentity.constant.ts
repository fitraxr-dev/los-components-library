import * as Yup from 'yup';


export const debtorIdentitySchema = Yup.object().shape({
  debtorIdentity: Yup.object().shape({
    dateFounded: Yup.string()
      .required('Tanggal Pendirian tidak boleh kosong'),

    firstNotaryDeedDate: Yup.string().nullable(),

    firstNotaryDeedDocument: Yup.mixed()
      .required('First notary deed file tidak boleh kosong'),

    firstNotaryDeedNo: Yup.string().nullable(),

    lastNotaryDeedDate: Yup.string().nullable(),

    lastNotaryDeedDocument: Yup.mixed()
      .required('Last notary deed file tidak boleh kosong'),

    lastNotaryDeedNo: Yup.string().nullable(),

    modifiedBy: Yup.string().nullable(),

    modifiedDate: Yup.string().nullable(),

    notaryDeedDocument: Yup.mixed()
      .required('Notary deed file tidak boleh kosong'),

    notaryDeedNo: Yup.string()
      .required('Notary deed No. tidak boleh kosong'),

    npwpDocument: Yup.mixed()
      .required('NPWP file tidak boleh kosong'),

    npwpNo: Yup.string().required('NPWP tidak boleh kosong'),
    placeFounded: Yup.string()
      .required('Tempat Pendirian tidak boleh kosong'),
  }),
});
