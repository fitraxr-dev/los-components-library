import { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFile, downloadFileV2, previewFile } from '@/helpers/utils';
// Old approach - using useDownloadGeneral hook (commented out)
// import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDebtorById from '../../hooks/useGetDebtorById';
import { modalData } from '../../ManagementShareholder.constants';

import { tableHeaderList } from './TableDebtor.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableDebtor = () => {
  const { viewOnly } = useViewOnly();
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useIdentity();

  const { data: debtorDataList, isFetching } = useGetDebtorById({ debtorId });

  // Record activity when debtor data is loaded
  useEffect(() => {
    if (debtorDataList) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view debtor data in table debtor',
      });
    }
  }, [debtorDataList, processId, recordActivity]);

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

  const tableDataDebtor = [debtorDataList];

  const handleViewDetailData = (data: { debtorId: string }) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view debtor detail from table debtor',
    });
    NiceModal.show(modalData.MODAL_DEBTOR_DETAIL_NEW, { id: data.debtorId });
  };

  const handleEditData = (data: { debtorId: string }) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'view debtor edit form from table debtor',
    });
    NiceModal.show(modalData.MODAL_TABLE_DEBTOR_NEW, { id: data.debtorId });
  };

  const tableHeaderDebtor: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (props: any) => handleViewDetailData(props) },
        {
          iconName: 'edit',
          isDisabled: viewOnly || !debtorDataList?.id,
          onClick: (props: any) => handleEditData(props),
        },
        // { iconName: 'preview-document',
        //   isHidden: (props: any) => props.npwpFile?.trim() === '' || props.npwpFile === null,
        //   onClick: (data) =>
        //     // previewFile(`${data?.npwpFile}`),
        //     window.open((`${data?.npwpFile}?preview=true`), '_blank', 'noopener,noreferrer'),
        // },
        // {
        //   iconName: 'download',
        //   isHidden: (props: any) => props.npwpFile?.trim() === '' || props.npwpFile === null,
        //   onClick: (props: any) => {
        //     // New approach - using downloadFileV2 like TableSupportingDocument
        //     downloadFileV2(props.npwpFile, props.npwpFile.split('/').pop());

        // Old approach - using useDownloadGeneral hook (commented out)
        // downloadMutation.mutate({
        //   fileName: props.npwpFile.split('/').pop(),
        //   id: props.id,
        // });
        //   },
        // },
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    }];

  return {
    isFetching,
    tableDataDebtor,
    tableHeaderDebtor,
  };
};

export default useTableDebtor;
