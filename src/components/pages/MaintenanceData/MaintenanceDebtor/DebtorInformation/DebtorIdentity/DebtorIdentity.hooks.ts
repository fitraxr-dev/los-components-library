import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CANCELED, DECLINE, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaIsoString, formatDateTime } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetDetailDebtorIdentity from '@/hooks/services/maintenance-customer/useGetDetailDebtorIdentity';
import useSaveDebtorIdentity from '@/hooks/services/maintenance-customer/useSaveDebtorIdentity';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { modal } from '../../components/ActionFooterDetail/ActionFooterDetail.constant';

import { debtorIdentitySchema } from './DebtorIdentity.constant';


const useDebtorIdentity = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();
  const pathname = usePathname();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const [{ stepper, currentRole }] = useApp();
  const isDebtor = processId?.includes('DEBT');
  // const isTL = currentRole.includes('TL');
  // const isKadiv = currentRole.includes('KADIV');
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;
  const { setDirtyMsg } = useContext(DirtyContext);

  const { recordActivity } = useRecordLog();

  const [isSubmit, setIsSubmit] = useState(false);

  const { data: dataSourceDropdownList } = useGetParameterList('datasource');

  const actions = stepper.steps
    .find((step) => step.urlPath === 'customer-information')?.childrenSteps
    .find((step) => step.urlPath === getLastPath(pathname));

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: !isDebtor,
  });

  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });

  const isEnabledDetail = useMemo(() => {
    let enabled = false;
    if (!!bucketDetail?.debtorId || isDebtor) enabled = true;


    return enabled;
  }, [bucketDetail]);
  const { data } = useGetDetailDebtorIdentity({
    bucketProcessId: isDebtor ? '' : processId,
    debtorId: isDebtor ? processId : bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: isEnabledDetail,
  });


  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetCustomerInfoDataDelta({
    bucketProcessId: processId,
    component: DataDeltaGetDtoComponentEnum?.DebtorIdentity,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const findDataMaster = (inputKey: string, dropdownInputList?: {label: string; value: string}[]) => {
    let previousValue = null;
    if (dataDelta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = dataDelta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          previousValue = dropdownInputList?.find((item) => item?.value === findPrevValues)?.label;
        } else {
          if (inputKey === 'dateFounded' || inputKey === 'lastNotaryDeedDate' || inputKey === 'firstNotaryDeedDate') {
            previousValue = formatDateTime(findPrevValues);
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    return previousValue;
  };


  const { control, formState: { isDirty, isValid, errors }, formState, getValues, reset, watch } = useForm({
    context: 'debtorIdentity',
    mode: 'onChange',
    resolver: yupResolver(debtorIdentitySchema),
  });

  const watchedValues = watch('debtorIdentity');

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = watchedValues;

    if (!payload) return Promise.resolve(null);

    const savePayload = {
      bucketProcessId: processId,
      dateFounded: payload.dateFounded ? dayJsJakartaIsoString(payload.dateFounded) : undefined,
      firstNoNotaryDeed: payload.firstNotaryDeedNo,
      firstNoNotaryDeedDate: payload.firstNotaryDeedDate ?
        dayJsJakartaIsoString(payload.firstNotaryDeedDate) : undefined,
      firstNotaryDeedFile: payload.firstNotaryDeedDocument?.file ?? undefined,
      lastNoNotaryDeed: payload.lastNotaryDeedNo,
      lastNoNotaryDeedDate: payload.lastNotaryDeedDate ? dayJsJakartaIsoString(payload.lastNotaryDeedDate) : undefined,
      lastNotaryDeedFile: payload.lastNotaryDeedDocument?.file ?? undefined,
      module: TypeModule.MAINTENANCE_DATA,
      noNotaryDeed: payload.notaryDeedNo,
      noNotaryDeedFile: payload.notaryDeedDocument?.file ?? undefined,
      npwp: payload.npwpNo,
      npwpFile: payload.npwpDocument?.file ?? undefined,
      placeFounded: payload.placeFounded,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
    };

    return Promise.resolve(savePayload);
  }, [processId, watchedValues]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: roleCanEdit && !isViewOnly,
    payload: autoSavePayload,
    url: 'master.debtorIdentity.save',
  });

  const checkFormDirty = () => {
    if (!data) return false;

    const originalData = data;
    const currentValues = getValues('debtorIdentity');

    const normalizeValue = (value: unknown) => {
      if (value === '' || value === null) return undefined;
      return value;
    };

    const notaryDeedNoDirty = normalizeValue(originalData.notaryDeedNo) !== normalizeValue(currentValues?.notaryDeedNo);

    const firstNotaryDeedNoDirty = normalizeValue(originalData.firstNotaryDeedNo)
    !== normalizeValue(currentValues?.firstNotaryDeedNo);

    const lastNotaryDeedNoDirty = normalizeValue(originalData.lastNotaryDeedNo)
    !== normalizeValue(currentValues?.lastNotaryDeedNo);

    const npwpNoDirty = normalizeValue(originalData.npwpNo) !== normalizeValue(currentValues?.npwpNo);

    const placeFoundedDirty = normalizeValue(originalData.placeFounded) !== normalizeValue(currentValues?.placeFounded);

    return notaryDeedNoDirty || firstNotaryDeedNoDirty || lastNotaryDeedNoDirty || npwpNoDirty || placeFoundedDirty;
  };

  useEffect(() => {
    console.log('checkFormDirty', checkFormDirty());
    if (checkFormDirty()) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [
    isDirty,
    formState,
    data,
    watch('debtorIdentity.notaryDeedNo'),
    watch('debtorIdentity.firstNotaryDeedNo'),
    watch('debtorIdentity.lastNotaryDeedNo'),
    watch('debtorIdentity.npwpNo'),
    watch('debtorIdentity.placeFounded'),
  ]);

  const handleBackToListPage = () => router.replace(maintenanceDebtor.LIST_PAGE);


  const handleOpenSubmitModal = ({ action }: {action: string}) => {
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
          try {
            setIsSubmit(true);
            handleSave();
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
            NiceModal.show(MODAL.GLOBAL.ERROR, {
              message: 'Error',
              title: 'Error',
            });
          }
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: (error: any) => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      if (error?.message.includes('BCM')) {
        NiceModal.show(modal.PLAFON_VALIDATION, { errorMessage: error?.message });
      } else {
        showNiceModalV2({
          title: error?.message ? error?.message : 'Data gagal disimpan',
          type: 'error',
        });
      }
    },
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues('debtorIdentity')),
        changeBefore: JSON.stringify(data),
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'submit maintenance customer debtor identity',
      });
      setDirtyMsg(undefined);

      showNiceModalV2({
        onClose: handleBackToListPage,
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });


  useEffect(() => {
    if (data) {
      let body = {};

      // Helper function to convert file URLs to file objects
      const convertUrlToDocumentObject = (
        payload: { documentExtension: string; document: string; documentName: string }) => {
        if (!payload?.document) return undefined;
        const url = payload.document;
        const name = payload.documentName;
        const extension = `.${payload.documentExtension}`;

        return {
          extension,
          name,
          url,
        };
      };


      const fields = debtorIdentitySchema.fields;
      for (const key in fields.debtorIdentity.fields) {
        if (key.toLowerCase().includes('document')) {
          body[key] = convertUrlToDocumentObject(data[key]);
        } else {
          body[key] = data[key] ?? undefined;
        }
      }

      reset({
        debtorIdentity: body,
      });
    }
  }, [data, reset]);

  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {

    if (isValid) {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }

    // sessionStorage.setItem('isDirty', isDirty.toString());

  }, [errors, isValid, isDirty]);


  const { mutate: saveDebtorIdentity, isPending } = useSaveDebtorIdentity ({
    onError: () => {
      showNiceModalV2({
        title: 'Data tidak valid',
        type: 'error',
      });
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['detail-maintenance-customer']});
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: processId,
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'submit maintenance customer debtor identity',
      });

      queryClient.invalidateQueries({ queryKey: ['detail-maintenance-customer']});

      setDirtyMsg(undefined);

      if (!isSubmit) {
        showNiceModalV2({
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
      setIsSubmit(false);
    },
  });

  const handleSave = () => {
    const payload = getValues('debtorIdentity');
    // console.log('payload', payload.notaryDeedDocument.file ?? undefined);
    saveDebtorIdentity({
      bucketProcessId: processId,
      dateFounded: payload.dateFounded ? dayjs(payload.dateFounded).toISOString() : payload.dateFounded,

      firstNoNotaryDeed: payload.firstNotaryDeedNo,


      firstNoNotaryDeedDate: payload.firstNotaryDeedDate ?
        dayJsJakartaIsoString(payload.firstNotaryDeedDate) : undefined,

      firstNotaryDeedFile: payload.firstNotaryDeedDocument?.file ?? undefined,

      lastNoNotaryDeed: payload.lastNotaryDeedNo,

      lastNoNotaryDeedDate: payload.lastNotaryDeedDate ? dayJsJakartaIsoString(payload.lastNotaryDeedDate) : undefined,

      lastNotaryDeedFile: payload.lastNotaryDeedDocument?.file ?? undefined,

      module: TypeModule.MAINTENANCE_DATA,

      noNotaryDeed: payload.notaryDeedNo,

      noNotaryDeedFile: payload.notaryDeedDocument?.file ?? undefined,
      // debtorCode: payload.debtorCode,
      npwp: payload.npwpNo,
      npwpFile: payload.npwpDocument?.file ?? undefined,
      placeFounded: payload.placeFounded,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      // options: payload.,
    });
  };

  const handleInvalid = () => {
    const payload = getValues('debtorIdentity');

    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      onSubmit: () => {
        saveDebtorIdentity({
          bucketProcessId: processId,
          dateFounded: payload.dateFounded ? dayjs(payload.dateFounded).toISOString() : payload.dateFounded,

          firstNoNotaryDeed: payload.firstNotaryDeedNo,


          firstNoNotaryDeedDate: payload.firstNotaryDeedDate,

          firstNotaryDeedFile: payload.firstNotaryDeedDocument.url,

          lastNoNotaryDeed: payload.lastNotaryDeedNo,

          lastNoNotaryDeedDate: payload.lastNotaryDeedDate,

          lastNotaryDeedFile: payload.lastNotaryDeedDocument.url,

          module: TypeModule.MAINTENANCE_DATA,

          noNotaryDeed: payload.notaryDeedNo,

          noNotaryDeedFile: payload.notaryDeedDocument.url,
          // debtorCode: payload.debtorCode,
          npwp: payload.npwpNo,
          npwpFile: payload.npwpDocument.url,
          placeFounded: payload.placeFounded,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          // options: payload.,
        });
      },
      title: 'Data belum lengkap, apakah Anda ingin menyimpan data ini?',
    });

  };


  const handleSubmitProcess = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        try {
          setIsSubmit(true);
          submitBucket({
            submitRequestDto: {
              action: 'SUBMIT',
              bucketProcessId: processId,
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
        } catch (error) {
          NiceModal.show(MODAL.GLOBAL.ERROR, {
            message: 'Error',
            title: 'Error',
          });
        }
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };


  const handleDeclineProcess = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
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
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
      radioLabel: 'Choose Reason:',
      radioOptions: [
        { label: 'Canceled', value: CANCELED },
        { label: 'Rejected', value: REJECTED }
      ],
    });
  };


  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer debtor identity page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: '' },
      { label: 'Other Common Information', url: '' }
    ]);
  }, []);

  const handleClose = () => {
    router.back();
  };


  return {
    actions,
    canEdit,
    control,
    dataSourceDropdownList,
    debtorData,
    findDataMaster,
    handleClose,
    handleDeclineProcess,
    handleInvalid,
    handleOpenSubmitModal,
    handleSave,
    handleSubmitProcess,
    isAutoSaveFetching,
    isDebtor,
    isDirty,
    isPending,
    isSubmit,
    isSubmitLoading,
    isViewOnly,
    setIsSubmit,
    watch,
  };
};

export default useDebtorIdentity;
