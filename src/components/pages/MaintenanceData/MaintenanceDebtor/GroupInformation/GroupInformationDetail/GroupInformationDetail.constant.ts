import * as Yup from 'yup';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'debtorId',
    label: 'Customer ID',
  },
  {
    key: 'cif',
    label: 'CIF',
  },
  {
    // tidak ada di respon
    key: 'institutionType',
    label: 'Institution Type',
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
  },
];

export const mockTableData = [
  {
    cif: '-',
    customerId: '123456',
    customerName: 'John Doe',
    institutionType: '-',
    memberId: '112233',
  },
];

const isGroupInformationRequired = (schema) =>
  schema.when('$context', {
    is: 'groupInformation',
    otherwise: (s) => s.notRequired(),
    then: (s) => s.required('required'),
  });

export const groupInformationSchema = Yup.object().shape({
  groupInformation: Yup.object().shape({
    groupCode: isGroupInformationRequired(Yup.string()),
    groupName: isGroupInformationRequired(Yup.string()),
    groupType: Yup.string().nullable(),
    isRelatedSmi: isGroupInformationRequired(Yup.boolean()),
    lastModified: Yup.string().nullable(),
    modifiedBy: Yup.string().nullable(),
    sector: Yup.array().nullable(),
  }),
});
