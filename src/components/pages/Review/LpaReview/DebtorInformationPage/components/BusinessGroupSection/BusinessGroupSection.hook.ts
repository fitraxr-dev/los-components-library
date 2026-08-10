'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetCurrentModule from '../../../hooks/useGetCurrentModule';
import { modal } from '../../DebtorInformation.constants';
import useDeleteBusinessGroup from '../../hooks/useDeleteBusinessGroup';
import useGetBusinessGroup from '../../hooks/useGetBusinessGroup';
import useGetMaintenanceGroupList from '../../hooks/useGetMaintenanceGroupList';


export const useBusinessGroupTable = () => {
  const { processId, parentId, debtorId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { module, process } = useGetCurrentModule();


  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetMaintenanceGroupList({
    filter: {
      bucketProcessId: parentId,
      debtorId: debtorId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.MIP_REVIEW,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  // Record activity when business group list is loaded
  useEffect(() => {
    if (businessGroupListData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view business group list in lpa review',
      });
    }
  }, [businessGroupListData, processId, module, process, recordActivity]);

  const { isPending: deleteBusinessGroupLoading, mutate: deleteBusinessGroup } = useDeleteBusinessGroup({
    onSuccess: () => {
      // Record activity for deleting business group
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted business group',
      });

      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const { data: bucketBusinessGroup } = useGetBusinessGroup({
    bucketProcessId: processId,
    module,
    process,
  });

  const businessGroupListContents = businessGroupListData?.contents;
  const businessGroupListPage = businessGroupListData?.page;

  const handleOpenAddModal = () => {
    // Record activity for viewing add business group modal
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: 'view add business group modal',
    });

    NiceModal.show(modal.GROUP_BUSINESS);
  };

  const handleDeleteGroupBusiness = (data: any) => {
    const { id } = data;
    showNiceModalV2({ cancelText: 'Tidak',
      onSubmit: () => deleteBusinessGroup({
        id: id,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus data Digital Memo?',
      type: 'warning' });
  };

  return {
    bucketBusinessGroup,
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    deleteBusinessGroupLoading,
    handleDeleteGroupBusiness,
    handleOpenAddModal,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};
