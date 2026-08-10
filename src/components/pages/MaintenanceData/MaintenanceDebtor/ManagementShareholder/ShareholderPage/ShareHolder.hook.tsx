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
import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { MaintenanceComponent } from '@/enums/global';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2, parseNumber } from '@/helpers/utils';
import useGetDetalMaintenanceCustomer from '@/hooks/services/maintenance-customer/useGetDetail';
import useSaveRemarkManagement from '@/hooks/services/maintenance-customer/useSaveRemarkManagement';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import Button from '@/components/shared/Button';

import useGetDebtorById from '../hooks/useGetDebtorById';
import { payloadFilterList } from '../ManagementShareholder.constants';

import useDeleteShareholder from './hooks/useDeleteShareholder';
import useGetShareholderList from './hooks/useGetShareholderList';
import { TableHeaderList } from './ShareHolder.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useShareHolder = () => {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [{ stepper, currentRole }] = useApp();
  const { debtorId } = useIdentity();
  const [filter, setFilter] = useState<SearchValue>({});
  const [noPage, setNoPage] = useState(1);
  const queryClient = useQueryClient();
  const [itemPerPage, setItemPerPage] = useState(10);
  const { data: institutionTypeList } = useGetParameterList('institutionType');
  const { data: searchByOptions } = useGetParameterList('searchByDebtorShareholder', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByDebtorShareholder', { label: 'value1', value: 'value2' });
  const isTL = currentRole.includes('TL');
  const isKadiv = currentRole.includes('KADIV');
  const { recordActivity } = useRecordLog();
  const [isSubmit, setIsSubmit] = useState(false);
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);


  const currentStep = stepper.steps
    .find((step) => step.urlPath === 'management-shareholder')?.childrenSteps
    .find((step) => step.urlPath === getLastPath(pathname));
  const isDebtor = processId?.includes('DEBT');
  const isViewOnly = !currentStep?.enable;
  const actions = currentStep?.action;

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


  const { control, handleSubmit, reset, getValues, watch } = useForm({
    defaultValues: {
      description: '',
    },
    mode: 'onChange',
  });

  const watchedDescription = watch('description');

  const modul = pathname.split('/')[3];
  const handleBackToListPage = () => router.replace(maintenanceDebtor.LIST_PAGE);

  const {
    data: tableData,
    isLoading: isLoadingGrouped,
  } = useGetShareholderList({
    filter: payloadFilterList(processId, filter),
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const canEditShareholder = tableData?.additionalData?.canCreateBucket || tableData?.additionalData?.isEditable;
  const differentDataWithApu = tableData?.additionalData?.isDifferentWithApuPpt;

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

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      component: MaintenanceComponent.SHAREHOLDER,
      debtorId: bucketDetail?.debtorId,
      remark: watchedDescription,
    };

    return Promise.resolve(payload);
  }, [processId, bucketDetail?.debtorId, watchedDescription]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly,
    payload: autoSavePayload,
    url: 'master.remark.save',
  });

  const { mutate: deleteShareHolder } = useDeleteShareholder({
    onError: () => showNiceModalV2({
      title: 'Data gagal dihapus',
      type: 'error',
    }),
    onSuccess: () => showNiceModalV2({
      title: 'Data berhasil dihapus',
      type: 'success',
    }),
  });

  const { mutate: saveRemark, isPending: isLoadingSaveRemark } = useSaveRemarkManagement({
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


  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer shareholder page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: replacePath(maintenanceDebtor.MANAGEMENT_SHAREHOLDER_SHAREHOLDER_PAGE, {
        debtorId: processId,
        module: modul,
      }) },
      { label: 'Shareholder', url: '' }
    ]);
  }, []);

  useEffect(() => {
    if (detailRemark?.shareholderRemark && isSuccessRemark) {
      reset({
        description: detailRemark?.shareholderRemark,
      });
    }
  }, [detailRemark, isSuccessRemark]);


  const handleDelete = (shareholderId: 'string') => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteShareHolder({
        bucketProcessId: processId,
        debtorId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        shareholderId }),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };


  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  const gotoEditPage = (id: string) => {
    router.push(replacePath(`${pathname}/edit/${id}`, { processId }));
  };

  const gotoAddPage = () => {
    router.push(replacePath(`${pathname}/add`, { processId }));
  };

  const gotoStructurePage = () => {
    router.push(replacePath(`${pathname}/structure`, { processId }));
  };


  const formatActBtnTable = () => {
    let actBtn = [
      {
        iconName: 'detail',
        onClick: (data) => {
          gotoDetailPage(data?.shareholderId);
        },
      },
      {
        iconName: 'edit',
        isDisabled: isViewOnly || !canEditShareholder,
        onClick: (data) => {
          gotoEditPage(data?.shareholderId);
        },
      },
      {
        iconName: 'delete',
        isDisabled: (data) => {
          return isViewOnly || !canEditShareholder;
        },
        onClick: (data) => {
          handleDelete(data?.shareholderId);
        },
      },
      // {
      //   iconName: 'download',
      //   isDisabled: (data) => !data?.idDocUrl && !data?.npwpDocUrl,
      //   onClick: (data) => {
      //     if (data?.idDocUrl) downloadFileV2(data?.idDocUrl, data?.idDocUrl?.split('/').pop());
      //     if (data?.npwpDocUrl) downloadFileV2(data?.npwpDocUrl, data?.npwpDocUrl?.split('/').pop());
      //   },
      // },
    ];
    if (!roleCanEdit) {
      actBtn = actBtn.filter((item) => item.iconName !== 'edit' && item.iconName !== 'delete'
      );
    }
    return actBtn;
  };


  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: formatActBtnTable(),
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    },
  ];

  const totalShares = tableData?.contents?.reduce((total, item) => total + parseNumber(item.sheets), 0);
  const totalPercentage = tableData?.contents?.reduce((total, item) => total + Number(item.percentage), 0) || 0;

  const filterDropdownList = searchByOptions;

  const listButtons = [
    {
      disabled: false,
      iconName: '',
      isLoading: false,
      label: 'Struktur Kepemilikan Saham',
      onClick: gotoStructurePage,
    }
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'institutionType',
      label: 'Institution Type',
      options: institutionTypeList,
      type: 'multiple-autocomplete',
    },
    {
      endKey: 'endDate',
      label: 'Last Checked Date',
      startKey: 'startDate',
      type: 'period',
    },
  ];


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
      component: MaintenanceComponent.SHAREHOLDER,
      debtorId: bucketDetail?.debtorId,
      remark: value?.description,
    });
  };

  const handleOnSubmit = (action: string) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        console.log('getValues', getValues());
        setIsSubmit(true);
        try {
          handleOnSave(getValues());
          submitBucket({
            submitRequestDto: {
              action,
              bucketProcessId: processId,
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
        } catch (error) {
          showNiceModalV2({
            title: 'Data gagal disubmit',
            type: 'error',
          });
        } finally {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        }
      },
    });
  };

  const buttonDict = [CLOSE, DECLINE, CANCELED, REJECTED, RETURN_TO_STAFF, RETURN_TO_TL, SAVE, SUBMIT, APPROVE];

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
              isLoading={isSubmitLoading}
            >
              Decline
            </Button>
          );
        case CANCELED:
          return (
            <Button
              onClick={handleOnDecline}
              variant="outlined"
              color="error"
              isLoading={isSubmitLoading}
            >
              Cancel
            </Button>
          );
        case REJECTED:
          return (
            <Button
              onClick={handleOnDecline}
              variant="outlined"
              color="error"
              isLoading={isSubmitLoading}
            >
              Reject
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
    canEditShareholder,
    control,
    differentDataWithApu,
    filter,
    filterContentList,
    filterDropdownList,
    gotoAddPage,
    handleOnSave,
    handleSubmit,
    isAutoSaveFetching,
    isDebtor,
    isLoadingGrouped,
    isViewOnly,
    itemPerPage,
    listButtons,
    noPage,
    renderActionButtons,
    setFilter,
    setIsSubmit,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeaderList,
    theme,
    totalPercentage,
    totalShares,
  };
};

export default useShareHolder;
