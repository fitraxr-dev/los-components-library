import NiceModal from '@ebay/nice-modal-react';

import { MASTER_PARAMETER, accessid } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterRateList from './hooks/useGetParameterRateList';
import { MODAL, TABLE_HEADER } from './List.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const { isMaker } = useMasterParameter();
  const router = useCustomRouter();

  const canAdd = useCheckAccess(accessid.PARAMETER_RATE_CREATE);
  const canEdit = useCheckAccess(accessid.PARAMETER_RATE_UPDATE);
  const canView = useCheckAccess(accessid.PARAMETER_RATE_VIEW);
  const canDelete = useCheckAccess(accessid.PARAMETER_RATE_DELETE);

  const { data: parameterRateData, isFetching: isLoading } = useGetParameterRateList();

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: (data) => [
        ...(canView ? [{
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_RATE_DETAIL_PAGE, {
              mode: 'detail',
              processId: data?.id,
            });
            router.push(nextPath);
          },
        }] : []),
        ...(canEdit && data?.isEditable ? [{
          iconName: 'edit',
          onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak',
              onSubmit: () => {
                const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_RATE_DETAIL_PAGE, {
                  mode: 'edit',
                  processId: data?.id,
                });
                router.push(nextPath);
              },
              submitText: 'Ya',
              title: 'Apakah anda yakin ingin mengedit data ini?',
              type: 'warning',
            });
          },
        }] : []),
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  const handleOpenApprovalStatusModal = () => {
    NiceModal.show(MODAL.APPROVAL_STATUS_MODAL);
  };

  const handleOpenHistoryRateModal = () => {
    NiceModal.show(MODAL.HISTORY_RATE_MODAL);
  };

  return {
    canAdd,
    handleOpenApprovalStatusModal,
    handleOpenHistoryRateModal,
    isLoading,
    tableData: parameterRateData?.contents,
    tableHeader,
  };
};

export default useList;
