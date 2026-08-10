import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { DPOP_DIVISION, roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';

import { useFastTrackRequestResultContext } from '../../../../FastTrackRequestResult.context';
import useDeleteDataShareholder from '../../../../hooks/useDeleteDataShareholder';

import useGetDebtorList from './hooks/useGetDebtorList';
import { TABLE_HEADER, TABLE_HEADER_REQUEST, TABLE_HEADER_SUMMARY } from './TableDebtor.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDebtor = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { processId, debtorId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { tableType, stepper } = useFastTrackContext();
  const {
    selectedDebtor,
    setSelectedDebtor,
    hasInitializedSelection,
    initializeTableSelection,
  } = useFastTrackRequestResultContext();
  const { divisionCode } = useDivision();
  const isDpop = Boolean(divisionCode?.includes(DPOP_DIVISION));
  const pathSegments = pathname.split('/');
  const isRequest = pathSegments?.[3] === 'request';
  const [{ currentRole }] = useApp();
  const [state] = useApp();
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedDebtorSet, setSelectedDebtorSet] = React.useState(() => new Set());
  const showAddButton = tableType === 'SUMMARY' ;
  const queryClient = useQueryClient();
  const isDpopProcessId = processId?.includes('CCD');
  const isSuperAdmin = (currentRole.includes(roles.MAKER) || currentRole.includes(roles.CHECKER)) && isDpopProcessId;
  const isTaskForce = state.currentPosition.includes('TASK_FORCE') && isDpopProcessId;


  const { data: debtorListData, isLoading } = useGetDebtorList({
    filter: {
      bucketProcessId: processId,
      debtorId,
      tableType,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });


  const anomalyRow = React.useCallback((data: any) => {
    if (data.isDocuments === true) {
      return {
        backgroundColor: '#FFF9C4',
      };
    }
    return {};
  }, []);

  // Sync selectedDebtorSet with context selectedDebtor
  React.useEffect(() => {
    if (selectedDebtor && Array.isArray(selectedDebtor)) {
      const validSelected = selectedDebtor.filter((debtor) =>
        debtor && debtor.id !== undefined && debtor.id !== null
      );
      const selectedIds = new Set(validSelected.map((debtor) => debtor.id));
      setSelectedDebtorSet(selectedIds);
    }
  }, [selectedDebtor]);

  // Auto-select items that have isSelected: true
  React.useEffect(() => {
    // Force check data dan auto-select ketika component mount
    if (debtorListData?.contents && Array.isArray(debtorListData.contents)) {
      const preSelectedItems = debtorListData.contents.filter((item) =>
        item && item.id && item.isSelected === true
      );

      if (preSelectedItems.length > 0 && !hasInitializedSelection.debtor) {
        initializeTableSelection('debtor', debtorListData.contents);
      }
    }
  }, []);

  const isAddButtonEnabled = React.useMemo(() => {
    if (!debtorListData?.contents || !Array.isArray(debtorListData.contents)) return false;

    const selectedItems = debtorListData.contents.filter((item) => item.isSelected === true);
    if (selectedItems.length === 0) return false;

    const atLeastOneSelectedIsDone = selectedItems.some((item) => item.isDone === true);

    return atLeastOneSelectedIsDone;
  }, [debtorListData?.contents]);

  const handleEditData = React.useCallback((row) => {
    router.push(`${pathname}/edit/debtor/${row.summaryId}`);
  }, [pathname, router]);

  const handleAddData = React.useCallback(() => {
    sessionStorage.removeItem('summaryDetailId');
    router.push(`${pathname}/add/debtor/${null}`);
  }, [pathname, router]);

  const handleViewDetailData = React.useCallback((row) => {
    NiceModal.show('DEBTOR_DETAIL', { id: row.summaryId, tableType });
  }, []);

  const handleUploadDocuments = React.useCallback((row) => {
    NiceModal.show(MODAL.MASTER.VERIFICATION_UPLOAD_DOCUMENT, {
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DEBTORDOCRESULT,
      module: TypeModule.FAST_TRACK,
      ownerId: row.debtorId,
      ownership: 'DEBTOR',
      process: TypeProcess.FAST_TRACK,
    });
  }, []);

  const toggleSelected = React.useCallback((row) => {
    if (!row || row.id === undefined || row.id === null) {
      console.warn('Invalid row in toggleSelected:', row);
      return;
    }

    setSelectedDebtor((prev) => {
      const validPrev = prev.filter((item) => item && item.id !== undefined && item.id !== null);
      const exists = validPrev.some((debtor) => debtor.id === row.id);
      if (exists) {
        const result = validPrev.filter((debtor) => debtor.id !== row.id);
        return result;
      } else {
        const result = [...validPrev, row];

        return result;
      }
    });
  }, [setSelectedDebtor]);

  const { mutateAsync: downloadWatermarkAsync } = useDownloadWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({ title: 'Data gagal disimpan', type: 'error' });
    },
    onSuccess: (data) => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        onClose: () => window.open(data?.data?.content, '_self'),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: deleteData } = useDeleteDataShareholder({
    onError: (error) => {
      const messageError = error?.message;
      showNiceModalV2({ title: messageError, type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data Berhasil Dihapus', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['fast-track', 'debtor']});
    },
  });


  const handleDeleteModal = (id: number) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => deleteData({ id }),
      title: 'Apakah anda yakin untuk menghapus data?',
    });
  };

  const handleOpenWatermarkModal = React.useCallback((row, action) => {
    NiceModal.show(MODAL.GLOBAL.WATERMARK, {
      onSave: async ({ watermark }: { watermark?: string }) => {
        closeNiceModal(MODAL.GLOBAL.WATERMARK);

        const encodedWatermark = watermark ? encodeURI(watermark) : undefined;
        const documents = Array.isArray(row.listDocuments) ? row.listDocuments : [];

        if (documents.length === 0) return;

        for (let i = 0; i < documents.length; i += 1) {
          const doc = documents[i];

          let dataTemp = {
            ...doc,
            watermark: encodedWatermark,
          };

          if (action === 'preview') {
            dataTemp.isPreview = true;
          }

          await downloadWatermarkAsync({
            ...dataTemp,
          });

          if (i < documents.length - 1) await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      },
    });
  }, [downloadWatermarkAsync]);

  const actionOptions = React.useMemo(() => {
    const commonDownload = {
      iconName: 'unduh',
      isDisabled: (row) => !row.listDocuments || row.listDocuments.length === 0,
      onClick: (row) => handleOpenWatermarkModal(row, 'download'),
    };
    const commonPreview = {
      iconName: 'preview-document',
      isDisabled: (row) => !row.listDocuments || row.listDocuments.length === 0,
      isUseOnclick: true,
      onClick: (row) => handleOpenWatermarkModal(row, 'preview'),
    };

    const viewDetail = {
      iconName: 'detail',
      onClick: handleViewDetailData,
    };


    if (isRequest && stepper?.from === 'CC_COMPLETED') {
      return [viewDetail];
    }

    if ((isDpop || isSuperAdmin) && stepper?.from === 'CC_COMPLETED') {
      return [viewDetail];
    }

    switch (tableType) {
      case 'REQUEST':
        return [viewDetail];
      case 'SUMMARY':
        return [
          viewDetail,
          {
            iconName: 'edit',
            isDisabled: (row) => !row.isSelected,
            onClick: handleEditData,
          },
          {
            iconName: 'delete',
            isDisabled: (row) => viewOnly || !row.isDeletable,
            isHidden: (row) => !row.isDeletable,
            onClick: (row) => handleDeleteModal(row?.summaryId),
          },
        ];
      case 'DOCUMENT_VERIFICATION':
        return [
          viewDetail,
        ];
      case 'UPLOAD_RESULT':
        return [
          {
            iconName: 'upload',
            isDisabled: (row) => viewOnly || !row.isSelected,
            onClick: handleUploadDocuments,
          },
          viewDetail,
        ];
      default:
        return [
          viewDetail,
        ];
    }
  }, [tableType, viewOnly, handleEditData, handleOpenWatermarkModal, handleUploadDocuments, handleViewDetailData]);

  const tableHeaderCore: TableHeader[] = React.useMemo(() => {


    if (isRequest && stepper?.from === 'CC_COMPLETED') {
      return [
        ...TABLE_HEADER_REQUEST,
        {
          key: 'lastCheckedDate',
          label: 'Last Checked Date',
          sx: { minWidth: '20vw' },
          type: 'date',
        },
      ];
    }

    if ((isDpop || isSuperAdmin) && stepper?.from === 'CC_COMPLETED') {
      return [...TABLE_HEADER_SUMMARY];
    }
    switch (tableType) {
      case 'REQUEST':
        return [
          ...TABLE_HEADER_REQUEST,
          {
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: { minWidth: '20vw' },
            type: 'date',
          },
        ];
      case 'DOCUMENT_VERIFICATION':
        return [
          ...TABLE_HEADER
        ];
      case 'UPLOAD_RESULT':
        return [...TABLE_HEADER];
      case 'SUMMARY':
        return [...TABLE_HEADER_SUMMARY];
      default:
        return [...TABLE_HEADER];
    }
  }, [tableType, viewOnly]);

  const tableHeader: TableHeader[] = React.useMemo(() => ([
    {
      isDisabled: () => viewOnly || isDpop || isSuperAdmin || isTaskForce,
      isSelected: (row) => selectedDebtorSet.has(row.id),
      key: 'checkbox',
      label: '',
      onSelectChange: (row) => toggleSelected(row),
      sx: { minWidth: '3vw' },
      type: 'checkbox',
    },
    ...tableHeaderCore,
    {
      key: 'action',
      label: 'Action',
      options: actionOptions,
      sx: { minWidth: '8vw' },
      type: 'action',
    },
  ]), [actionOptions, tableHeaderCore, selectedDebtorSet, toggleSelected]);

  return {
    anomalyRow,
    handleAddData,
    isAddButtonEnabled,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    showAddButton,
    tableData: debtorListData?.contents,
    tableHeader,
    totalPage: debtorListData?.page?.totalPage,
  };
};

export default useTableDebtor;
