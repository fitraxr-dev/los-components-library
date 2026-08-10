import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

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

import useGetDebtorList from './hooks/useGetDebtorList';
import {
  tableHeaderList,
  tableHeaderListMIP,
  tableHeaderListRequest,
  tableHeaderListSummary,
} from './TableDebtor.constants';

import type { ManagementShareholderProps } from './TableDebtor.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketCreateRequestDto } from '@/services/openapi/bucket-service';


const useTableDebtor = ({
  module,
  onSelectedChange,
  selected,
  isRequestMode,
  viewOnly,
  status,
  tableType,
}: ManagementShareholderProps) => {
  const { processId } = useParams();
  const { debtorId } = useIdentity();
  const router = useCustomRouter();
  const [{ pages }] = useApp();

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

  let payload;
  if (module === MAINTENANCE_MODULE.MIP) {
    payload = {
      bucketProcessId: processId,
      module: pages.mipModule,
      process: pages.mipProcess,
    };
  } else if (module === MAINTENANCE_MODULE.MIP_REVIEW) {
    payload = {
      bucketProcessId: processId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.MIP_REVIEW_REVISION,
    };
  } else if (module === TypeModule.CREDIT_CHECKING) {
    payload = {
      bucketProcessId: processId,
      debtorId,
    };
  } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
    payload = {
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
    };
  } else {
    payload = {
      debtorId,
    };
  }

  const { data: {
    debtorDataList,
  } } = useGetDebtorList(payload, module, tableType);

  const tableDataDebtor = debtorDataList.map((debtor) => ({
    ...debtor,
    collectibility: debtor.collectabilityLabel ?? '-',
    googleResult: debtor.googleResult ?? '-',
    lastCheckedDate: debtor.lastCheckedDate ? formatDate(debtor.lastCheckedDate) : '-',
    resultReporting: debtor.resultReporting ?? '-',
  }));

  const handleEditData = async (data) => {
    if (module === MAINTENANCE_MODULE.MASTER_DATA) {
      const payload: BucketCreateRequestDto = {
        debtorId: debtorId,
        module: TypeModule.MAINTENANCE_DEBTOR,
        process: TypeProcess.MAINTENANCE_DEBTOR,
      };
      registerBucket(payload);

    } else {
      NiceModal.show(MODAL.MASTER.MANAGEMENT_DEBTOR, { id: data.id, isRequestMode, module, tableType });
    }
  };

  const handleViewDetailData = (data) => {
    NiceModal.show('DEBTOR_DETAIL', { id: data.id, isRequestMode, module, tableType });
  };

  const handleUploadDocuments = (data) => {
    NiceModal.show(
      MODAL.MASTER.VERIFICATION_UPLOAD_DOCUMENT,
      {
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.DEBTORDOCRESULT,
        module: TypeModule.CREDIT_CHECKING,
        ownerId: data.debtorId,
        ownership: 'DEBTOR',
        process: TypeProcess.CREDIT_CHECKING_DPOP,
        status,
      }
    );
  };

  const handleOnSelectedChange = (data) => {
    const selectedIndex = selected?.findIndex((item) => item === data.id);
    if (selectedIndex === -1) {
      onSelectedChange([...selected, data.id]);
    } else {
      const updatedSelected = [...selected];
      updatedSelected.splice(selectedIndex, 1);
      onSelectedChange(updatedSelected);
    }
  };

  const { mutate: downloadWatermark, isPending: isDownloadWatermarkLoading } = useDownloadWatermark({
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
    let result = [];

    switch (tableType) {
      case 'REQUEST':
        result = [
          { iconName: 'detail', onClick: (props: any) => handleViewDetailData(props) },
          // { iconName: 'preview-document',
          //   isDisabled: (props: any) => props.listDocuments?.length === 0,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: any) => props.listDocuments?.length === 0,
            onClick: (props: any) => {
              handleOpenWatermarkModal(props); },
          },
        ];
        break;
      case 'SUMMARY':
        result = [
          { iconName: 'detail', onClick: (props: any) => handleViewDetailData(props) },
          {
            iconName: 'edit',
            isDisabled: (props: any) => !props.isSelected,
            onClick: (props: any) => handleEditData(props),
          },
          // { iconName: 'preview-document',
          //   isDisabled: (props: any) => props.listDocuments?.length === 0,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: any) => props.listDocuments?.length === 0,
            onClick: (props: any) => {
              handleOpenWatermarkModal(props); },
          }
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
          { iconName: 'detail', onClick: (props: any) => handleViewDetailData(props) },
          // { iconName: 'preview-document',
          //   isDisabled: (props: any) => props.listDocuments?.length === 0,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: any) => props.listDocuments?.length === 0,
            onClick: (props: any) => {
              handleOpenWatermarkModal(props); },
          },
        ];
        break;
      default:
        result = [
          { iconName: 'detail', onClick: (props: any) => handleViewDetailData(props) },
          // { iconName: 'preview-document',
          //   isDisabled: (props: any) => props.listDocuments?.length === 0,
          //   onClick: (data) =>
          //     window.open((`${data?.listDocuments[0].document}?preview=true`), '_blank', 'noopener,noreferrer'),
          // },
          {
            iconName: 'unduh',
            isDisabled: (props: any) => props.listDocuments?.length === 0,
            onClick: (props: any) => {
              handleOpenWatermarkModal(props); },
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
            sx: {
              minWidth: '6vw',
            },
            type: 'checkbox',
          },
          ...tableHeaderListRequest,
          ...(module !== MAINTENANCE_MODULE.MIP ? [{
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: { minWidh: '20vw' },
          }] : [])
        ];
        break;
      case 'DOCUMENT_VERIFICATION':
        tableHeader = [
          ...tableHeaderList,
          {
            key: 'lastCheckedDate',
            label: 'Last Checked Date',
            sx: { minWidh: '10vw' },
          }
        ];
        break;
      case 'UPLOAD_RESULT':
        tableHeader = [
          ...tableHeaderList
        ];
        break;
      case 'SUMMARY':
        tableHeader = [
          ...tableHeaderListSummary
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

  const tableHeaderDebtor: Array<TableHeader> = [
    ...getTableHeader(),
    {
      key: 'action',
      label: 'Action',
      options: getOptions(),
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    }];

  return {
    tableDataDebtor,
    tableHeaderDebtor,
  };
};

export default useTableDebtor;
