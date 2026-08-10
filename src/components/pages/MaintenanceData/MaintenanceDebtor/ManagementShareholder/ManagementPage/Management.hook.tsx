import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { CANCELED, DECLINE, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { MaintenanceComponent } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2 } from '@/helpers/utils';
import useGetDetalMaintenanceCustomer from '@/hooks/services/maintenance-customer/useGetDetail';
import useSaveRemarkManagement from '@/hooks/services/maintenance-customer/useSaveRemarkManagement';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useDeleteManagement from '../hooks/useDeleteManagement';
import useGetDebtorById from '../hooks/useGetDebtorById';
import useGetManagementList from '../hooks/useGetManagementList';
import { payloadFilterList } from '../ManagementShareholder.constants';

import { TableHeaderList } from './Management.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useManagement = () => {
  const [{ stepper }] = useApp();
  const theme = useTheme();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [remark, setRemark] = useState<string>('');
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();
  const isDebtor = processId?.includes('DEBT');

  const [itemPerPage, setItemPerPage] = useState(10);
  const [noPage, setNoPage] = useState(1);
  const [isDetailPage] = useState(false); // Not a detail page by default
  const debtorId = processId.includes('DEBT') ? processId : '';
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    data: bucketDetail,
    isSuccess: isSuccessBucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: !isDebtor,
  });

  const { data: debtorDetail, isSuccess: isDebtorDetailSuccess } = useGetDebtorById({
    debtorId: processId,
  }, {
    enabled: isDebtor,
  });

  const { data, isSuccess: isSuccessManagementList } = useGetManagementList({
    filter: payloadFilterList(processId),
    page: {
      itemPerPage,
      noPage,
    },
  }, {
    enabled: isSuccessBucketDetail || isDebtorDetailSuccess,
  });

  const {
    data: detailRemark,
    isSuccess: isSuccessRemark,
  } = useGetDetalMaintenanceCustomer({
    bucketProcessId: String(processId),
    debtorId: bucketDetail?.debtorId ? bucketDetail?.debtorId : debtorDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: isSuccessBucketDetail || isDebtorDetailSuccess,
  });

  const actions = stepper.steps
    .find((step) => step.urlPath === 'management-shareholder')?.childrenSteps
    .find((step) => step.urlPath === getLastPath(pathname));

  const isViewOnly = !actions?.enable;

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  const gotoEditPage = (id: string) => {
    router.push(replacePath(`${pathname}/edit/${id}`, { processId }));
  };

  const gotoAddPage = () => {
    router.push(replacePath(`${pathname}/add`, { processId }));
  };

  const handleChangeRemark = (value: string) => {
    setRemark(value);
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      component: MaintenanceComponent.MANAGEMENT,
      debtorId,
      remark,
    };

    return Promise.resolve(payload);
  }, [processId, debtorId, remark]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: roleCanEdit && !isViewOnly,
    payload: autoSavePayload,
    url: 'master.remark.save',
  });

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer management page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Management', url: '' }
    ]);
  }, []);

  useEffect(() => {
    if (detailRemark?.managementRemark && isSuccessRemark) {
      setRemark(detailRemark?.managementRemark);
    }
  }, [detailRemark, isSuccessRemark]);

  const { mutate: saveRemark, isPending } = useSaveRemarkManagement({
    onError: () => showNiceModalV2({
      title: 'Data gagal dihapus',
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

  const handleBackToListPage = () => router.replace(maintenanceDebtor.LIST_PAGE);

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      showNiceModalV2({
        onClose: handleBackToListPage,
        title: 'Data berhasil disubmit',
        type: 'success',
      });
    },
  });

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


  const handleSave = () => {
    saveRemark({
      bucketProcessId: processId,
      component: MaintenanceComponent.MANAGEMENT,
      debtorId,
      remark,
    });
  };

  const handleOpenSubmitModal = ({ action }: { action: string }) => {
    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          submitBucket({
            submitRequestDto: {
              action: radioValue,
              bucketProcessId: String(processId),
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Canceled', value: CANCELED },
          { label: 'Rejected', value: REJECTED }
        ],
      });
    } else {
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
    }
  };

  const handleDelete = (id: string) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteManagement({
        bucketProcessId: processId,
        debtorId: bucketDetail?.debtorId.toString(),
        managementCode: id,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            gotoDetailPage(data?.managementCode);
          },
        },
        {
          iconName: 'edit',
          isHidden: !roleCanEdit || isViewOnly,
          onClick: (data) => {
            gotoEditPage(data?.managementCode);
          },
        },
        {
          iconName: 'delete',
          isHidden: !roleCanEdit || isViewOnly,
          onClick: (data) => {
            handleDelete(data?.managementCode);
          },
        },
        // {
        //   iconName: 'download',
        //   isDisabled: (data) => !data?.idDocUrl && !data?.npwpDocUrl,
        //   onClick: (data) => {
        //     downloadFileV2(data?.idDocUrl, data?.idDocUrl?.split('/').pop());
        //     downloadFileV2(data?.npwpDocUrl, data?.npwpDocUrl?.split('/').pop());
        //   },
        // },
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];

  const handleClose = () => {
    router.back();
  };

  return {
    actions,
    data,
    gotoAddPage,
    handleChangeRemark,
    handleClose,
    handleOpenSubmitModal,
    handleSave,
    isAutoSaveFetching,
    isDetailPage,
    isPending,
    isSubmit,
    isSubmitLoading,
    isViewOnly,
    itemPerPage,
    noPage,
    remark,
    setIsSubmit,
    setItemPerPage,
    setNoPage,
    tableHeaderList,
    theme,
  };
};

export default useManagement;
