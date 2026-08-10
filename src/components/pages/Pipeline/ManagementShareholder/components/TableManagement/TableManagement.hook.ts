import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useSearchParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile, downloadFileV2, previewFile } from '@/helpers/utils';
// Old approach - using useDownloadGeneral hook (commented out)
// import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';


import useDeleteManagement from '../../hooks/useDeleteManagement';
import useGetManagementList from '../../hooks/useGetManagementList';
import { modalData } from '../../ManagementShareholder.constants';

import { tableHeaderList } from './TableManagement.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { CustomerManagementResponseDto, CustomerShareholderResponseDto } from '@/services/openapi/bucket-service';


const useTableManagement = () => {
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useIdentity();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  useEffect(() => {
    setNoPage(1);
  }, [itemPerPage]);

  const params = useSearchParams();

  const { data, isFetching } = useGetManagementList({
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

  // Record activity when management list is loaded
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
        remarks: 'view management list in table management',
      });
    }
  }, [data, noPage, itemPerPage, processId, recordActivity]);

  const { mutate: deleteManagement } = useDeleteManagement({
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


  const handleDetailManagement = (props: CustomerManagementResponseDto) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view management detail from table management',
    });

    NiceModal.show(modalData.MODAL_MANAGEMENT_DETAIL_EXISTING, {
      id: props.id,
      managementCode: props.managementCode,
      processId,
    });
  };

  const handleEditManagement = (props: CustomerManagementResponseDto) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view management edit form from table management',
    });

    NiceModal.show(modalData.MODAL_MANAGEMENT_EXISTING, {
      id: props.id,
      managementCode: props.managementCode,
      processId,
    });
  };

  const handleDeleteManagement = (props: CustomerManagementResponseDto) => {

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.DELETE,
          bucketProcessId: processId || '',
          changeAfter: JSON.stringify({ status: 'deleted' }),
          changeBefore: JSON.stringify({
            managementCode: props.managementCode,
            name: props.name,
            position: props.position,
          }),
          menuCode: 'pipeline',
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          remarks: 'delete management from table',
        });

        deleteManagement({
          bucketProcessId: processId,
          debtorId: debtorId,
          managementCode: props.managementCode,
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
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
        onClick: (props: CustomerManagementResponseDto) => handleDetailManagement(props),
      },
      // {
      //   iconName: 'preview-document',
      //   isHidden: (props: CustomerManagementResponseDto) =>
      // (props.npwpFile?.trim() === '' || props.npwpFile === null) &&
      //     (props.identityDocUrl?.trim() === '' || props.identityDocUrl === null),
      //   onClick: (data) => {
      //     if (data.npwpFile?.trim() !== '' && data.npwpFile !== null) {
      //       // previewFile(data.npwpFile);
      //       window.open((`${data?.npwpFile}?preview=true`), '_blank', 'noopener,noreferrer');
      //     } else if (data.identityDocUrl?.trim() !== '' && data.identityDocUrl !== null) {
      //       // previewFile(data.identityDocUrl);
      //       window.open((`${data?.identityDocUrl}?preview=true`), '_blank', 'noopener,noreferrer');
      //     }
      //   },
      // },
      // {
      //   iconName: 'download',
      //   isHidden: (props: CustomerManagementResponseDto) =>
      // (props.npwpFile?.trim() === '' || props.npwpFile === null) &&
      //     (props.identityDocUrl?.trim() === '' || props.identityDocUrl === null),
      //   onClick: (props: CustomerManagementResponseDto) => {
      //     // New approach - using downloadFileV2 like TableSupportingDocument
      //     if (props.npwpFile) {
      //       downloadFileV2(props.npwpFile, props.npwpFile.split('/').pop());
      //     }
      //     if (props.identityDocUrl) {
      //       downloadFileV2(props.identityDocUrl, props.identityDocUrl.split('/').pop());
      //     }

      // Old approach - using useDownloadGeneral hook (commented out)
      // if (props.npwpFile) {
      //   downloadMutation.mutate({
      //     fileName: props.npwpFile.split('/').pop(),
      //     id: props.id,
      //   });
      // }
      // if (props.identityDocUrl) {
      //   downloadMutation.mutate({
      //     fileName: props.identityDocUrl.split('/').pop(),
      //     id: props.id,
      //   });
      // }
      //   },
      // },
      {
        iconName: 'edit',
        isDisabled: viewOnly,
        onClick: (props: CustomerManagementResponseDto) => handleEditManagement(props),
      },
      {
        iconName: 'delete',
        isDisabled: viewOnly,
        onClick: (props: CustomerManagementResponseDto) => handleDeleteManagement(props),
      }],
      sx: { minWidth: '12vw' },
      type: 'action',
    }
  ];

  const handleAddData = () => {
    NiceModal.show(modalData.MODAL_MANAGEMENT_EXISTING);
  };


  return {
    data,
    handleAddData,
    isFetching,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    viewOnly,
  };

};

export default useTableManagement;
