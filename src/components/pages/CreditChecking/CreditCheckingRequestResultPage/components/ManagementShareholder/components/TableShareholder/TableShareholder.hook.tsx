'use client';

import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { BUSINESS_DIVISION, DPOP_DIVISION, roles } from '@/configs/constants';
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

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import TextStyle from '@/components/shared/TextStyle';

import { useCreditCheckingRequestResultContext } from '../../../../CreditCheckingRequestResult.context';
import useDeleteDataShareholder from '../../../../hooks/useDeleteDataShareholder';

import useGetShareholderList from './hooks/useGetShareholderList';
import {
  MODAL_SHAREHOLDER,
  TABLE_HEADER,
  TABLE_HEADER_DOCUMENT_VERIFICATION,
  TABLE_HEADER_REQUEST,
  TABLE_HEADER_SUMMARY,
  TABLE_HEADER_UPLOAD_RESULT,
} from './TableShareholder.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ShareholderDto } from '@/services/openapi/loan-service';


const useTableShareholder = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { processId, debtorId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const { tableType, stepper } = useCreditCheckingContext();
  const {
    selectedShareholder,
    setSelectedShareholder,
    hasInitializedSelection,
    initializeTableSelection,
  } = useCreditCheckingRequestResultContext();
  const queryClient = useQueryClient();
  const { divisionCode } = useDivision();
  const isDpop = Boolean(divisionCode?.includes(DPOP_DIVISION));
  const isBussiness = Boolean(divisionCode?.includes(BUSINESS_DIVISION));
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedShareholderSet, setSelectedShareholderSet] = React.useState(() => new Set());
  const showAddButton = tableType === 'SUMMARY';
  const pathSegments = pathname.split('/');
  const isRequest = pathSegments?.[3] === 'request';
  const [{ currentRole }] = useApp();
  const [state] = useApp();
  const isDpopProcessId = processId?.includes('CCD');
  const isSuperAdmin = (currentRole.includes(roles.MAKER) || currentRole.includes(roles.CHECKER)) && isDpopProcessId;
  const isTaskForce = state.currentPosition.includes('TASK_FORCE') && isDpopProcessId;


  const {
    data: shareholderListData,
    isLoading,
  } = useGetShareholderList({
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


  // Sync selectedShareholderSet with context selectedShareholder
  React.useEffect(() => {
    if (selectedShareholder && Array.isArray(selectedShareholder)) {
      const validSelected = selectedShareholder.filter((shareholder) =>
        shareholder && shareholder.id !== undefined && shareholder.id !== null
      );
      const selectedIds = new Set(validSelected.map((shareholder) => shareholder.id));
      setSelectedShareholderSet(selectedIds);
    }
  }, [selectedShareholder]);

  // Auto-select items that have isSelected: true in tableData
  React.useEffect(() => {
    if (hasInitializedSelection.shareholder) return;

    if (shareholderListData?.contents && Array.isArray(shareholderListData.contents)) {
      initializeTableSelection('shareholder', shareholderListData.contents);
    }
  }, [shareholderListData?.contents, hasInitializedSelection.shareholder, initializeTableSelection]);

  const isAddButtonEnabled = React.useMemo(() => {
    if (!shareholderListData?.contents || !Array.isArray(shareholderListData.contents)) return false;

    const selectedItems = shareholderListData.contents.filter((item) => item.isSelected === true);
    if (selectedItems.length === 0) return false;

    const atLeastOneSelectedIsDone = selectedItems.some((item) => item.isDone === true);

    return atLeastOneSelectedIsDone;
  }, [shareholderListData?.contents]);

  const toggleSelected = React.useCallback((row) => {

    if (!row || row.id === undefined || row.id === null) {
      console.warn('Invalid row in toggleSelected:', row);
      return;
    }


    setSelectedShareholder((prev) => {
      const validPrev = prev.filter((item) => item && item.id !== undefined && item.id !== null);
      const exists = validPrev.some((shareholder) => shareholder.id === row.id);
      if (exists) {
        const result = validPrev.filter((shareholder) => shareholder.id !== row.id);

        return result;
      } else {
        const result = [...validPrev, row];

        return result;
      }
    });
  }, [setSelectedShareholder]);

  const handleEditData = React.useCallback((row) => {
    sessionStorage.setItem('shareholderCode', row.shareholderCode);
    router.push(`${pathname}/edit/shareholder/${row.summaryId}`);
  }, [pathname, router]);

  const handleAddData = React.useCallback(() => {
    sessionStorage.removeItem('summaryDetailId');
    router.push(`${pathname}/add/shareholder/${null}`);
  }, [pathname, router]);

  const handleViewDetailData = React.useCallback((row) => {
    sessionStorage.setItem('shareholderCode', row.shareholderCode);
    NiceModal.show(MODAL_SHAREHOLDER.SHAREHOLDER_DETAIL, { id: row.summaryId, tableType });
  }, [tableType]);

  const handleUploadDocuments = React.useCallback((row) => {
    NiceModal.show(MODAL.MASTER.VERIFICATION_UPLOAD_DOCUMENT, {
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SHAREHOLDERDOCRESULT,
      module: TypeModule.CREDIT_CHECKING,
      ownerId: row.shareholderCode,
      ownership: 'DEBTOR',
      process: TypeProcess.CREDIT_CHECKING_DPOP,
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
      queryClient.invalidateQueries({ queryKey: ['credit-checking', 'shareholder']});
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

  const { totalShares, totalPercentage } = React.useMemo(() => {
    if (!shareholderListData?.contents || !Array.isArray(shareholderListData.contents)) {
      return { totalPercentage: 0, totalShares: 0 };
    }

    const totals = shareholderListData.contents.reduce(
      (acc, shareholder) => {
        const shares = Number.parseFloat(shareholder.shares?.replace(/,/g, '') || '0');
        const percentage = Number.parseFloat(shareholder.percentage || '0');

        return {
          totalPercentage: acc.totalPercentage + percentage,
          totalShares: acc.totalShares + shares,
        };
      },
      { totalPercentage: 0, totalShares: 0 },
    );

    return totals;
  }, [shareholderListData?.contents]);

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
      case 'UPLOAD_RESULT':
        return [
          {
            iconName: 'upload',
            isDisabled: (row) => viewOnly || !row.isSelected,
            onClick: handleUploadDocuments,
          },
          viewDetail,
        ];
      case 'DOCUMENT_VERIFICATION':
        return [viewDetail];
      default:
        return [
          viewDetail,
          {
            iconName: 'edit',
            isDisabled: (props) => !props.isSelected || viewOnly,
            onClick: (props: ShareholderDto) => handleEditData(props),
          },
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
            key: 'percentage',
            label: '%',
            render: (row) => (
              <TextStyle variant="body4">
                {row.percentage}%
              </TextStyle>
            ),
            sx: { minWidth: '6vw' },
          },
          {
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: {
              minWidth: '12vw',
            },
            type: 'date',
          },
        ];
      case 'DOCUMENT_VERIFICATION':
        return [
          ...TABLE_HEADER_DOCUMENT_VERIFICATION,
          {
            key: 'percentage',
            label: '%',
            render: (row) => (
              <TextStyle variant="body4">
                {row.percentage}%
              </TextStyle>
            ),
            sx: { minWidth: '6vw' },
          },
          {
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: {
              minWidth: '12vw',
            },
            type: 'date',
          },
        ];
      case 'UPLOAD_RESULT':
        return [
          ...TABLE_HEADER_UPLOAD_RESULT,
          {
            key: 'percentage',
            label: '%',
            render: (row) => (
              <TextStyle variant="body4">
                {row.percentage}%
              </TextStyle>
            ),
            sx: { minWidth: '6vw' },
          },
          {
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: {
              minWidth: '12vw',
            },
            type: 'date',
          },
        ];
      case 'SUMMARY':
        return [...TABLE_HEADER_SUMMARY];
      default:
        return [
          ...TABLE_HEADER,
          {
            key: 'percentage',
            label: '%',
            render: (row) => (
              <TextStyle variant="body4">
                {row.percentage}%
              </TextStyle>
            ),
            sx: { minWidth: '6vw' },
          },
          {
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: {
              minWidth: '12vw',
            },
            type: 'date',
          },
        ];
    }
  }, [tableType, viewOnly]);

  const tableHeader: TableHeader[] = React.useMemo(() => ([
    {
      isDisabled: () => viewOnly || isDpop || isSuperAdmin || isTaskForce,
      isSelected: (row) => selectedShareholderSet.has(row.id),
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
  ]), [actionOptions, tableHeaderCore, selectedShareholderSet, toggleSelected]);

  return {
    anomalyRow,
    handleAddData,
    isAddButtonEnabled,
    isBussiness,
    isLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    showAddButton,
    tableData: shareholderListData?.contents,
    tableHeader,
    totalPage: shareholderListData?.page?.totalPage,
    totalPercentage,
    totalShares,
  };
};

export default useTableShareholder;
