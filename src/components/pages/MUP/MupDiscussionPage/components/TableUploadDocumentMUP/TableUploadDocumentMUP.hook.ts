import { useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2, getHoursMinutes } from '@/helpers/utils';
import useDeleteDocumentMupDiscussion from '@/hooks/services/mip/mip-discussion/useDeleteDocumentDiscussion';
import useGetDocumentMupDiscussionStaffList from '@/hooks/services/mip/mip-discussion/useGetDocumentDiscussionStaffList';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMupDiscussionContext } from '../../MupDiscussion.context';

import { modal, tableHeaderList } from './TableUploadDocumentMUP.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableUploadDocumentMUP = (props) => {
  const { callbackDataTable } = props;
  const { processId } = useIdentity();
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();
  const [appState] = useApp();
  const {
    _module,
    process,
    currentStaffName,
    bucketMasterId,
    analystId,
  } = useMupDiscussionContext();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [documentId, setDocumentId] = useState(null);

  const {
    data: documentMupStaffData,
    isLoading: isDocumentStaffListLoading,
    isFetching: isDocumentStaffListFetching,
  } = useGetDocumentMupDiscussionStaffList({
    filter: {
      bucketMasterId,
      bucketProcessId: processId,
      module: _module,
      process,
    },
    page: {
      itemPerPage,
      noPage,
    },
    sortList: {
      columnName: 'm.createdDate',
      sortType: 'DESC',
    },
  });

  const documentMupContents = documentMupStaffData?.contents;

  const documentMupList = documentMupContents?.map((item) => ({
    ...item,
    analystConfirm: item.analystConfirmation,
    documentDate: (new Date(item.createdDate)),
    documentName: item.fileName ?? '-',
    staffName: item.staff,
    time: getHoursMinutes(item.createdDate),
  }));

  const tableData = documentMupList;
  const tablePage = documentMupStaffData?.page;
  const isTableLoading = isDocumentStaffListLoading || isDocumentStaffListFetching || !bucketMasterId;
  const newestData = tableData?.length > 0 && tableData[0];
  const isMaker = appState?.currentRole?.includes('MAKER');
  const isStaff = appState?.currentRole?.includes('STAFF');
  const isSuperAdminStaff = appState?.currentPosition?.includes('TASK_FORCE');
  const isEnableAddNew = useMemo(
    () => (tableData?.length === 0) && (isStaff || isMaker || isSuperAdminStaff),
    [tableData, isStaff, isMaker, isSuperAdminStaff]
  );
  callbackDataTable(tableData);

  const { mutate: deleteDocument } = useDeleteDocumentMupDiscussion({
    onError: () => {
      showNiceModalV2({
        title: 'Document gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-discussion-staff-list']});
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: String(processId),
        changeBefore: JSON.stringify(newestData),
        menuCode: 'mup',
        module: _module,
        process: process,
        remarks: `Delete document with Id: ${documentId} in MUP Discussion with Id Process: ${processId}`,
      });
      showNiceModalV2({
        title: 'Document berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleOpenAddModal = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      module: _module,
      process: process,
      remarks: 'open add document modal',
    });
    NiceModal.show(modal.UPLOAD_DOCUMENT_MUP, {
      _module,
      analystId,
      bucketMasterId,
      process,
      uploadBy: currentStaffName,
    });
  };

  const handleEditDocument = (id: string) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      module: _module,
      process: process,
      remarks: 'open edit document modal',
    });
    NiceModal.show(modal.UPLOAD_DOCUMENT_MUP, {
      _module,
      analystId,
      bucketMasterId,
      id,
      process,
    });
  };

  const handleDeleteDocument = (uploadId: string) => {
    setDocumentId(uploadId);
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteDocument({ bucketProcessId: processId, module: _module, process, uploadId }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus document ini?',
      type: 'warning',
    });
  };

  const getActionOptions: TableHeader['options'] = () => {
    return [
      {
        iconName: 'edit',
        isDisabled: (row) => !row.isEditable,
        onClick: (row) => handleEditDocument(row.uploadId),
      },
      {
        iconName: 'preview-document', onClick: (data) =>
          window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
      },
      {
        iconName: 'download',
        onClick: (row) => downloadFileV2(row.fileUrl, row.fileName),
      },
      {
        iconName: 'delete',
        isDisabled: (row) => !row.isEditable,
        onClick: (row) => handleDeleteDocument(row.uploadId),
      },
    ];
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: getActionOptions(),
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];

  return {
    handleOpenAddModal,
    isEnableAddNew,
    isTableLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useTableUploadDocumentMUP;
