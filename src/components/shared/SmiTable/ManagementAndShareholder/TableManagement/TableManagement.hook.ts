import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, useSearchParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useRegisterBucket from '@/hooks/services/useRegisterBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDownloadWatermark from '@/hooks/useDownloadWatermark';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import useDeleteManagement from './hooks/useDeleteManagement';
import useGetManagementList from './hooks/useGetManagementList';
import {
  tableHeaderList,
  tableHeaderListMIP,
  tableHeaderListRequest,
  tableHeaderListSummary,
  tableHeaderListUploadResult,
} from './TableManagement.constants';

import type { TableManagementProps } from './TableManagement.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';
import type { ManagementDto } from '@/services/openapi/loan-service';


const useTableManagement = ({
  module,
  onSelectedChange,
  selected,
  status,
  viewOnly,
  tableType,
}: TableManagementProps) => {
  const { processId }: { processId: string } = useParams();
  const [{ pages, currentRole }] = useApp();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const router = useCustomRouter();
  const { debtorId } = useIdentity();

  const params = useSearchParams();
  const isHaveFrom = params.get('from');

  let payload;

  if (module === MAINTENANCE_MODULE.MIP) {
    payload = {
      bucketProcessId: processId,
      module: pages.mipModule,
      process: pages.mipProcess,
    };
  } else if (module?.includes('CREDIT_CHECKING')) {
    payload = {
      bucketProcessId: processId,
      debtorId,
    };
  } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
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

  const shouldRender = currentRole.includes(roles.RM);
  // Get Management Data
  const { data: {
    managementList,
    managementPage,
  }, isLoading } = useGetManagementList(payload, module, tableType);


  const tableDataManagement = managementList.map(((item) => ({
    ...item,
    collectibility: item.collectabilityLabel ?? '-',
    googleResult: item.googleResult ?? '-',
    jobPositionLabel: item.jobPositionLabel ?? '-',
    lastCheckedDate: item.lastCheckedDate ? formatDate(item.lastCheckedDate) : '-',
    nik: item.nik ?? '-',
    npwp: item.npwp ?? '-',
  })));

  const { mutate: deleteManagement } = useDeleteManagement({
    onError: () => showNiceModalV2({ type: 'error' }),
    onSuccess: () => showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' }),
  });


  const handleDeleteData = async (props: any) => {
    let payload;
    if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
      payload = {
        bucketProcessId: processId,
        managementId: props.managementId,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
      };
    } else {
      payload = { id: props.id };
    }
    showNiceModal('confirm', 'Apakah anda yakin ingin menghapus data?', () => deleteManagement({ debtorId, module, payload }), 'Tidak', 'Ya');
  };

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
      );},
  });

  const handleEditData = async (props: any) => {

    if (module === MAINTENANCE_MODULE.MASTER_DATA) {
      const payload: BucketCreateRequestDto = {
        debtorId: debtorId,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
      };
      registerBucket(payload);
    } else {
      let id;
      if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        id = props.managementId;
      } else {
        id = props.id;
      }
      NiceModal.show(MODAL.MASTER.MANAGEMENT, {
        id,
        module,
        tableType,
      });
    }
  };

  const handleViewDetailData = (props: any) => {

    let id;
    if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
      id = props.managementId;
    } else {
      id = props.id;
    }
    NiceModal.show(MODAL.MASTER.MANAGEMENT_DETAIL, {
      id,
      module,
      tableType,
    });
  };

  const handleNewData = () => {
    if (module === MAINTENANCE_MODULE.MASTER_DATA && !isHaveFrom) {

      const payload: BucketCreateRequestDto = {
        debtorId: debtorId,
        module: 'MAINTENANCE_DEBTOR',
        process: 'MAINTENANCE_DEBTOR',
      };
      registerBucket(payload);

    } else {
      NiceModal.show(MODAL.MASTER.MANAGEMENT, { module });
    }
  };

  const handleUploadDocuments = (data) => {
    NiceModal.show(
      MODAL.MASTER.VERIFICATION_UPLOAD_DOCUMENT,
      {
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.MANAGEMENTDOCRESULT,
        module: 'CREDIT_CHECKING',
        ownerId: data.managementCode,
        ownership: 'DEBTOR',
        process: TypeProcess.CREDIT_CHECKING_DPOP,
        status,
      }
    );
  };

  const handleOnSelectedChange = (data) => {
    // Check if the clicked data is already in the selected array
    const selectedIndex = selected?.findIndex((item) => item === data.id);

    if (selectedIndex === -1) {
      // If not found, add the clicked data to the selected array
      onSelectedChange([...selected, data.id]);
    } else {
      // If found, remove the clicked data from the selected array
      const updatedSelected = [...selected];
      updatedSelected.splice(selectedIndex, 1);
      onSelectedChange(updatedSelected);
    }
  };

  const { mutate: downloadWatermark } = useDownloadWatermark({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      closeNiceModal(MODAL.GLOBAL.WATERMARK);
      showNiceModalV2({
        onClose: () => {
          window.open(data?.data?.content, '_self');
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });


  const handleOpenWatermarkModal = (data: any) => {
    NiceModal.show(MODAL.GLOBAL.WATERMARK, {
      onSave: async ({ watermark }) => {
        closeNiceModal(MODAL.GLOBAL.WATERMARK);

        if (watermark) {
          watermark = encodeURI(watermark);
        }

        const documentsToDownload = data.listDocuments?.length > 0
          ? data.listDocuments
          : [];

        if (documentsToDownload.length > 0) {
          documentsToDownload.reduce((promise, documentData, index) => {
            return promise.then(() => {
              downloadWatermark({
                ...documentData,
                watermark: watermark,
              });

              // add delay
              if (index < documentsToDownload.length - 1) {
                return new Promise((resolve) => setTimeout(resolve, 1000));
              }
              return Promise.resolve();
            });
          }, Promise.resolve());
        }
      },
    });
  };

  const getOptions = () => {
    let result: TableHeader['options'] = [];

    switch (tableType) {
      case 'REQUEST':
        result = [
          { iconName: 'detail',
            onClick: (props: ManagementDto) => handleViewDetailData(props),
          },
          // { iconName: 'preview-document',
          //   isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
            onClick: (props: ManagementDto) => handleOpenWatermarkModal(props),

          },
        ];
        break;
      case 'SUMMARY':
        result = [
          {
            iconName: 'detail',
            onClick: (props: ManagementDto) => handleViewDetailData(props),
          },
          {
            iconName: 'edit',
            isDisabled: (props) => !props.isSelected || viewOnly,
            onClick: (props: any) => handleEditData(props),
          },
          // { iconName: 'preview-document',
          //   isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
            onClick: (props: ManagementDto) => handleOpenWatermarkModal(props),

          },
        ];
        break;
      case 'UPLOAD_RESULT':
        result = [
          {
            iconName: 'upload',
            isDisabled: viewOnly,
            onClick: (data) => {
              handleUploadDocuments(data);
            },
          },
          {
            iconName: 'detail',
            onClick: (props: ManagementDto) => handleViewDetailData(props),
          },
          // { iconName: 'preview-document',
          //   isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
            onClick: (props: ManagementDto) => handleOpenWatermarkModal(props),

          },
        ];
        break;
      case 'DOCUMENT_VERIFICATION':
        result = [
          {
            iconName: 'detail',
            onClick: (props: ManagementDto) => handleViewDetailData(props),
          },
          // { iconName: 'preview-document',
          //   isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
          //   // onClick: (data) =>
          //   //   window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
            onClick: (props: ManagementDto) => handleOpenWatermarkModal(props),

          },
        ];
        break;
      default:
        result = [
          { iconName: 'detail',
            onClick: (props: ManagementDto) => handleViewDetailData(props),
          },
          {
            iconName: 'edit',
            isDisabled: (props) => !props.isSelected || viewOnly,
            onClick: (props: ManagementDto) => handleEditData(props),
          },
          {
            iconName: 'delete',
            isDisabled: viewOnly,
            onClick: (props: ManagementDto) => handleDeleteData(props),
          },
          // { iconName: 'preview-document',
          //   isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: ManagementDto) => viewOnly || !props.listDocuments?.length,
            onClick: (props: ManagementDto) => handleOpenWatermarkModal(props),

          },
        ];
        break;
    }

    return result;
  };

  const getTableHeader = () => {
    let tableHeader: Array<TableHeader> = [];
    switch (tableType) {
      case 'REQUEST':
        tableHeader = [
          {
            isDisabled: () => viewOnly,
            isSelected: (data) => selected.some((el) => el === data.id),
            key: 'checkbox',
            onSelectChange: (data) => handleOnSelectedChange(data),
            sx: { width: '4vw' },
            type: 'checkbox',
          },
          ...tableHeaderListRequest
        ];
        break;
      case 'SUMMARY':
        tableHeader = [
          ...tableHeaderListSummary
        ];
        break;
      case 'DOCUMENT_VERIFICATION':
        tableHeader = [
          ...tableHeaderList
        ];
        break;
      case 'UPLOAD_RESULT':
        tableHeader = [
          ...tableHeaderListUploadResult
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
          ...tableHeaderList
        ];
        break;
    }

    return tableHeader;
  };

  const tableHeaderManagement: Array<TableHeader> = [
    ...getTableHeader(),
    {
      key: 'action',
      label: 'Action',
      options: getOptions(),
      sx: { minWidth: '8vw' },
      type: 'action',
    }];


  return {
    handleNewData,
    isLoading,
    itemPerPage,
    managementPage,
    noPage,
    setItemPerPage,
    setNoPage,
    shouldRender,
    tableDataManagement,
    tableHeaderManagement,
  };
};

export default useTableManagement;
