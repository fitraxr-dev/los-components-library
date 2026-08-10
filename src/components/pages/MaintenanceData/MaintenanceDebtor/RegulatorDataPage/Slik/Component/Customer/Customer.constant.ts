import * as yup from 'yup';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const customerSchema = yup.object().shape({
  address: yup.string().nullable().notRequired(),
  branchCode: yup.string().nullable().notRequired(),
  businessField: yup.string().required('Bidang Usaha harus diisi'),
  businessFieldDesc: yup.string().nullable().notRequired(),
  businessFieldRemark: yup.string().when('businessField', {
    is: (val: string) => {
      return val === '009000';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Bidang Usaha Lainnya harus diisi'),
  }),
  businessIdentityNumber: yup.string().nullable().notRequired(),
  businessName: yup.string().nullable().notRequired(),
  businessType: yup.string().required('Bentuk Badan Usaha harus diisi'),
  businessTypeDesc: yup.string().nullable().notRequired(),
  businessTypeRemark: yup.string().when('businessType', {
    is: (val: string) => {
      return val === '99';
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Bentuk Badan Usaha Lainnya harus diisi'),
  }),
  city: yup.string().nullable().notRequired(),
  country: yup.string().nullable().notRequired(),
  createdBy: yup.string().nullable().notRequired(),
  createdDate: yup.string().nullable().notRequired(),
  customerGroup: yup.string().required('Golongan Customer harus diisi'),
  customerGroupDesc: yup.string().nullable().notRequired(),
  customerRating: yup.string().nullable().required('Peringkat atau Rating Customer harus diisi'),
  customerRatingDesc: yup.string().nullable().notRequired(),
  debtorId: yup.string().nullable().notRequired(),
  district: yup.string().nullable().notRequired(),
  districtDesc: yup.string().nullable().notRequired(),
  districtSlik: yup.string().nullable().notRequired(),
  email: yup.string().nullable().notRequired(),
  establishmentDeedDate: yup.string().nullable().notRequired(),
  establishmentDeedNumber: yup.string().nullable().notRequired(),
  isExceedBMPK: yup.string().nullable().notRequired(),
  isGoPublic: yup.string().nullable().notRequired(),
  lastAmendmentDeedDate: yup.string().nullable().notRequired(),
  lastAmendmentDeedNumber: yup.string().nullable().notRequired(),
  modifiedBy: yup.string().nullable().notRequired(),
  modifiedDate: yup.string().nullable().notRequired(),
  officerCell: yup.string().nullable().notRequired(),
  phoneNumber: yup.string().nullable().notRequired(),
  placeOfEstablishment: yup.string().nullable().notRequired(),
  postalCode: yup.string().nullable().notRequired(),
  province: yup.string().nullable().notRequired(),
  ratingAgency: yup.string().nullable().required('Lembaga Pemeringkat harus diisi'),
  // ratingAgency: yup.string().when('customerRating', {
  //   is: (val: string) => {
  //     return !!val;
  //   },
  //   otherwise: (schema) => schema.nullable(),
  //   then: (schema) => schema.required('Lembaga Pemeringkat harus diisi'),
  // }),
  ratingAgencyDesc: yup.string().nullable().notRequired(),
  ratingDate: yup.string().when('customerRating', {
    is: (val: string) => {
      return !!val;
    },
    otherwise: (schema) => schema.nullable(),
    then: (schema) => schema.required('Lembaga Pemeringkat harus diisi'),
  }),
  relationWithReporter: yup.string().required('Hubungan dengan Pelapor harus diisi'),
  relationWithReporterDesc: yup.string().nullable().notRequired(),
  subDistrict: yup.string().nullable().notRequired(),
});


export const tableHeaderBusinessGroup: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '4%',
    },
    type: 'index',
  },
  {
    key: 'groupName',
    label: 'Nama Group Usaha',
  },
  {
    key: 'groupType',
    label: 'Jenis Group Usaha',
  },
];
