import { useState } from 'react';


import { userManagement } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetUserApplicationList from '@/components/pages/UserManagement/UserMenu/shared/hooks/user-controller/useGetUserApplicationList';
import Button from '@/components/shared/Button';

import { modal } from '../../List.constants';

import { HEADER_TABLE } from './ApprovalModal.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalModal = (modalId: string) => {
  const [noPage, setNoPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(100);
  const router = useCustomRouter();

  const { data: userListApplicationData } = useGetUserApplicationList({
    page: {
      itemPerPage,
      noPage,
    },
    sortList: undefined,
  });

  const tableHeader: TableHeader[] = [
    ...HEADER_TABLE,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button variant="outlined" sx={{ px: 1, py: 0.5 }} textVariant="body4">
          {row.status}
        </Button>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(userManagement.USER_DETAIL, { processId: data.bucketProcessId });
            router.push(nextPath);
            closeNiceModal(modal.APPROVAL_MODAL);
          },
        },
      ],
      type: 'action',
    },
  ];

  const isLoading = false;
  return {
    isLoading,
    tableHeader,
    userListApplicationData,
  };
};

export default useApprovalModal;
