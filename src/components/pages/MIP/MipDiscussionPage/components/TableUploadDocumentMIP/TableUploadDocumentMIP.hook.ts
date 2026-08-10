import { useCallback, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { getHoursMinutes } from '@/helpers/utils';
import useDeleteDocumentDiscussion from '@/hooks/services/mip/mip-discussion/useDeleteDocumentDiscussion';
import useGetDocumentDiscussionAnalystList from '@/hooks/services/mip/mip-discussion/useGetDocumentDiscussionAnalystList';
import useGetDocumentDiscussionStaffList from '@/hooks/services/mip/mip-discussion/useGetDocumentDiscussionStaffList';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMipDiscussionContext } from '../../MipDiscussion.context';

import { modal, tableHeaderList } from './TableUploadDocumentMIP.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableUploadDocumentMIP = () => {
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();
  const {
    _module,
    process,
    processId,
    currentStaffName,
    isRM,
    isStaffSuperAdmin,
    isSuperAdminMaker,
    bucketMasterId,
    isGetBcmSuccess,
    analystId,
  } = useMipDiscussionContext();

  const [noPage, setNoPage] = useState(1);
  const { viewOnly: isViewOnly } = useViewOnly();
  const [itemPerPage, setItemPerPage] = useState(5);
  const [documentId, setDocumentId] = useState(null);

  const [processIdPrefix] = processId?.split('-') ?? [];
  const isAnalyst = processIdPrefix === 'MIPA';

  // Determine module & process filter for analyst list based on current module (MIP / MUP)
  const isMipModule = _module === 'MIP';
  const analystProcessFilter = isMipModule ? 'MIP|MIP_ANALYST' : 'MUP|MUP_ANALYST';
  const analystModuleFilter = isMipModule ? 'MIP' : 'MUP';

  const downloadMutation = useDownloadGeneral({
    onError: (error) => {
      showNiceModalV2({
        title: 'Download gagal',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Download berhasil',
        type: 'success',
      });
    },
  });

  const handleDownload = (id: number, fileName?: string) => {
    downloadMutation.mutate({ fileName, id });
  };

  const {
    data: documentMipAnalystData,
    isLoading: isDocumentAnalystListLoading,
  } = useGetDocumentDiscussionAnalystList({
    filter: {
      bucketMasterId,
      bucketProcessId: processId,
      module: analystModuleFilter,
      process: analystProcessFilter,
    },
    page: {
      itemPerPage,
      noPage,
    },
    sortList: {
      columnName: 'createdDate',
      sortType: 'DESC',
    },
  }, {
    enabled: isAnalyst && isGetBcmSuccess,
  });

  const {
    data: documentMipStaffData,
    isLoading: isDocumentStaffListLoading,
  } = useGetDocumentDiscussionStaffList({
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
      columnName: 'createdDate',
      sortType: 'DESC',
    },
  }, {
    enabled: !isAnalyst,
  });

  const documentMipContents = isAnalyst ? documentMipAnalystData?.contents : documentMipStaffData?.contents;

  const documentMipList = documentMipContents?.map((item) => ({
    ...item,
    analystConfirm: item.analystConfirmation,
    documentDate: item.createdDate,
    documentName: item.fileName ?? '-',
    staffName: item.staff,
    time: getHoursMinutes(item.createdDate),
  }));

  const tableData = documentMipList;
  const tablePage = isAnalyst ? documentMipAnalystData?.page : documentMipStaffData?.page;
  const isTableLoading = isAnalyst ? isDocumentAnalystListLoading : isDocumentStaffListLoading;
  const newestData = tableData?.length > 0 && tableData[0];
  const isEnableAddNew = useMemo(() => tableData?.length > 0 ? false : true, [tableData]);

  const { mutate: deleteDocument } = useDeleteDocumentDiscussion({
    onError: () => {
      showNiceModalV2({
        title: 'Document gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-discussion-staff-list']});
      queryClient.invalidateQueries({ queryKey: ['document-discussion-analyst-list']});
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: String(processId),
        changeBefore: JSON.stringify(newestData),
        menuCode: 'mip',
        module: _module,
        process: process,
        remarks: `Delete document with Id: ${documentId} in MIP Discussion with Id Process: ${processId}`,
      });
      showNiceModalV2({
        title: 'Document berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleOpenAddModal = () => {
    NiceModal.show(modal.UPLOAD_DOCUMENT_MIP, {
      _module,
      analystId,
      bucketMasterId,
      isAnalyst,
      process,
      uploadBy: currentStaffName,
    });
  };

  const handleEditDocument = (id: string) => {
    setDocumentId(id);
    NiceModal.show(modal.UPLOAD_DOCUMENT_MIP, {
      _module,
      analystId,
      bucketMasterId,
      id,
      isAnalyst,
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

  const getActionOptions: TableHeader['options'] = useCallback(() => {
    if (isRM || isStaffSuperAdmin || isSuperAdminMaker) {
      return [
        {
          iconName: 'edit',
          isDisabled: (row) => !row.isEditable,
          onClick: (row) => handleEditDocument(row.uploadId),
        },
        {
          iconName: 'preview-document',
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          onClick: (row) => handleDownload(row.id, row.fileName),
        },
        {
          iconName: 'delete',
          isDisabled: (row) => !row.isEditable,
          onClick: (row) => handleDeleteDocument(row.uploadId),
        },
      ];
    } else {
      return [
        {
          iconName: 'preview-document',
          onClick: (data) =>
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        },
        {
          iconName: 'download',
          onClick: (row) => handleDownload(row.id, row.fileName),
        },
      ];
    }
  }, [isAnalyst, isRM, isStaffSuperAdmin, isSuperAdminMaker]);

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
    isGetBcmSuccess,
    isTableLoading,
    isViewOnly,
    noPage,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useTableUploadDocumentMIP;
