import type { TableHeader } from '@/components/shared/Table/Table.types';


export const projectFacilityTableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'facilityId',
    label: 'Facility ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityNo',
    label: 'Facility No',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'pic',
    label: 'PIC',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productType',
    label: 'Produk',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityStatus',
    label: 'Status Fasilitas',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const formDefaultValues = {
  address: '',
  classification: '',
  contractName: '',
  email: '',
  lastModified: '',
  modifiedBy: '',
  name: '',
  phone: '',
  phoneCode: '',
  phoneExt: '',
  phoneNumber: '',
  website: '',

};
