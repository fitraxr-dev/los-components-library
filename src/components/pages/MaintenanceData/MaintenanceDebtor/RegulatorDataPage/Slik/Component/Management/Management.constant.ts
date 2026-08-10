import * as Yup from 'yup';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '6vw' },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama Pengurus / Pemilik',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'operationData',
    label: 'Operasi Data',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
    sx: { minWidth: '12vw' },
  },
];

export const mockTableData = [
  {
    index: 1,
    jobPositionLabel: 'Manager',
    lastCheckedDate: '2025-01-01',
    name: 'John Doe',
    operationData: '2025-01-01',
  },
  {
    index: 2,
    jobPositionLabel: 'Staff',
    lastCheckedDate: '2025-01-01',
    name: 'Jane Smith',
    operationData: '2025-01-01',
  },
  {
    index: 3,
    jobPositionLabel: 'Director',
    lastCheckedDate: '2025-01-01',
    name: 'Jim Beam',
    operationData: '2025-01-01',
  },
];

export const managementSchema = Yup.object().shape({
  address: Yup.string().nullable().notRequired(),
  branch: Yup.string().nullable().notRequired(),
  country: Yup.string().nullable().notRequired(),
  countryDesc: Yup.string().nullable().notRequired(),
  districtDesc: Yup.string().nullable().notRequired(),
  districtSlik: Yup.string().nullable().notRequired(),
  dob: Yup.string().nullable().notRequired(),
  ethnicOrigin: Yup.string().nullable().notRequired(),
  gender: Yup.string().nullable().notRequired(),
  idDocument: Yup.object().shape({
    extension: Yup.string().optional().nullable(),
    name: Yup.string().optional().nullable(),
    url: Yup.string().optional().nullable(),
  }),
  idNo: Yup.string().nullable().notRequired(),
  idType: Yup.string().nullable().notRequired(),
  idTypeDesc: Yup.string().nullable().notRequired(),
  identityExpiry: Yup.string().nullable().notRequired(),
  jobPositionDesc: Yup.string().nullable().notRequired(),
  jobPositionSlik: Yup.string().required('Jabatan wajib diisi'),
  managementCode: Yup.string().nullable().notRequired(),
  modifiedBy: Yup.string().nullable().notRequired(),
  modifiedDate: Yup.string().nullable().notRequired(),
  name: Yup.string().nullable().notRequired(),
  npwp: Yup.string().nullable().notRequired(),
  npwpDocument: Yup.object().shape({
    extension: Yup.string().optional().nullable(),
    name: Yup.string().optional().nullable(),
    url: Yup.string().optional().nullable(),
  }),
  operationData: Yup.string().notRequired(),
  ownershipShare: Yup.number().required('Pangsa Kepemilikan wajib diisi'),
  personInCharge: Yup.string().nullable().notRequired(),
  placeOfBirth: Yup.string().nullable().notRequired(),
  postalCode: Yup.string().nullable().notRequired(),
  province: Yup.string().nullable().notRequired(),
  status: Yup.string().nullable().notRequired(),
  statusDesc: Yup.string().nullable().notRequired(),
  subDistrict: Yup.string().nullable().notRequired(),
  title: Yup.string().nullable().notRequired(),
  village: Yup.string().nullable().notRequired(),
});
