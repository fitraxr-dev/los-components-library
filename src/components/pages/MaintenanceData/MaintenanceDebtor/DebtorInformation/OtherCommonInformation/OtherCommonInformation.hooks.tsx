import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CANCELED, DECLINE, REJECTED } from '@/configs/constants/general';
import { MODAL } from '@/configs/constants/modalId';
import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrency } from '@/helpers/formatCurrency';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetDetail from '@/hooks/services/maintenance-customer/useGetDetail';
import useSaveAdditionalInformation from '@/hooks/services/maintenance-customer/useSaveAdditionalInformation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGetGamByDivision from '@/hooks/useGetGamByDivision';
import useGetRmByDivision from '@/hooks/useGetRmByDivision';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../components/ActionFooterDetail/ActionFooterDetail.constant';
import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';

import useGetOtherCommonInformation from './hooks/useGetOtherCommonInformation';
import { otherCommonInformationSchema } from './OtherCommonInfomation.constant';


import type { TableHeader } from '@/components/shared/Table/Table.types';


const useOtherCommonInformation = () => {

  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [{ stepper, currentRole }] = useApp();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;
  const isDebtor = processId?.includes('DEBT');
  // const isTL = currentRole.includes('TL');
  // const isKadiv = currentRole.includes('KADIV');
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const [actions, setActions] = useState(null);
  const pathname = usePathname();
  const { recordActivity } = useRecordLog();
  const { setDirtyMsg } = useContext(DirtyContext);

  const [isSubmit, setIsSubmit] = useState(false);

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });

  const { data: otherCommonInformation } = useGetOtherCommonInformation({
    ...payloadFilterList(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  const { data } = useGetDetail({
    bucketProcessId: processId,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: !!bucketDetail?.debtorId });

  const { mutate, isPending } = useSaveAdditionalInformation ({
    onError: () => {
      showNiceModalV2({
        title: 'Data tidak valid',
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues('anotherInformation')),
        changeBefore: JSON.stringify(data),
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save maintenance customer other common information',
      });

      queryClient.invalidateQueries({ queryKey: ['get-other-common-information']});

      setDirtyMsg(undefined);

      if (!isSubmit) {
        showNiceModalV2({
        // onClose() {
        //   router.push(
        //     replacePath(
        // '/maintenance-data/maintenance-debtor/maintenance/[processId]/customer-information/apu-ppt-data'
        // , {
        //       processId: processId,
        //     }),
        //   );
        // },
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
      setIsSubmit(false);
    },
  });


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
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'submit maintenance customer',
      });
      setDirtyMsg(undefined);

      showNiceModalV2({
        onClose: () => {
          router.push(
            maintenanceDebtor.LIST_PAGE
          );
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetCustomerInfoDataDelta({
    bucketProcessId: processId,
    component: DataDeltaGetDtoComponentEnum?.OtherCommonInformation,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const findDataMaster = (inputKey: string, dropdownInputList?: {label: string; id: string}[]) => {
    let previousValue = null;
    if (dataDelta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = dataDelta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          const foundItem = dropdownInputList?.find((item) => String(item?.id) === String(findPrevValues));
          previousValue = foundItem?.label ?? findPrevValues;
        } else {
          previousValue = findPrevValues;
        }
      }
    }
    return previousValue;
  };

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
    formState } = useForm(
    {
      context: 'anotherInformation',
      mode: 'onChange',
      resolver: yupResolver(otherCommonInformationSchema),
    }
  );

  const checkFormDirty = () => {
    if (!otherCommonInformation) return false;

    const originalData = otherCommonInformation.data.content;
    const currentValues = getValues('anotherInformation');

    const normalizeValue = (value: unknown) => {
      if (value === '' || value === null) return null;
      return value;
    };

    const detailRelationDirty = normalizeValue(originalData.detailRelation)
    !== normalizeValue(currentValues?.detailRelation?.value);

    const generalAccountManagerDirty = normalizeValue(originalData.gamId)
    !== normalizeValue(currentValues?.generalAccountManager?.value);

    const originalIsAffiliated = originalData.isAffiliated === true
      ? 'true' : originalData.isAffiliated === false ? 'false' : null;
    const isAffiliatedDirty = originalIsAffiliated
    !== normalizeValue(currentValues?.isAffiliated);

    const relationInformationDirty = normalizeValue(originalData.relationInformation)
    !== normalizeValue(currentValues?.relationInformation);

    const relationshipWithSmiSinceDirty = normalizeValue(originalData.relationshipWithSmiSince)
    !== normalizeValue(currentValues?.relationshipWithSmiSince);

    const rmDirty = normalizeValue(originalData.rmId)
    !== normalizeValue(currentValues?.rm?.value);

    const typeOfBusinessDirty = normalizeValue(originalData.typeOfBusiness)
    !== normalizeValue(currentValues?.typeOfBusiness);

    const yearFoundedDirty = normalizeValue(originalData.yearFounded)
    !== normalizeValue(currentValues?.yearFounded);

    return detailRelationDirty
    || generalAccountManagerDirty
    || isAffiliatedDirty
    || relationInformationDirty
    || relationshipWithSmiSinceDirty
    || rmDirty
    || typeOfBusinessDirty
    || yearFoundedDirty;
  };

  useEffect(() => {
    if (checkFormDirty()) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [
    isDirty,
    formState,
    otherCommonInformation,
    watch('anotherInformation.detailRelation.value'),
    watch('anotherInformation.generalAccountManager.value'),
    watch('anotherInformation.isAffiliated'),
    watch('anotherInformation.relationInformation'),
    watch('anotherInformation.relationshipWithSmiSince'),
    watch('anotherInformation.rm.value'),
    watch('anotherInformation.typeOfBusiness'),
    watch('anotherInformation.yearFounded'),
  ]);

  useEffect(() => {
    for (const step of stepper.steps) {
      if ('childrenSteps' in step) {
        if (step.childrenSteps) {
          if (step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname))) {
            const actions = step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname));
            setActions(actions);
            break;
          }
        }
        else {
          if (step.urlPath === getLastPath(pathname)) {
            const actions = step;
            setActions(actions);
            break;
          }
        }
      }
    }
  }, [stepper]);


  useEffect(() => {
    if (otherCommonInformation) {
      let body = {};
      const fieldKeys = ['detailRelation', 'gamId', 'isAffiliated', 'relationInformation', 'relationshipWithSmiSince', 'typeOfBusiness', 'yearFounded', 'modifiedBy', 'modifiedDate', 'rmId'];

      for (const key of fieldKeys) {
        if (key === 'gamId') {
          body['generalAccountManager'] = {
            label: otherCommonInformation.data.content['gamLabel'] ?? '',
            value: otherCommonInformation.data.content[key] ?? '',
          };
        } else if (key === 'isAffiliated') {
          body['isAffiliated'] = otherCommonInformation.data.content[key] ? 'true' : otherCommonInformation.data.content[key] === false ? 'false' : null;
        } else if (key === 'rmId') {
          body['rm'] = {
            label: otherCommonInformation.data.content['rmLabel'] ?? '',
            value: otherCommonInformation.data.content[key] ?? '',
          };
        } else if (key === 'detailRelation') {
          body['detailRelation'] = {
            label: otherCommonInformation.data.content['rmLabel'] ?? '',
            value: otherCommonInformation.data.content[key] ?? '',
          };
        }
        else {
          body[key] = otherCommonInformation.data.content[key] ?? null;
        }
      }
      reset({ anotherInformation: body });
    }

  }, [otherCommonInformation]);

  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {


    if (isValid) {
      setCanEdit(true);
    } else {
      setCanEdit(false);
    }

    // sessionStorage.setItem('isDirty', isDirty.toString());

  }, [errors, isValid, isDirty]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer other common information page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: '' },
      { label: 'Other Common Information', url: '' }
    ]);
  }, []);


  const { data: detailRelationWithSmi, isSuccess: isSuccessDetailRelationWithSmi, isFetching: isFetchingDetailRelationWithSmi } = useGetParameterList('detailRelationSMI');

  const [valueDetailRelation, setValueDetailRelation] = useState(null);

  useEffect(() => {
    if (detailRelationWithSmi && detailRelationWithSmi.length) {
      const selectedDetailRelation = detailRelationWithSmi.find((relation) => relation.value === watch('anotherInformation.detailRelation.value'));
      setValueDetailRelation(selectedDetailRelation ?? null);
    }
  });

  const {
    data: gamData,
    isSuccess: isGetGamDataSuccess,
    isFetching: isLoadingGamData,
  } = useGetGamByDivision(
    { value: '' },
    { division: 'divisionShort', label: 'fullName', value: 'userId' },
  );

  const {
    data: rmData,
    isSuccess: isGetRmDataSuccess,
    isFetching: isLoadingRmData,
  } = useGetRmByDivision(
    { value: '' },
    { division: 'divisionShort', label: 'fullName', value: 'userId' },
  );

  const [gamDropdownList, setGamDropdownList] = useState([]);
  const [valueGam, setValueGam] = useState(null);

  const [rmDropdownList, setRmDropdownList] = useState([]);
  const [valueRm, setValueRm] = useState(null);


  const setGamValue = () => {
    if (isGetGamDataSuccess && Array.isArray(gamData)) {
      const dropdownList = gamData.map((gam) => ({
        id: gam?.value,
        label: `${gam?.division} - ${gam?.label}`,
      }));
      setGamDropdownList(dropdownList);
    }
  };

  const setRmValue = () => {
    if (isGetRmDataSuccess && Array.isArray(rmData)) {
      const dropdownList = rmData.map((rm) => ({
        id: rm?.value,
        label: `${rm?.division} - ${rm?.label}`,
      }));
      setRmDropdownList(dropdownList);
    }
  };

  const watchedGamId = watch('anotherInformation.generalAccountManager.value');
  const watchedRmId = watch('anotherInformation.rm.value');

  useEffect(() => {
    setGamValue();
  }, [isGetGamDataSuccess, gamData]);

  useEffect(() => {
    if (gamDropdownList && gamDropdownList.length) {
      const selectedGam = gamDropdownList.find((gam) => gam.id === String(watchedGamId));
      setValueGam(selectedGam ?? null);
    }
  }, [gamDropdownList, watchedGamId]);

  useEffect(() => {
    setRmValue();
  }, [isGetRmDataSuccess, rmData]);

  useEffect(() => {
    if (rmDropdownList && rmDropdownList.length) {
      const selectedRm = rmDropdownList.find((rm) => rm.id === String(watchedRmId));
      setValueRm(selectedRm ?? null);
    }
  }, [rmDropdownList, watchedRmId]);


  // useEffect(() => {
  //   if (watch('anotherInformation.generalAccountManager') && (watch('anotherInformation.generalAccountManager.id')
  // !== undefined || watch('anotherInformation.generalAccountManager.id') !== '')) {
  //     setValueGam(
  //       gamDropdownList.find((gam) => gam.id === String(watch('anotherInformation.generalAccountManager.id')))
  //     );
  //   }
  // }, [watch('anotherInformation.generalAccountManager.id')]);
  // }, [otherCommonInformation]);

  const TableHeaderTotal: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        paddingLeft: `${theme.spacing(3)} !important`,
      },
      type: 'index',
    },
    {
      key: 'currency',
      label: 'Currency',
    },
    {
      key: 'nominal',
      label: 'Nominal',
      render: (row) => (
        <TextStyle variant="body4" textAlign="center" >
          {` ${ row.nominal && row.nominal !== '0' && row.nominal !== '-' ? formatCurrency(row.nominal) : '-'}`}
        </TextStyle>
      ),
    },
  ];

  const TableHeaderSmi: TableHeader[] = [
    {
      key: 'currency',
      label: 'Currency',
      sx: {
        paddingLeft: `${theme.spacing(3)} !important`,
      },
    },
    {
      key: 'nominal',
      label: 'Nominal',
      render: (row) => (
        <TextStyle variant="body4" textAlign="center" >
          {` ${ row.nominal && row.nominal !== '0' && row.nominal !== '-' ? formatCurrency(row.nominal) : '-'}`}
        </TextStyle>
      ),
    },
  ];

  const TableHeaderCoBorrower: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'customerName',
      label: 'Customer Name',
    },
    {
      key: 'customerId',
      label: 'Customer ID',
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: {
        minWidth: '6vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {},
        },
        {
          iconName: 'edit', onClick: (data) => {},
        },
        {
          iconName: 'delete', onClick: (data) => {},
        },
      ],
      sx: { maxWidth: '4vw' },
      type: 'action',
    },
  ];

  const TableDataTotal = [
    {
      currency: 'IDR',
      nominal: otherCommonInformation?.data?.content?.totalFinancingInIdr ?? '-',
    },
    {
      currency: 'USD',
      nominal: otherCommonInformation?.data?.content?.totalFinancingInUsd ?? '-',
    }
  ];

  const TableDataSmi = [
    { currency: 'IDR', nominal: otherCommonInformation?.data?.content.smiFinancingPortionUsd ?? '-' },
    { currency: 'USD', nominal: otherCommonInformation?.data?.content.smiFinancingPortionInIdr ?? '-' }
  ];

  const TableDataCoBorrower = [
    { cif: '-', customerId: '-', customerName: '-' },
    { cif: '-', customerId: '-', customerName: '-' },
    { cif: '-', customerId: '-', customerName: '-' },
    { cif: '-', customerId: '-', customerName: '-' }
  ];
  const handleSave = () => {
    const payload = getValues('anotherInformation');
    mutate({
      bucketProcessId: processId,
      detailRelation: payload.detailRelation?.value ?? null,
      gamId: payload.generalAccountManager?.value ?? null,
      isAffiliated: payload.isAffiliated === 'true' ? true : false,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      relationInformation: payload.relationInformation,
      relationshipWithSmiSince: payload.relationshipWithSmiSince,
      rmId: payload.rm?.value ?? null,
      typeOfBusiness: payload.typeOfBusiness,
      yearFounded: payload.yearFounded,
    });
  };

  const handleError = () => {
    const payload = getValues('anotherInformation');
    mutate({
      bucketProcessId: processId,
      detailRelation: payload.detailRelation?.value ?? null,
      gamId: payload.generalAccountManager?.value ?? null,
      isAffiliated: payload.isAffiliated === 'true' ? true : payload.isAffiliated === 'false' ? false : null,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      relationInformation: payload.relationInformation,
      relationshipWithSmiSince: payload.relationshipWithSmiSince,
      rmId: payload.rm?.value ?? null,
      typeOfBusiness: payload.typeOfBusiness,
      yearFounded: payload.yearFounded,
    });
  };

  const handleSubmitProcess = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
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
        { label: 'Cancel', value: 'CANCEL' },
        { label: 'Reject', value: 'REJECT' }
      ],
    });
  };

  const handleClose = () => {
    router.back();
  };

  const handleOpenSubmitModal = ({ action }: {action: string}) => {
    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          setIsSubmit(true);
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

  const watchedValues = useMemo(() => ({
    detailRelation: watch('anotherInformation.detailRelation.value'),
    generalAccountManager: watch('anotherInformation.generalAccountManager.value'),
    isAffiliated: watch('anotherInformation.isAffiliated'),
    relationInformation: watch('anotherInformation.relationInformation'),
    relationshipWithSmiSince: watch('anotherInformation.relationshipWithSmiSince'),
    rm: watch('anotherInformation.rm.value'),
    typeOfBusiness: watch('anotherInformation.typeOfBusiness'),
    yearFounded: watch('anotherInformation.yearFounded'),
  }), [
    watch('anotherInformation.detailRelation.value'),
    watch('anotherInformation.generalAccountManager.value'),
    watch('anotherInformation.isAffiliated'),
    watch('anotherInformation.relationInformation'),
    watch('anotherInformation.relationshipWithSmiSince'),
    watch('anotherInformation.rm.value'),
    watch('anotherInformation.typeOfBusiness'),
    watch('anotherInformation.yearFounded'),
  ]);

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = getValues('anotherInformation');

    if (!payload) return Promise.resolve(null);

    const formattedPayload = {
      bucketProcessId: processId,
      detailRelation: payload.detailRelation?.value ?? null,
      gamId: payload.generalAccountManager?.value ?? null,
      isAffiliated: payload.isAffiliated === 'true' ? true : payload.isAffiliated === 'false' ? false : null,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      relationInformation: payload.relationInformation,
      relationshipWithSmiSince: payload.relationshipWithSmiSince,
      rmId: payload.rm?.value ?? null,
      typeOfBusiness: payload.typeOfBusiness,
      yearFounded: payload.yearFounded,
    };

    return Promise.resolve(formattedPayload);
  }, [
    processId,
    watchedValues,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isViewOnly && !!otherCommonInformation,
    payload: autoSavePayload,
    url: 'master.otherCommonInformation.save',
  });

  return {
    TableDataCoBorrower,
    TableDataSmi,
    TableDataTotal,
    TableHeaderCoBorrower,
    TableHeaderSmi,
    TableHeaderTotal,
    actions,
    canEdit,
    control,
    debtorData,
    detailRelationWithSmi,
    findDataMaster,
    gamDropdownList,
    handleClose,
    handleDeclineProcess,
    handleError,
    handleOpenSubmitModal,
    handleSave,
    handleSubmit,
    handleSubmitProcess,
    isAutoSaveFetching,
    isDebtor,
    isDirty,
    isFetchingDetailRelationWithSmi,
    isLoadingGamData,
    isLoadingRmData,
    isPending,
    isSubmit,
    isSubmitLoading,
    isSuccessDetailRelationWithSmi,
    isValid,
    isViewOnly,
    rmDropdownList,
    setIsSubmit,
    setValue,
    setValueDetailRelation,
    setValueGam,
    setValueRm,
    valueDetailRelation,
    valueGam,
    valueRm,
    watch,
  };
};

export default useOtherCommonInformation;
