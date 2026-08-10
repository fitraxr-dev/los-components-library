import { useEffect, useState } from 'react';

import { roles } from '@/configs/constants';
import { MAINTENANCE_STATUS } from '@/configs/constants/maintenance';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useMasintonForm from '@/hooks/useMasintonForm';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';

import { HEADER_TABLE } from './ApprovalMasterModal.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalModal = (modalId: string) => {
  const router = useCustomRouter();
  const [{ currentRole }] = useApp();
  const { setDebtorId } = useIdentity();
  const { setViewOnly } = useViewOnly();
  const [contentList, setContentList] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const shouldRenderForm = (status: string) => {

    if (status === MAINTENANCE_STATUS.APPROVED_MAINTENANCE_DEBTOR) {
      return false;
    }

    if (currentRole.includes(roles.RM)) {
      return status === MAINTENANCE_STATUS.MAINTENANCE_DEBTOR_CREATION;
    }

    if (currentRole.includes(roles.TL)) {
      return status === MAINTENANCE_STATUS.WAITING_APPROVAL_TL_MAINTENANCE_DEBTOR;
    }

    return false;
  };

  const tableHeader: TableHeader[] = [
    ...HEADER_TABLE,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
        >
          {row.status ?? '-'}
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
            closeNiceModal(modalId);
            setViewOnly(shouldRenderForm(data?.status));
            setDebtorId(data.debtorId);
            router.push(
              replacePath(
                maintenanceDebtor.MAINTENANCE_DETAIL_PAGE,
                {
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        },
      ],
      type: 'action',
    },
  ];

  return {
    contentList,
    data: { contents: [], page: { totalPage: 0 } }, // dummy
    isLoading: false, // dummy
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useApprovalModal;
