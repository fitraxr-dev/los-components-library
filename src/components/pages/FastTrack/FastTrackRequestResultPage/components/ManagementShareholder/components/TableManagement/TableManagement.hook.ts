'use client';

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

import useGetManagementList from './hooks/useGetManagementList';
import { TABLE_HEADER, TABLE_HEADER_REQUEST, TABLE_HEADER_SUMMARY } from './TableManagement.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableManagement = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { processId, debtorId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { tableType, stepper } = useFastTrackContext();
  const {
    selectedManagement,
    setSelectedManagement,
    hasInitializedSelection,
    initializeTableSelection,
  } = useFastTrackRequestResultContext();
  const { divisionCode } = useDivision();
  const isDpop = Boolean(divisionCode?.includes(DPOP_DIVISION));
  const pathSegments = pathname.split('/');
  const isRequest = pathSegments?.[3] === 'request';
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedManagementSet, setSelectedManagementSet] = React.useState(() => new Set());
  const showAddButton = tableType === 'SUMMARY';
  const queryClient = useQueryClient();
  const [{ currentRole }] = useApp();
  const [state] = useApp();
  const isDpopProcessId = processId?.includes('CCD');
  const isSuperAdmin = (currentRole.includes(roles.MAKER) || currentRole.includes(roles.CHECKER)) && isDpopProcessId;
  const isTaskForce = state.currentPosition.includes('TASK_FORCE') && isDpopProcessId;

  const { data: managementListData, isLoading } = useGetManagementList({
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

  // Sync selectedManagementSet with context selectedManagement
  React.useEffect(() => {
    if (selectedManagement && Array.isArray(selectedManagement)) {
      const validSelected = selectedManagement.filter((management) =>
        management && management.id !== undefined && management.id !== null
      );
      const selectedIds = new Set(validSelected.map((management) => management.id));
      setSelectedManagementSet(selectedIds);
    }
  }, [selectedManagement]);

  // Auto-select items that have isSelected: true in tableData
  React.useEffect(() => {
    if (hasInitializedSelection.management) return;

    if (managementListData?.contents && Array.isArray(managementListData.contents)) {
      initializeTableSelection('management', managementListData.contents);
    }
  }, [managementListData?.contents, hasInitializedSelection.management, initializeTableSelection]);


  const isAddButtonEnabled = React.useMemo(() => {
    if (!managementListData?.contents || !Array.isArray(managementListData.contents)) return false;

    const selectedItems = managementListData.contents.filter((item) => item.isSelected === true);
    if (selectedItems.length === 0) return false;

    const atLeastOneSelectedIsDone = selectedItems.some((item) => item.isDone === true);

    return atLeastOneSelectedIsDone;
  }, [managementListData?.contents]);

  const handleEditData = React.useCallback((row) => {
    sessionStorage.setItem('managementCode', row.managementCode);
    router.push(`${pathname}/edit/management/${row.summaryId}`);
  }, [pathname, router]);

  const handleAddData = React.useCallback(() => {
    sessionStorage.removeItem('summaryDetailId');
    router.push(`${pathname}/add/management/${null}`);
  }, [pathname, router]);

  const handleViewDetailData = React.useCallback((row) => {
    sessionStorage.setItem('managementCode', row.managementCode);
    NiceModal.show('CC_MANAGEMENT_DETAIL', { id: row.summaryId, tableType });
  }, [tableType]);

  const handleUploadDocuments = React.useCallback((row) => {
    NiceModal.show(MODAL.MASTER.VERIFICATION_UPLOAD_DOCUMENT, {
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.MANAGEMENTDOCRESULT,
      module: TypeModule.FAST_TRACK,
      ownerId: row.managementCode,
      ownership: 'DEBTOR',
      process: TypeProcess.FAST_TRACK,
    });
  }, []);

  const anomalyRow = React.useCallback((data: any) => {

    if (data.isDocuments === true) {
      return {
        backgroundColor: '#FFF9C4',
      };
    }
    return {};
  }, []);

  const toggleSelected = React.useCallback((row) => {

    if (!row || row.id === undefined || row.id === null) {
      console.warn('Invalid row in toggleSelected:', row);
      return;
    }

    setSelectedManagement((prev) => {
      const validPrev = prev.filter((item) => item && item.id !== undefined && item.id !== null);
      const exists = validPrev.some((management) => management.id === row.id);
      if (exists) {
        const result = validPrev.filter((management) => management.id !== row.id);
        return result;
      } else {
        const result = [...validPrev, row];

        return result;
      }
    });
  }, [setSelectedManagement]);

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
      queryClient.invalidateQueries({ queryKey: ['fast-track', 'management']});
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

  const handleOpenWatermarkModal = React.useCallback((row) => {
    NiceModal.show(MODAL.GLOBAL.WATERMARK, {
      onSave: async ({ watermark }: { watermark?: string }) => {
        closeNiceModal(MODAL.GLOBAL.WATERMARK);

        const encodedWatermark = watermark ? encodeURI(watermark) : undefined;
        const documents = Array.isArray(row.listDocuments) ? row.listDocuments : [];

        if (documents.length === 0) return;

        for (let i = 0; i < documents.length; i += 1) {
          const doc = documents[i];

          await downloadWatermarkAsync({
            ...doc,
            watermark: encodedWatermark,
          });

          if (i < documents.length - 1) await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      },
    });
  }, [downloadWatermarkAsync]);

  const actionOptions = React.useMemo(() => {
    const downloadDocument = {
      iconName: 'unduh',
      isDisabled: (row) => !row.listDocuments || row.listDocuments.length === 0,
      onClick: handleOpenWatermarkModal,
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
          {
            iconName: 'edit',
            isDisabled: (props) => !props.isSelected || viewOnly,
            onClick: (props) => handleEditData(props),
          },
        ];
    }
  }, [tableType, viewOnly, handleEditData, handleOpenWatermarkModal, handleUploadDocuments, handleViewDetailData]);

  const tableHeaderCore: TableHeader[] = React.useMemo(() => {

    if (isRequest && stepper?.from === 'CC_COMPLETED') {
      return [
        ...TABLE_HEADER_REQUEST,
      ];
    }

    if ((isDpop || isSuperAdmin) && stepper?.from === 'CC_COMPLETED') {
      return [...TABLE_HEADER_SUMMARY];
    }
    switch (tableType) {
      case 'REQUEST':
        return [...TABLE_HEADER_REQUEST];
      case 'DOCUMENT_VERIFICATION':
        return [...TABLE_HEADER];
      case 'UPLOAD_RESULT':
        return [...TABLE_HEADER];
      case 'SUMMARY':
        return [...TABLE_HEADER_SUMMARY];
      default:
        return [...TABLE_HEADER];
    }
  }, [tableType]);

  const tableHeader: TableHeader[] = React.useMemo(() => ([
    {
      isDisabled: () => viewOnly || isDpop || isSuperAdmin || isTaskForce,
      isSelected: (row) => selectedManagementSet.has(row.id),
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
  ]), [actionOptions, tableHeaderCore, selectedManagementSet, toggleSelected]);


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
    tableData: managementListData?.contents,
    tableHeader,
    totalPage: managementListData?.page?.totalPage,
  };
};

export default useTableManagement;
