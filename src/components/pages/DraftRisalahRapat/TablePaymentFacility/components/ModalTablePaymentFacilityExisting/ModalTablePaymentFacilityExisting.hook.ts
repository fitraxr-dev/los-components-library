import { useState } from 'react';


import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModal from '@/helpers/showNiceModal';
import useSyncAriumHook from '@/hooks/services/useSyncArium';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import useGetPaymentFacilityAllExisting from '../../hooks/useGetFinancingFacilityAllExisting';
import useGetFinancingFacilityByPipelineId from '../../hooks/useGetFinancingFacilityByPipelineId';
import useGetMasterDebtorDetail from '../../hooks/useGetMasterDebtorDetail';
import useSyncTemenosHook from '../../hooks/useSyncTemenos';
import { modal } from '../../TablePaymentFacility.constants';

import { TABLE_PAYMENT_FACILITY_EXISTING } from './ModalTablePaymentFacilityExisting.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalTablePaymentFacilityExisting = () => {
  const { processId, debtorId, setFacilityId } = useIdentity();

  const [filter, setFilter] = useState({});
  const [selected, setSelected] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const modalId = modal.TABLE_PAYMENT_FACILITY_EXISTING;
  const { visible } = useModal(modalId);

  const payload = {
    filter: {
      ...filter?.filter,
      bucketProcessId: processId,
      debtorId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    },
    page: {
      itemPerPage: pageSize,
      noPage: pageNo,
    },
    searchDetail: filter?.searchDetail,
    sortList: filter?.sortList,
  };

  const { data: dataPaymentFacilityExisting, refetch } = useGetPaymentFacilityAllExisting(payload);

  const { data: currentFacilitiesData } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    },
    page: {
      itemPerPage: 1000,
      noPage: 1,
    },
  });

  const { data: debtorDetail } = useGetMasterDebtorDetail({
    debtorId: String(debtorId),
  });

  const { syncTemenos: syncTemenosHookFn } = useSyncTemenosHook(String(debtorId));
  const { mutateAsync: syncAriumHookFn } = useSyncAriumHook({});

  const currentFacilities = currentFacilitiesData?.contents || [];
  const currentFacilityKeys = currentFacilities
    .filter((facility) => facility.orderType === 'EXISTING' || facility.orderType === 'New From Existing')
    .map((facility) => facility.coreFacilityId);

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: (data) => {
        const isDisabled = currentFacilityKeys.includes(data.coreFacilityId);
        return isDisabled;
      },
      isSelected: (data) => {
        const isDisabled = currentFacilityKeys.includes(data.coreFacilityId);

        if (isDisabled) {
          return true;
        }

        return selected.some((el) => el.id === data.id);
      },
      key: 'checkbox',
      onSelectChange: (data) => {
        if (currentFacilityKeys.includes(data.coreFacilityId)) {
          return;
        }
        if (selected.some((el) => el.id === data.id)) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      type: 'checkbox',
    },
    ...TABLE_PAYMENT_FACILITY_EXISTING
  ];


  const popupFormFacilityHandler = () => {
    const facilityId = selected[0]?.facilityId;
    const id = selected[0]?.id;
    setFacilityId(facilityId);
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      existing: true,
      id,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      type: 'existing',
    });
    closeNiceModal(modalId);
  };

  const handleModalClose = () => {
    setFacilityId('');
    closeNiceModal(modalId);
  };

  const syncTemenos = async () => {
    try {
      await syncTemenosHookFn();
      await refetch();
    } catch (error: any) {
      const message = error?.data?.errorDetail || error?.message || 'Terjadi kesalahan saat melakukan sync temenos';
      showNiceModal('error', message);
    }
  };

  const syncArium = async () => {
    try {
      await syncAriumHookFn({ cif: debtorDetail.cif });
      await refetch();
    } catch (error: any) {
      const message = error?.data?.errorDetail || error?.message || 'Terjadi kesalahan saat melakukan sync arium';
      showNiceModal('error', message);
    }
  };

  return {
    currentFacilityKeys,
    dataPaymentFacilityExisting,
    filter,
    handleModalClose,
    modalId,
    pageNo,
    pageSize,
    popupFormFacilityHandler,
    selected,
    setFilter,
    setPageNo,
    setPageSize,
    syncArium,
    syncTemenos,
    tableHeader,
    visible,
  };
};

export default useModalTablePaymentFacilityExisting;
