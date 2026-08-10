import * as Yup from 'yup';


export const penjaminFormSchema = Yup.object().shape({
  address: Yup.string().required('Alamat Penjamin harus diisi'),
  branch: Yup.string().nullable().notRequired(),
  dataOperation: Yup.string().required('Operasi Data harus diisi'),
  facilityAccountNumber: Yup.string().nullable().notRequired(),
  facilitySegment: Yup.string().required('Jenis Segmen Fasilitas harus diisi'),
  facilitySegmentDesc: Yup.string().nullable().notRequired(),
  fullName: Yup.string().nullable().notRequired(),
  guarantorCoverageLevel: Yup.string().nullable().notRequired(),
  gurantorCode: Yup.string().required('Golongan harus diisi'),
  gurantorCodeDesc: Yup.string().nullable().notRequired(),
  identityNo: Yup.string().required('Nomor Identitas Penjamin harus diisi'),
  identityType: Yup.string().required('Jenis Identitas Penjamin harus diisi'),
  identityTypeDesc: Yup.string().nullable().notRequired(),
  identityTypeRemark: Yup.string().when('identityType', {
    is: (val: string) => {
      return val === '9';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Jenis Identitas Penjamin Lainnya harus diisi'),
  }),
  modifiedBy: Yup.string().nullable().notRequired(),
  modifiedDate: Yup.string().nullable().notRequired(),
  name: Yup.string().required('Nama Penjamin harus diisi'),
  remark: Yup.string().nullable().notRequired(),
});
