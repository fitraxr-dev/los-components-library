'use client';
import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, useSearchParams } from 'next/navigation';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile } from '@/helpers/utils';
import useRegisterBucket from '@/hooks/services/useRegisterBucket';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import TextStyle from '@/components/shared/TextStyle';

import useDeleteShareholder from './hooks/useDeleteShareholder';
import useGetShareholderList from './hooks/useGetShareholderList';
import {
  tableHeaderList,
  tableHeaderListDocumentVerification,
  tableHeaderListMIP,
  tableHeaderListRequest,
  tableHeaderListSummary,
  tableHeaderListUploadResult,
} from './TableShareholder.constants';

import type { TableHeader } from '../../../Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';
import type { ShareholderDto } from '@/services/openapi/loan-service';


const useTableShareholder = (props: SmiComponentProps) => {
  const { processId }: { processId: string } = useParams();
  const { debtorId } = useIdentity();
  const [state, dispatch] = useApp();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const router = useCustomRouter();

  const { viewOnly } = useViewOnly();
  const { module, process } = props;
  const isRequestMode = process === TypeProcess.REQUEST;
  const { selectedShareholder = []} = state.pages;
  const params = useSearchParams();

  const isHaveFrom = params.get('from');

  let payload;

  if (module === TypeModule.MIP) {
    payload = {
      bucketProcessId: processId,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    };
  } else if (module === TypeModule.CREDIT_CHECKING) {
    payload = {
      bucketProcessId: processId,
      debtorId,
    };
  } else if (module === TypeModule.MAINTENANCE_DEBTOR) {
    payload = {
      filter: {
        bucketProcessId: processId,
        debtorId,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
      },
      page: {
        itemPerPage: itemPerPage,
        noPage: noPage,
      },
    };
  } else {
    payload = {
      filter: {
        debtorId,
      },
      page: {
        itemPerPage: itemPerPage,
        noPage: noPage,
      },
    };
  }

  const { data: {
    tableDataShareholder,
    shareholderPage,
    totalPercentage,
    totalShares,
  } } = useGetShareholderList(payload, module, process);

  const { mutate: registerBucket } = useRegisterBucket({
    onError: () => {
      showNiceModal('error', 'Terjadi kesalahan, coba lagi kembali.');
    },
    onSuccess: (data) => {
      router.push(
        replacePath(
          maintenanceDebtor.MAINTENANCE_DETAIL_PAGE,
          {
            processId: data.bucketProcessId,
          },
        )
      );
    },
  });

  const { mutate: deleteShareholder } = useDeleteShareholder({
    onError: () => showNiceModal('error', 'Theres a problem deleting this data'),
    onSuccess: () => showNiceModal('success', 'Shareholder berhasil dihapus'),
  });

  function handleAddShareholder() {
    if (module === MAINTENANCE_MODULE.MASTER_DATA && !isHaveFrom) {
      const payload: BucketCreateRequestDto = {
        debtorId: debtorId,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
      };
      registerBucket(payload);

    } else {
      NiceModal.show(MODAL.MASTER.SHAREHOLDER, { id: null, module });
    }
  };

  function handleEditShareholder(payload: any) {
    if (module === MAINTENANCE_MODULE.MASTER_DATA && !isHaveFrom) {
      const payload: BucketCreateRequestDto = {
        debtorId: debtorId,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
      };
      registerBucket(payload);

    } else {

      let id;
      if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        id = payload.shareholderId;
      } else {
        id = payload.id;
      }
      NiceModal.show(MODAL.MASTER.SHAREHOLDER, { id, isRequestMode, module, tableType: process });
    }
  };

  function handleDeleteShareholder(props: any) {
    let payload;
    if (module === TypeModule.MAINTENANCE_DEBTOR) {
      payload = {
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
        shareholderId: props.shareholderId,
      };
    } else {
      payload = { id: props.id };
    }

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteShareholder({ debtorId, module, payload }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  function handleDetailShareholder(payload: any) {
    let id;
    if (module === TypeModule.MAINTENANCE_DEBTOR) {
      id = payload.shareholderId;
    } else {
      id = payload.id;
    }
    NiceModal.show(MODAL.MASTER.SHAREHOLDER_DETAIL, { id, isRequestMode, module, tableType: process });
  };

  const handleUploadDocuments = (id: number) => {
    NiceModal.show(
      MODAL.MASTER.VERIFICATION_UPLOAD_DOCUMENT,
      {
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.SHAREHOLDERDOCRESULT,
        module: 'CREDIT_CHECKING',
        ownerId: id,
        ownership: 'DEBTOR',
        process: TypeProcess.CREDIT_CHECKING_DPOP,
        status,
      }
    );
  };

  const handleOnSelectedChange = (shareholder) => {

    const shareholderId = shareholder.id;
    let newSelectedShareholder = selectedShareholder;
    if (selectedShareholder.includes(shareholderId)) {
      newSelectedShareholder = selectedShareholder.filter((shareholder) => shareholder !== shareholderId);
    } else {
      newSelectedShareholder.push(shareholderId);
    }

    dispatch({
      data: {
        ...state.pages,
        selectedShareholder: newSelectedShareholder,
      },
      type: reducer.SET_PAGES,
    });
  };

  const getOptions = () => {
    let result: TableHeader['options'] = [];

    switch (process) {
      case TypeProcess.REQUEST:
        result = [
          {
            iconName: 'detail',
            onClick: (props: ShareholderDto) => handleDetailShareholder(props),
          },
          { iconName: 'preview-document',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (data) =>
              window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (props: ShareholderDto) =>
              downloadFile(props.listDocuments[0].document, props.listDocuments?.[0].fileName),
          },
        ];
        break;
      case TypeProcess.DOCUMENT_VERIFICATION:
        result = [
          {
            iconName: 'detail',
            onClick: (props: ShareholderDto) => handleDetailShareholder(props),
          },
          { iconName: 'preview-document',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (data) =>
              window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (props: ShareholderDto) =>
              downloadFile(props.listDocuments[0].document, props.listDocuments?.[0].fileName),
          },
        ];
        break;
      case TypeProcess.UPLOAD_RESULT:
        result = [
          {
            iconName: 'upload',
            isDisabled: viewOnly,
            onClick: (data) => {
              handleUploadDocuments(data.id);
            },
          },
          {
            iconName: 'detail',
            onClick: (props: ShareholderDto) => handleDetailShareholder(props),
          },
          { iconName: 'preview-document',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (data) =>
              window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (props: ShareholderDto) =>
              downloadFile(props.listDocuments[0].document, props.listDocuments?.[0].fileName),
          }
        ];
        break;
      case TypeProcess.SUMMARY:
        result = [
          {
            iconName: 'detail',
            onClick: (props: ShareholderDto) => handleDetailShareholder(props),
          },
          {
            iconName: 'edit',
            onClick: (props: ShareholderDto) => handleEditShareholder(props),
          },
          { iconName: 'preview-document',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (data) =>
              window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (props: ShareholderDto) =>
              downloadFile(props.listDocuments[0].document, props.listDocuments?.[0].fileName),
          }
        ];
        break;
      default:
        result = [
          {
            iconName: 'detail',
            onClick: (props: ShareholderDto) => handleDetailShareholder(props),
          },
          { iconName: 'preview-document',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (data) =>
              window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          },
          {
            iconName: 'download',
            isDisabled: (props: ShareholderDto) => !props.listDocuments?.length,
            onClick: (props: ShareholderDto) =>
              downloadFile(props.listDocuments[0].document, props.listDocuments?.[0].fileName),
          },
          {
            iconName: 'edit',
            isDisabled: viewOnly,
            onClick: (props: ShareholderDto) => handleEditShareholder(props),
          },
          {
            iconName: 'delete',
            isDisabled: viewOnly,
            onClick: (props: ShareholderDto) => handleDeleteShareholder(props),
          }
        ];
        break;
    }

    return result;
  };

  const getTableHeader = () => {
    let tableHeader: Array<TableHeader> = [];

    switch (process) {
      case TypeProcess.REQUEST:
        tableHeader = [
          {
            isDisabled: () => viewOnly,
            isSelected: (data) => selectedShareholder.some((selectedId) => selectedId === data.id),
            key: 'checkbox',
            onSelectChange: (data) => handleOnSelectedChange(data),
            sx: { minWidth: '4vw' },
            type: 'checkbox',
          },
          ...tableHeaderListRequest,
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
          },
        ];
        break;
      case TypeProcess.SUMMARY:
        tableHeader = [
          ...tableHeaderListSummary
        ];
        break;
      case TypeProcess.DOCUMENT_VERIFICATION:
        tableHeader = [
          ...tableHeaderListDocumentVerification,
          {
            key: 'percentage',
            label: '%',
            render: (row) => (
              <TextStyle variant="body4">
                {row.percentage}%
              </TextStyle>
            ),
            sx: { minWidth: '8vw' },
          },
          {
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: {
              minWidth: '12vw',
            },
          },
        ];
        break;
      case TypeProcess.UPLOAD_RESULT:
        tableHeader = [
          ...tableHeaderListUploadResult,
          {
            key: 'percentage',
            label: '%',
            render: (row) => (
              <TextStyle variant="body4">
                {row.percentage}%
              </TextStyle>
            ),
            sx: { minWidth: '8vw' },
          },
        ];
        break;
      case TypeProcess.MIP:
      case TypeProcess.MIP_ANALYST:
      case TypeProcess.MIP_REVIEW:
      case TypeProcess.MIP_REVIEW_REVISION:
        tableHeader = [
          ...tableHeaderListMIP
        ];
        break;
      default:
        tableHeader = [
          ...tableHeaderList,
          {
            key: 'percentage',
            label: '%',
            render: (row) => (
              <TextStyle variant="body4">
                {row.percentage}%
              </TextStyle>
            ),
            sx: { minWidth: '8vw' },
          },
        ];
        break;
    }

    return tableHeader;
  };

  const tableHeaderShareholder: Array<TableHeader> = [
    ...getTableHeader(),
    {
      key: 'action',
      label: 'Action',
      options: getOptions(),
      sx: { minWidth: '10vw' },
      type: 'action',
    }];

  const showFooter = (module !== TypeModule.CREDIT_CHECKING && module !== TypeModule.MIP);

  return {
    handleAddShareholder,
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    shareholderPage,
    showFooter,
    tableDataShareholder,
    tableHeaderShareholder,
    totalPercentage,
    totalShares,

  };
};

export default useTableShareholder;
