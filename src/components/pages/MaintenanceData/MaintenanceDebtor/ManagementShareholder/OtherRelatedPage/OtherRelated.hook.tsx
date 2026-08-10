import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  APPROVE,
  CANCELED,
  CLOSE,
  DECLINE,
  REJECTED,
  RETURN_TO_STAFF,
  RETURN_TO_TL,
  SAVE,
  SUBMIT,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { MaintenanceComponent } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2 } from '@/helpers/utils';
import useGetDetalMaintenanceCustomer from '@/hooks/services/maintenance-customer/useGetDetail';
import useSaveRemarkManagement from '@/hooks/services/maintenance-customer/useSaveRemarkManagement';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import Button from '@/components/shared/Button';

import useGetDebtorById from '../hooks/useGetDebtorById';
import { payloadFilterList } from '../ManagementShareholder.constants';

import useDeleteOtherRelatedById from './hooks/useDeleteOtherRelatedById';
import useGetOtherRelatedList from './hooks/useGetOtherRelatedList';
import { TableHeaderList } from './OtherRelated.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useOtherRelated = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const theme = useTheme();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [{ stepper }] = useApp();

  const isMaintenance = pathname.includes('/maintenance/');
  const isMaster = pathname.includes('/master/');

  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const isKadiv = state.currentRole.includes('KADIV');

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer other related page',
    });
  }, []);

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const currentStep = stepper.steps
    .find((step) => step.urlPath === 'management-shareholder')?.childrenSteps
    .find((step) => step.urlPath === getLastPath(pathname));

  const isViewOnly = !currentStep?.enable;

  const actions = currentStep?.action;

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      description: '',
    },
    mode: 'onChange',
  });

  const watchedDescription = watch('description');

  const modul = pathname.split('/')[3];
  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_OTHER_RELATED_PAGE, {
        debtorId: processId,
        module: modul,
      }) },
      { label: 'Pihak Terkait Lainnya', url: '' }
    ]);
  }, []);

  const { data: bucketDetail, isSuccess: isBucketDetailSuccess } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: isMaintenance,
  });

  const { data: debtorDetail, isSuccess: isDebtorDetailSuccess } = useGetDebtorById({
    debtorId: processId,
  }, {
    enabled: isMaster,
  });

  const {
    data: detailRemark,
    isSuccess: isRemarkSuccess,
  } = useGetDetalMaintenanceCustomer({
    bucketProcessId: String(processId),
    debtorId: bucketDetail?.debtorId ? bucketDetail?.debtorId : debtorDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: isBucketDetailSuccess || isDebtorDetailSuccess,
  });

  useEffect(() => {
    if (detailRemark?.otherRelatedRemark && isRemarkSuccess) {
      reset({
        description: detailRemark?.otherRelatedRemark,
      });
    }
  }, [detailRemark, isRemarkSuccess]);

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      component: MaintenanceComponent.OTHER_RELATED_PARTIES,
      debtorId: bucketDetail?.debtorId ? bucketDetail?.debtorId : debtorDetail?.debtorId,
      remark: watchedDescription,
    };

    return Promise.resolve(payload);
  }, [processId, bucketDetail?.debtorId, debtorDetail?.debtorId, watchedDescription]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly,
    payload: autoSavePayload,
    url: 'master.remark.save',
  });

  const { data: otherRelatedListData, isLoading: isOtherRelatedListLoading } = useGetOtherRelatedList({
    filter: payloadFilterList(processId),
    page: {
      itemPerPage,
      noPage,
    },
  }, {
    enabled: isMaintenance
      ? isBucketDetailSuccess && !!bucketDetail?.debtorId
      : isDebtorDetailSuccess && !!debtorDetail?.debtorId,
  });

  const tableData = otherRelatedListData?.contents.map((content) => ({
    ...content,
    jobPosition: content.jobPositionLabel,
    lastCheckedDate: content.lastCheckedDate ? formatDateTime(new Date(content.lastCheckedDate)) : '-',
    name: content.name || '-',
    nik: content.nik || '-',
  }));

  const queryClient = useQueryClient();

  const { mutate: saveRemark, isPending: isLoadingSaveRemark } = useSaveRemarkManagement({
    onError: () => showNiceModalV2({
      title: 'Data gagal disimpan',
      type: 'error',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detail-maintenance-customer']});
      if (!isSubmit) {
        showNiceModalV2({
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
      setIsSubmit(false);
    },
  });

  const { mutate: deleteOtherRelated, isPending: isDeleteLoading } = useDeleteOtherRelatedById({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal dihapus',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  const gotoEditPage = (id: string) => {
    router.push(replacePath(`${pathname}/edit/${id}`, { processId }));
  };

  const gotoAddPage = () => {
    router.push(replacePath(`${pathname}/add`, { processId }));
  };

  const handleDelete = (val) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteOtherRelated({
        bucketProcessId: val.bucketProcessId,
        debtorId: val.debtorId,
        module: TypeModule.MAINTENANCE_DATA,
        partyId: val.partyId,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
      }),
      submitText: 'Ya',
      title: 'Apakah ingin menghapus data pihak terkait lainnya?',
      type: 'warning',
    });
  };

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: (row) => [
        {
          iconName: 'detail',
          onClick: (data) => {
            gotoDetailPage(data?.partyId);
          },
        },
        {
          iconName: 'edit',
          isDisabled: !row.isEditable,
          isHidden: isViewOnly,
          onClick: (data) => {
            gotoEditPage(data?.partyId);
          },
        },
        {
          iconName: 'delete',
          isDisabled: !row.isEditable,
          isHidden: isViewOnly,
          onClick: handleDelete,
        },
        // {
        //   iconName: 'download', onClick: (data) => {
        //     function getDocName(url: string) {
        //       const splittedUrl = url.split('/');
        //       return splittedUrl[splittedUrl.length - 1];
        //     };

        //     const idDocName = getDocName(data.idDocUrl);
        //     const npwpDocName = getDocName(data.npwpDocUrl);

        //     downloadFileV2(data.idDocUrl, idDocName);
        //     downloadFileV2(data.npwpDocUrl, npwpDocName);
        //   },
        // }
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];

  const handleBackToListPage = () => router.replace(maintenanceDebtor.LIST_PAGE);

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        title: 'Data gagal disubmit',
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: () => {
          handleBackToListPage();
        },
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

  const handleOnDecline = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      isRadioMandatory: true,
      onSave: ({ comment, radioValue }) => {
        submitBucket({
          submitRequestDto: {
            action: radioValue,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CUSTOMER,
          },
        });
      },
      radioLabel: 'Declined',
      radioOptions: [
        { label: 'Canceled', value: CANCELED },
        { label: 'Rejected', value: REJECTED },
      ],
    });
  };

  const handleOnSave = (value) => {
    saveRemark({
      bucketProcessId: processId,
      component: MaintenanceComponent.OTHER_RELATED_PARTIES,
      debtorId: bucketDetail?.debtorId,
      remark: value.description,
    });
  };

  const handleOnSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        setIsSubmit(true);
        submitBucket({
          submitRequestDto: {
            action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.MAINTENANCE_DATA,
            process: TypeProcess.MAINTENANCE_CUSTOMER,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const buttonDict = [CLOSE, DECLINE, RETURN_TO_STAFF, RETURN_TO_TL, SAVE, SUBMIT, APPROVE];

  const renderActionButtons = () => {
    if (!actions) {
      return null;
    }

    let buttonContents = [];

    for (const key in actions) {
      if (buttonDict.includes(key)) {
        const buttonDictIdx = buttonDict.indexOf(key);
        buttonContents[buttonDictIdx] = [key, actions[key]];
      }
    }

    const buttons = buttonContents.map((button) => {
      const [key, value] = button;

      switch (key) {
        case CLOSE:
          return (
            <Button
              variant="outlined"
              onClick={handleBackToListPage}
            >
              Close
            </Button>
          );
        case DECLINE:
          return (
            <Button
              onClick={handleOnDecline}
              variant="outlined"
              color="error"
              isLoading={isDeleteLoading}
            >
              Decline
            </Button>
          );
        case RETURN_TO_STAFF:
          return (
            <Button
              onClick={() => handleOnSubmit(value)}
              variant="contained"
              color="primary"
              isLoading={isSubmitLoading}
            >
              Return to Staff
            </Button>
          );
        case RETURN_TO_TL:
          return (
            <Button
              onClick={() => handleOnSubmit(value)}
              variant="contained"
              color="primary"
              isLoading={isSubmitLoading}
            >
              Return to TL
            </Button>
          );
        case SAVE:
          return (
            <Button
              onClick={handleSubmit(handleOnSave)}
              variant="contained"
              color="primary"
              isLoading={isLoadingSaveRemark}
              disabled={isLoadingSaveRemark || isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          );
        case SUBMIT:
          return (
            <Button
              onClick={() => handleOnSubmit(value)}
              variant="contained"
              color="success"
              isLoading={isSubmitLoading}
            >
              {isKadiv ? 'Approve' : 'Submit'}
            </Button>
          );
        case APPROVE:
          return (
            <Button
              onClick={() => handleOnSubmit(value)}
              variant="contained"
              color="success"
              isLoading={isSubmitLoading}
            >
              Approve
            </Button>
          );
        default:
          null;
      }
    });

    return buttons;
  };

  return {
    control,
    gotoAddPage,
    handleOnSave,
    handleSubmit,
    isAutoSaveFetching,
    isLoadingSaveRemark,
    isMaster,
    isOtherRelatedListLoading,
    isSubmit,
    isViewOnly,
    noPage,
    otherRelatedListData,
    renderActionButtons,
    setIsSubmit,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeaderList,
    theme,
  };
};

export default useOtherRelated;
