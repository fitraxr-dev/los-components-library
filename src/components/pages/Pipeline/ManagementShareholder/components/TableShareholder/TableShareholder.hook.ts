import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile, downloadFileV2, previewFile } from '@/helpers/utils';
// Old approach - using useDownloadGeneral hook (commented out)
// import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';


import useDeleteShareholder from '../../hooks/useDeleteShareholder';
import useGetShareholderList from '../../hooks/useGetShareholderList';
import { modalData } from '../../ManagementShareholder.constants';

import { tableHeaderList } from './TableShareholder.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { CustomerShareholderResponseDto } from '@/services/openapi/bucket-service';


const useTableShareholder = () => {
  const { debtorId, processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { viewOnly } = useViewOnly();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  useEffect(() => {
    setNoPage(1);
  }, [itemPerPage]);

  const { data, isFetching } = useGetShareholderList({
    filter: {
      bucketProcessId: processId,
      debtorId: debtorId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  // Record activity when shareholder list is loaded
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
        remarks: 'view shareholder list in table shareholder',
      });
    }
  }, [data, noPage, itemPerPage, processId, recordActivity]);

  const { mutate: deleteShareholder } = useDeleteShareholder({
    onError: () => showNiceModalV2({
      title: 'Data gagal dihapus',
      type: 'error',
    }),
    onSuccess: () => showNiceModalV2({
      title: 'Data berhasil dihapus',
      type: 'success',
    }),
  });

  // Old approach - using useDownloadGeneral hook (commented out)
  // const downloadMutation = useDownloadGeneral({
  //   onError: (error) => {
  //     showNiceModalV2({
  //       title: 'Download gagal',
  //       type: 'error',
  //     });
  //   },
  //   onSuccess: () => {
  //     showNiceModalV2({
  //       title: 'Download berhasil',
  //       type: 'success',
  //     });
  //   },
  // });

  function handleDetailShareholder(payload: CustomerShareholderResponseDto) {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view shareholder detail from table shareholder',
    });
    NiceModal.show(modalData.MODAL_SHAREHOLDER_DETAIL_EXISTING, { shareholderCode: payload.shareholderCode });
  };

  const handleAddShareholder = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view add shareholder form from table shareholder',
    });
    NiceModal.show(modalData.MODAL_SHAREHOLDER_EXISTING);
  };

  const handleEditShareholder = (payload: CustomerShareholderResponseDto) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view shareholder edit form from table shareholder',
    });
    NiceModal.show(modalData.MODAL_SHAREHOLDER_EXISTING, { id: payload.id, shareholderCode: payload.shareholderCode });
  };


  function handleDeleteShareholder(props: CustomerShareholderResponseDto) {

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({ status: 'deleted' }),
          changeBefore: JSON.stringify({
            name: props.name,
            percentage: props.percentage,
            shareholderCode: props.shareholderCode,
          }),
          menuCode: 'pipeline',
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remarks: 'delete shareholder from table',
        });

        deleteShareholder({
          bucketProcessId: processId,
          debtorId: debtorId,
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          shareholderCode: props.shareholderCode,
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [{
        iconName: 'detail',
        onClick: (props: CustomerShareholderResponseDto) => handleDetailShareholder(props),
      },
      // {
      //   iconName: 'preview-document',
      //   isHidden: (props: CustomerShareholderResponseDto) =>
      // (props.npwpFile?.trim() === '' || props.npwpFile === null) &&
      //     (props.identityDocUrl?.trim() === '' || props.identityDocUrl === null),
      //   onClick: (data) => {
      //     if (data.npwpFile?.trim() !== '' && data.npwpFile !== null) {
      //       // previewFile(data.npwpFile);
      //       window.open((`${data?.npwpFile}?preview=true`), '_blank', 'noopener,noreferrer');
      //     } else if (data.identityDocUrl?.trim() !== '' && data.identityDocUrl !== null) {
      //       // previewFile(data.identityDocUrl);
      //       window.open((`${data?.identzityDocUrl}?preview=true`), '_blank', 'noopener,noreferrer');
      //     }
      //   },
      // },
      // {
      //   iconName: 'download',
      //   isHidden: (props: CustomerShareholderResponseDto) =>
      // (props.npwpFile?.trim() === '' || props.npwpFile === null) &&
      //   ((props as any).identityDocFile?.trim() === '' || (props as any).identityDocFile === null),
      //   onClick: (props: CustomerShareholderResponseDto) => {
      //     // New approach - using downloadFileV2 like TableSupportingDocument
      //     if (props.npwpFile) {
      //       downloadFileV2(props.npwpFile, props.npwpFile.split('/').pop());
      //     }
      //     if ((props as any).identityDocFile) {
      //       downloadFileV2((props as any).identityDocFile, (props as any).identityDocFile.split('/').pop());
      //     }

      // Old approach - using useDownloadGeneral hook (commented out)
      // if (props.npwpFile) {
      //   downloadMutation.mutate({
      //     fileName: props.npwpFile.split('/').pop(),
      //     id: props.id,
      //   });
      // }
      // if ((props as any).identityDocFile) {
      //   downloadMutation.mutate({
      //     fileName: (props as any).identityDocFile.split('/').pop(),
      //     id: props.id,
      //   });
      // }
      // },
      // },
      {
        iconName: 'edit',
        isDisabled: viewOnly,
        onClick: (props: CustomerShareholderResponseDto) => handleEditShareholder(props),
      },
      {
        iconName: 'delete',
        isDisabled: viewOnly,
        onClick: (props: CustomerShareholderResponseDto) => handleDeleteShareholder(props),
      }],
      sx: { minWidth: '12vw' },
      type: 'action',
    }
  ];


  return {
    data,
    handleAddShareholder,
    isFetching,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    viewOnly,
  };
};

export default useTableShareholder;
