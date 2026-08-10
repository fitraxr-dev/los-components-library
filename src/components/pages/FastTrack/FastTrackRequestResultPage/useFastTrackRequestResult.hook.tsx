import React, { useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme, Checkbox } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { fastTrack } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';

import { modal } from './FastTrackRequestResult.constants';
import useConfirmDocument from './hooks/useConfirmDocument';
import useDeleteDocument from './hooks/useDeleteDocument';
import useDetailDocument from './hooks/useDetailDocument';
import useListDocument from './hooks/useListDocument';
import useSaveRemark from './hooks/useSaveRemark';
import useSubmitFastTrack from './hooks/useSubmitFastTrack';
import useUploadDocument from './hooks/useUploadDocument';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { SubmitRequestDto } from '@/services/openapi/processor-service';


export default function useFastTrackRequestResult() {
  const pathname = usePathname();
  const router = useCustomRouter();
  const [state] = useApp();
  const currentRole = state.currentRole;
  const queryClient = useQueryClient();

  const theme = useTheme();
  const { processId } = useIdentity();
  const [selectedModule, setSelectedModule] = React.useState([]);
  const [filter, setFilter] = React.useState<string>('');
  const [detailId, setDetailId] = React.useState<string | number | null>(null);
  const [remarks, setRemarks] = React.useState<Record<string, string>>({});

  const { data: listModule } = useGetParameterList('documentFastTrack', {
    label: 'value1',
    value: 'value2',
  });

  const { data: listDocument, isLoading: isListLoading, refetch: refetchList } = useListDocument({
    bucketProcessId: String(processId),
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  });

  const { mutate: deleteDocument } = useDeleteDocument({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fast-track-list']});
    },
  });
  const { mutate: uploadDocument, isPending: isUploadLoading } = useUploadDocument({
    onSuccess: () => refetchList(),

  });

  const { mutateAsync: saveRemarkAsync, isPending: isSaveRemarkLoading } = useSaveRemark();

  const handleSaveRemark = async () => {
    try {
      const promises = selectedModule.map((item: any) =>
        saveRemarkAsync({
          bucketProcessId: String(processId),
          remark: remarks[item.value] || '',
          section: item.value,
        })
      );

      await Promise.all(promises);
      showNiceModalV2({
        title: 'Keterangan berhasil disimpan',
        type: 'success',
      });
    } catch (error) {
      showNiceModalV2({
        title: 'Gagal menyimpan keterangan',
        type: 'error',
      });
    }
  };

  const { mutate: confirmDocument, isPending: isConfirmLoading } = useConfirmDocument({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fast-track-list']});
      queryClient.invalidateQueries({ queryKey: ['fast-track-mandatory-check-options']});
    },
  });

  const { isPending: isSubmitLoading, mutate: submitFastTrack } = useSubmitFastTrack({
    onError: (error?: any) => {
      const errorDetail =
          error?.response?.data?.errorDetail ||
          'Data gagal dikirim';
      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          router.replace(fastTrack.REQUEST_PAGE);
        },
        title: 'Data berhasil dikirim',
        type: 'success',
      });
    },
  });

  const handleConfirmDocument = async () => {

    const data = await listDocument.filter((item: any) => selectedDocuments.includes(item?.id));
    const documentNotConfirm = await data?.filter((item: any) => !item.isChecked)?.map((item: any) => item.id);

    if (documentNotConfirm?.length === 0) {
      showNiceModalV2({
        title: 'Silahkan pilih minimal 1 dokumen',
        type: 'error',
      });
      return;
    } else {
      NiceModal.show(MODAL.GLOBAL.CONFIRM, {
        agreeText: 'Confirm',
        cancelText: 'Cancel',
        onSubmit: () => {
          closeNiceModal(MODAL.GLOBAL.CONFIRM);
          const payload: any = {
            bucketProcessId: String(processId),
            id: documentNotConfirm,
          };
          confirmDocument(payload);
        },
        title: `Apakah anda yakin ingin konfirmasi ${documentNotConfirm?.length} dokumen?`,
      });
    }
  };

  const handleSubmit = async (value: string) => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }: any) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: value,
            bucketProcessId: String(processId),
            comment,
            module: TypeModule.FAST_TRACK,
            process: TypeProcess.FAST_TRACK,
          };
          submitFastTrack(payload);
        },
      },
    );
  };

  const handleDecline = async () => {
    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment, radioValue }: any) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          const payload: SubmitRequestDto = {
            action: radioValue,
            bucketProcessId: String(processId),
            comment,
            module: TypeModule.FAST_TRACK,
            process: TypeProcess.FAST_TRACK,
          };
          submitFastTrack(payload);
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Cancelled', value: 'CANCELED' },
          { label: 'Rejected', value: 'REJECTED' }
        ],
      },
    );
  };

  const actionButtons = state.stepper?.steps.filter((dt: any) => dt.urlPath === getLastPath(pathname))[0]?.action;
  const sortArray = ['COMMENT', 'DECLINE', 'SAVE', 'RETURN_TO_STAFF', 'RETURN_TO_MAKER', 'SUBMIT', 'CLOSE', 'APPROVE'];

  const modifiedObject = React.useMemo(() => {
    let actionObject: any = {};
    for (const key in actionButtons) {
      if (key.includes('CANCEL') || key.includes('REJECT')) {
        actionObject['DECLINE'] = 'DECLINE';
      } else {
        actionObject[key] = actionButtons[key];
      }
    }
    return actionObject;
  }, [actionButtons]);

  const sortedKeys = sortArray.filter((key) => Object.keys(modifiedObject).includes(key));

  let sortedObject: any = {};
  sortedKeys.forEach((key) => {
    sortedObject[key] = modifiedObject[key];
  });

  const handleButton = (key: string, value: string) => {
    switch (key) {
      case 'SAVE':
        return (
          <Button
            key={key}
            variant="contained"
            sx={{ bgcolor: theme.palette.primary.dark }}
            onClick={handleSaveRemark}
            isLoading={isSaveRemarkLoading}
          >
            Save
          </Button>
        );
      case 'DECLINE':
        return (
          <Button key={key} variant="outlined" color="error" sx={{ bgcolor: 'white' }} onClick={handleDecline} isLoading={isSubmitLoading}>
            Decline
          </Button>
        );
      case 'SUBMIT':
      case 'RETURN_TO_STAFF':
      case 'RETURN_TO_MAKER':
        return (
          <Button key={key} variant="contained" color="success" onClick={() => handleSubmit(key)} isLoading={isSubmitLoading}>
            {value || 'Submit'}
          </Button>
        );
      case 'APPROVE':
        return (
          <Button key={key} variant="contained" color="success" onClick={handleConfirmDocument} isLoading={isConfirmLoading}>
            Approve
          </Button>
        );
      default:
        return (
          <Button key={key} variant="contained" disabled sx={{ bgcolor: theme.palette.custom.gray30 }}>
            {value}
          </Button>
        );
    }
  };

  const renderActionButtons =
      sortedObject
        ? Object.entries(sortedObject).map(([key, value]: [string, string]) => handleButton(key, value))
        : null;

  const { data: detailData } = useDetailDocument({
    bucketProcessId: String(processId),
    documentId: detailId ?? undefined,
    module: TypeModule.FAST_TRACK,
    process: TypeProcess.FAST_TRACK,
  });

  const [selectedDocuments, setSelectedDocuments] = React.useState<any[]>([]);

  useEffect(() => {
    setSelectedDocuments(listDocument?.filter((item) => item?.isChecked)?.map((item) => item.id) || []);
  }, [listDocument]);

  const tableHeader: TableHeader[] = [
    {
      isDisabled: (data) => {
        if (data.isChecked) {
          return true;
        }
        if (data.statusName === 'Waiting Approval TL' || data.statusName === 'Waiting Approval Kadiv') {
          if (data.statusName === 'Waiting Approval TL' && !currentRole.includes(roles.TL)) {
            return true;
          }

          if (data.statusName === 'Waiting Approval Kadiv' && !currentRole.includes(roles.KADIV)) {
            return true;
          }
          return false;
        }
        return true;
      },
      isHidden: () => {
        if (currentRole.includes(roles.STAFF)) {
          return true;
        }
        return false;
      },
      isSelected: (data) => {
        return selectedDocuments.includes(data?.id);
      },
      key: 'checkbox',
      label: '',
      onSelectChange(row) {
        if (!selectedDocuments.includes(row?.id)) {
          setSelectedDocuments([...selectedDocuments, row?.id]);
        } else {
          setSelectedDocuments(selectedDocuments.filter((item) => item !== row?.id));
        }
      },
      sx: {
        minWidth: '4vw',
      },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'groupDokumen',
      label: 'Group Dokumen',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'jenisDokumen',
      label: 'Jenis Dokumen',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'namaDokumen',
      label: 'Nama Dokumen',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'nomorDokumen',
      label: 'Nomor Dokumen',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'tanggalDokumen',
      label: 'Tanggal Dokumen',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'divisi',
      label: 'Divisi',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'createdDate',
      label: 'Uploaded Date',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'statusName',
      label: 'Status',
      sx: { minWidth: '18vw' },
      type: 'status',
    },
    {
      key: 'confirmedByName',
      label: 'Confirmed By',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'confirmedDate',
      label: 'Confirmed Date',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'remarkDoc',
      label: 'Keterangan',
      sx: {
        minWidth: '12vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            if (data?.id) {
              handleOpenEditModal(data.id, data.sourceSection, true);
            }
          },
        },
        {
          iconName: 'edit',
          isHidden: (data) => {
            return data.isConfirmedTl || !currentRole.includes(roles.STAFF) ;
          },
          onClick: (data) => {
            if (data?.id) {
              handleOpenEditModal(data.id, data.sourceSection, false);
            }
          },
        },
        {
          iconName: 'delete',
          isHidden: (data) => {
            return data.isConfirmedTl || !currentRole.includes(roles.STAFF) ;
          },
          onClick: (data) => {
            console.log(data);
            const deleteId = data?.documentId || data?.id;
            if (deleteId) {
              handleOpenDeleteModal(deleteId);
            }
          },
        },
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];

  const filterContentList = [
    { label: 'Nama Dokumen', value: 'namaDokumen' },
    { label: 'Nomor Dokumen', value: 'nomorDokumen' },
  ];

  const filterDropdownList = [
    { label: 'Semua', value: '' }
  ].concat(
    filterContentList.map((item) => ({ label: item.label, value: item.value }))
  );

  const handleAddDocument = (sourceSection: string) => {
    NiceModal.show(MODAL.GLOBAL.SELECTOR, {
      data: [
        {
          description: 'Tambah dokumen baru',
          key: 'new',
          label: 'Create New',
        },
        {
          description: 'Menambahkan dari dokumen eksisting',
          key: 'existing',
          label: 'Tambahkan dari Dokumen Eksisting',
        },
      ],
      onSubmit: (val: any) => {
        if (val === 'new') {
          handleOpenAddNewModal(sourceSection);
        } else {
          handleOpenAddExistingModal(sourceSection);
        };
      },
      title: 'Add Document',
    });
  };

  const handleOpenAddNewModal = (sourceSection: string) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, { module: TypeModule.FAST_TRACK, process: TypeProcess.FAST_TRACK, sourceSection, title: 'Document Pembiayaan' });
  };

  const handleOpenAddExistingModal = (sourceSection: string) => {

    const createProps = {
      sourceSection,
    };
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, createProps);
  };

  const handleOpenEditModal = (id: number, sourceSection?: string, isViewOnly?: boolean) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      id,
      isViewOnly,
      module: TypeModule.FAST_TRACK,
      process: TypeProcess.FAST_TRACK,
      sourceSection,
      title: isViewOnly ? 'Detail Document Pembiayaan' : 'Edit Document Pembiayaan',
    });
  };

  const handleOpenDeleteModal = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteDocument({
        id,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk Menghapus data Dokumen Pembiayaan?',
      type: 'warning',
    });
  };

  return {

    currentRole,
    filter,
    filterContentList,
    filterDropdownList,
    handleAddDocument,
    handleOpenAddExistingModal,
    handleOpenAddNewModal,
    handleOpenDeleteModal,
    handleSaveRemark,
    isSaveRemarkLoading,
    listDocument,
    listModule,
    remarks,
    renderActionButtons,
    selectedModule,
    setFilter,
    setRemarks,
    setSelectedModule,
    tableHeader,
    theme,
  };
}
