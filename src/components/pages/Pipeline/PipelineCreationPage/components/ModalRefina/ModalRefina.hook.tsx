import { useEffect, useState } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetFinancingFacilityByPipelineId from '@/components/shared/SmiSection/FinancingFacilitySummary/hooks/useGetFinancingFacilityByPipelineId';

import useGetRefinaByPipelineProcessId from '../../hooks/useGetRefinaByProcessId';
import useSyncRefina from '../../hooks/useSyncRefina';

import type { RefinaHookProps } from './ModalRefina.props';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalRefina = (props: RefinaHookProps) => {
  const { modalId } = props;
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const { processId, debtorId } = useIdentity();
  const { recordActivity } = useRecordLog();


  const { data: facilityListData } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.PIPELINE,
      process: TypeModule.PIPELINE,
    },
    page: {
      itemPerPage: 5,
      noPage: 1,
    },
  });

  const { data, isFetching: isLoading } = useGetRefinaByPipelineProcessId({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: {},
    sortList: {},
  });

  // Record activity when refina list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view refina list in modal',
      });
    }
  }, [data, processId, recordActivity]);

  const [lastSyncPayload, setLastSyncPayload] = useState<any>(null);

  const { mutate: syncRefina, isPending: syncIsLoading } = useSyncRefina({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      // Record activity for syncing refina
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          debtorId: lastSyncPayload?.debtorId,
          refinaId: lastSyncPayload?.refinaId,
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully synced refina data',
      });

      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const listMasterDebtor = data?.contents?.map((debtor) => ({
    ...debtor,
    cif: debtor.cif ?? '-',
    groupName: debtor.groupName || '-',
    npwp: debtor.npwp ?? '-',
  }));

  const totalPage = data?.data?.page.totalPage ?? 1;

  const tableHeader: TableHeader[] = [
    {
      isDisabled: (data) => selected.some((el) => el.refinaId !== data.refinaId),
      isSelected: (data) => selected.some((el) => el.refinaId === data.refinaId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.refinaId === data.refinaId)) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtorName',
      label: 'Nama Debitur',
    },
    {
      key: 'refinaId',
      label: 'ID Pengajuan Refina',
    },
    {
      key: 'product',
      label: 'Produk',
    },
    {
      key: 'projectName',
      label: 'Nama Proyek',
    },
    {
      key: 'staffName',
      label: 'Nama RM',
    },
    {
      key: 'createdAt',
      label: 'Tanggal Pengajuan',
    },
    {
      key: 'statusLabel',
      label: 'Status Refina',
      sx: {
        minWidth: '9vw',
      },
      type: 'status',
    },
  ];

  const handleSaveRefina = () => {
    const payload = {
      bucketProcessId: processId,
      debtorId: debtorId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      refinaId: selected[0].refinaId,
    };

    if (facilityListData?.contents.length > 0) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit() {
          setLastSyncPayload(payload);
          syncRefina(payload);
        },
        submitText: 'Ya',
        title: 'Data Fasilitas Pembiayaan Anda akan digantikan dengan data dari Refina, apakah Anda yakin akan melanjutkan?',
        type: 'warning',
      });
    } else {
      setLastSyncPayload(payload);
      syncRefina(payload);
    }
    closeNiceModal(modalId);
  };

  return {
    handleSaveRefina,
    isLoading,
    listMasterDebtor,
    page,
    pageSize,
    selected,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};
