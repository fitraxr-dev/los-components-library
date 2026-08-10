import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import useGetSpecialApproval from '../TableSpecialApproval/hooks/useGetSpecialApproval';

import { modal } from './TableOthersSpecialApproval.constants';

import type { TableOthersSpecialApprovalProps } from './TableOthersSpecialApproval.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useTableOthersSpecialApproval = ({ module, process }: TableOthersSpecialApprovalProps) => {
  const theme = useTheme();
  const { processId } = useIdentity();

  const [noPageOthers, setNoPageOthers] = useState(1);
  const [itemPerPageOthers, setItemPerPageOthers] = useState(5);

  const { data: others } = useGetSpecialApproval({
    filter: {
      bucketProcessId: processId,
      module: module,
      process: process,
      type: 'OTHERS',
    },
    page: {
      itemPerPage: itemPerPageOthers,
      noPage: noPageOthers,
    },
    sortList: {
      columnName: 'modifiedDate',
      sortType: 'DESC',
    },
  });

  const otherList = others?.contents.length > 0 ? others?.contents.map((dt) => ({
    bucketProcessId: dt.bucketProcessId,
    description: dt.description,
    id: dt.id,
    specialNote: dt.specialNote,
    tableSpecialApprovalType: dt.typeSpecialApprovalLabel,
    type: dt.type,
    typeSpecialApproval: dt.typeSpecialApproval,
    typeSpecialApprovalLabel: dt.typeSpecialApprovalLabel,
    viewOnly: dt.viewOnly,
  })) : [{
    bucketProcessId: '-',
    description: '-',
    id: '-',
    specialNote: '-',
    tableSpecialApprovalType: '-',
    type: '-',
    typeSpecialApproval: '-',
    typeSpecialApprovalLabel: '-',
    viewOnly: false,
  }];

  const tableHeaderOthers: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'tableSpecialApprovalType',
      label: 'Jenis Persetujuan Khusus',
      sx: { width: '25%' },
    },
    {
      key: 'description',
      label: 'Deskripsi',
      sx: { width: '60%' },
    },
    {
      key: 'action',
      label: 'Action',
      options: others?.contents.length > 0 ? [{ iconName: 'detail', onClick: (props) => handpeOpenSpecialApprovalDetailPopup('OTHERS', props) }] : [],
      type: 'action',
    },
  ];

  const handpeOpenSpecialApprovalDetailPopup = (type: 'OTHERS' | 'NON_OTHERS', values?: any) => {
    NiceModal.show(modal.SPECIAL_APPROVAL_DETAIL, {
      initialValues: values,
      type,
    });
  };

  const isMip = module === TypeModule.MIP;

  return {
    isMip,
    noPageOthers,
    otherList,
    others,
    setItemPerPageOthers,
    setNoPageOthers,
    tableHeaderOthers,
    theme,
  };
};
