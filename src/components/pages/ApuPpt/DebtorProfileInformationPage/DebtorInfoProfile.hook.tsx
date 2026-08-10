import { useContext, useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ASK_FOR_INFO } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaIsoString, formatDateToUtc } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import { validationSchema } from './DebtorInfoProfile.schema';
import useGetDebtorDiff from './hooks/useGetDebtorDiff';
import useGetDebtorProfileDataDelta from './hooks/useGetDebtorProfileDataDelta';
import useGetDebtorProfileInformation from './hooks/useGetDebtorProfileInformation';
import useGetSimiliarProcess from './hooks/useGetSimiliarProcess';
import useRequestEditProfileInformation from './hooks/useRequetEditDebtorProfile';
import useSaveDebtorProfileInformation from './hooks/useSaveDebtorProfileInformation';


export const useDebtorInfoProfile = () => {
  const [{ stepper }] = useApp();
  const { process } = useApuPpt();
  const pathname = usePathname();
  const { setDirtyMsg } = useContext(DirtyContext);
  const { processId } = useIdentity();
  const { goToNextStep, isRequest, isKadiv, actions, isRM, isBusinessDivision, isSuperAdmin } = useApuPptContext();
  const isDpopDivision = process === TypeProcess.APU_PPT_DPOP;
  const { viewOnly } = useViewOnly();
  const queryClient = useQueryClient();
  const listStatusAskForInfo = ['ASK_FOR_INFO_RETURN_TO_STAFF', 'ASK_FOR_INFO', 'ASK_FOR_INFO_APPROVED_TL_DPOP', 'ASK_FOR_INFO_APPROVED_KADIV_DPOP'];
  const [applicationCatDiff, setApplicationCatDiff] = useState('');
  const options = { label: 'value1', module: 'value2', value: 'key' };
  const needCheckMaster = useMemo(() => {
    let checkMaster = false;
    if (JSON.stringify(actions) !== '{}' && actions?.hasOwnProperty('NEED_CHECK_MASTER')) {
      checkMaster = true;
    }
    return checkMaster;
  }, [actions]);
  const [appliPurpose, setAppliPurpose] = useState([]);
  const [payload, setPayload] = useState({
    address: '',
    addressRef: '',
    applicationCategory: '',
    applicationPurpose: null,
    applicationPurposeRemark: '',
    applicationRemarks: '',
    applicationType: '',
    applicationTypeRemark: '',
    bucketProcessId: processId,
    businessEntityForm: '',
    businessField: '',
    businessFieldRef: '',
    businessRelationshipPurpose: '',
    city: {},
    district: {},
    email: '',
    establishmentDate: '',
    establishmentDateRef: '',
    establishmentPlace: '',
    establishmentPlaceRef: '',
    licenseNumber: '',
    licenseNumberRef: '',
    module: TypeModule.APU_PPT,
    phoneNumber: '',
    postalCode: '',
    process: process,
    province: {},
    registeredStockExchange: undefined,
    remarks: '',
    revenue: '',
    revenueRef: '',
    sourceOfFunds: '',
    subDistrict: {},
    ultimateBeneficialOwner: '',
    ultimateBeneficialOwnerRef: '',
  });

  const {
    control,
    reset,
    watch,
    setValue,
    register,
    formState,
    handleSubmit: handleSubmitForm,
  } = useForm({
    defaultValues: payload,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    if (formState.isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [formState.isDirty, pathname]);

  const {
    address,
    applicationCategory,
    applicationPurpose,
    applicationType,
    businessEntityForm,
    businessField,
    businessRelationshipPurpose,
    city,
    district,
    establishmentDate,
    establishmentPlace,
    postalCode,
    province,
    sourceOfFunds,
    subDistrict,
    ultimateBeneficialOwner,
    remarks,
    licenseNumber,
    applicationRemarks,
  } = watch();

  const mandatoryFieldIsEmpty = !address
    || !applicationCategory
    || !applicationCategory
    || !applicationPurpose
    || !applicationType
    || !businessEntityForm
    || !businessField
    || !businessRelationshipPurpose
    || !city
    || !licenseNumber
    || !district
    || !establishmentDate
    || !establishmentPlace
    || !postalCode
    || !province
    || !sourceOfFunds
    || !subDistrict
    || !ultimateBeneficialOwner
    || !applicationRemarks;

  const { data: debtorProfileInfoData } = useGetDebtorProfileInformation({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });


  const { data: provinceDropdownList } = useGetParameterList('province', options);

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.APU_PPT,
    process: process,
  });


  const { mutate: saveDebtorInformation } = useSaveDebtorProfileInformation({
    onError() {
      showNiceModalV2({
        onClose: () => { },
        type: 'error',
      });
    },
  });

  const { mutate: submitRequestEdit, isPending: isRequestPending } = useRequestEditProfileInformation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bucket-stepper',
          {
            bucketProcessId: processId,
            module: TypeModule.APU_PPT,
            process: TypeProcess.APU_PPT,
          }],
      });
    },
  });

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onSuccess: () => {
      submitRequestEdit({
        bucketProcessId: processId,
        isEdited: true,
        module: TypeModule.APU_PPT,
        process: TypeProcess.APU_PPT,
      });
    },
  });

  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetDebtorProfileDataDelta({
    bucketProcessId: bucketDetail?.bucketParentId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT,
  }, {
    enabled: !!bucketDetail?.bucketParentId && isDpopDivision && needCheckMaster,
  });


  const { data: similiarProcessData } = useGetSimiliarProcess({
    bucketProcessId: processId,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.APU_PPT,
    process: process,
  }, {
    enabled: bucketDetail?.debtorId !== null && needCheckMaster,
  });

  const { data: debtorDiffData } = useGetDebtorDiff({
    newPayload: {
      bucketProcessId: similiarProcessData?.content?.bucketProcessId,
      module: TypeModule.APU_PPT,
      process: process,
    },
    oldPalyoad: {
      bucketProcessId: processId,
      module: TypeModule.APU_PPT,
      process: process,
    },
  });

  const changeBgInput = (inputKey: string) => {
    let color = '#FFFFFF';
    if (dataDelta?.differencesData?.some((el) => el?.key === inputKey) && needCheckMaster) {
      color = '#FCE6E8';
    }
    return color;
  };

  const findDataMaster = (inputKey: string) => {
    let label = '';
    if (typeof dataDelta?.previousData === 'object' && dataDelta?.previousData !== null && needCheckMaster) {
      label = dataDelta?.previousData[inputKey];
    }
    return label;
  };


  const handleRequestEdit = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        submitBucket({
          submitRequestDto: {
            action: 'REQUEST_EDIT',
            bucketProcessId: processId,
            comment: 'Edit Data Request Bisnis - Ask For Info',
            module: TypeModule.APU_PPT,
            process: TypeProcess.APU_PPT,
          },
        });
      },
      submitText: 'Ya',
      title: 'Apakah Anda yakin ingin melakukan perubahan data?',
      type: 'warning',
    });
  };


  const handleSubmit = async ({ data, goToNext }: { data: any; goToNext?: boolean }) => {
    const formatDateUTCEstablishmentDate = formatDateToUtc(data.establishmentDate, 'YYYY-MM-DD');
    const formatDateToJkt = dayJsJakartaIsoString(formatDateUTCEstablishmentDate);
    const payload = {
      ...data,
      applicationPurpose: data?.applicationPurpose?.join('|'),
      applicationPurposeRemark: data?.applicationPurpose?.includes('OTHERS') ? data?.applicationPurposeRemark : '',
      bucketProcessId: processId,
      city: formatAddress(data.city),
      district: formatAddress(data.district),
      establishmentDate: formatDateToJkt,
      module: TypeModule.APU_PPT,
      process: process,
      province: formatAddress(data.province),
      registeredStockExchange: Boolean(data?.registeredStockExchange),
      subDistrict: formatAddress(data.subDistrict),
    };

    if (mandatoryFieldIsEmpty) {
      showNiceModalV2({
        cancelText: 'Batal',
        onSubmit: () => saveDebtorInformation(payload),
        submitText: 'Simpan',
        title: 'DATA MANDATORY belum terisi, simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveDebtorInformation(payload, {
        onSuccess: () => {
          showNiceModalV2({
            onClose: goToNext ? goToNextStep : undefined,
            type: 'success',
          });
        },
      });
    }
  };


  const formatAddress = (val) => {
    let value;
    if (typeof val === 'object' && val !== null) {
      value = val?.value;
    } else {
      value = val;
    }
    return value;
  };

  useEffect(() => {
    if (debtorProfileInfoData?.content) {
      setPayload(debtorProfileInfoData?.content);
      reset(debtorProfileInfoData?.content);
      setApplicationCatDiff(debtorProfileInfoData?.content?.applicationCategory);
    }
  }, [debtorProfileInfoData?.content]);


  useEffect(() => {
    if (isSuccesDataDelta && dataDelta?.differencesData !== null && dataDelta.differencesData?.length > 0) {
      const applicationPurposeDelta = dataDelta?.differencesData?.find((item) => item?.key === 'applicationPurpose');
      if (applicationPurposeDelta && applicationPurposeDelta?.differencesData?.length > 0) {
        setAppliPurpose(applicationPurposeDelta?.differencesData);
      }
    }
  }, [isSuccesDataDelta, dataDelta]);


  const checkDiffAppCategory = (val: string) => {
    if (applicationCatDiff && applicationCatDiff !== val) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onCancel: () => closeNiceModal(MODAL.GLOBAL.CONFIRM),
        onSubmit: () => {
          setValue('applicationCategory', val);
          setApplicationCatDiff(val);
        },
        submitText: 'Ya',
        title: 'Jenis Permohonan yang dipilih akan menentukan template Informasi Dokumen Customer',
        type: 'warning',
      });
    } else {
      setValue('applicationCategory', val);
    }
  };


  useEffect(() => {
    reset({
      ...payload,
      applicationPurpose: payload?.applicationPurpose?.split('|'),
    });
  }, [payload]);

  useEffect(() => {
    if (!(watch().applicationPurpose?.includes('OTHERS'))) {
      setValue('applicationPurposeRemark', '');
    }
  }, [watch().applicationPurpose]);

  useEffect(() => {
  }, [watch()]);

  const isAskForInfoMode = viewOnly && stepper.from === ASK_FOR_INFO;
  // const isButtonNextDisabled = !isAskForInfoMode ? !mandatoryFieldIsEmpty : false;

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      ...watchedValues,
      applicationPurpose: Array.isArray(watchedValues?.applicationPurpose)
        ? watchedValues.applicationPurpose.join('|')
        : watchedValues?.applicationPurpose,
      applicationPurposeRemark: watchedValues?.applicationPurpose?.includes('OTHERS')
        ? watchedValues?.applicationPurposeRemark
        : '',
      bucketProcessId: processId,
      city: formatAddress(watchedValues.city),
      district: formatAddress(watchedValues.district),
      module: TypeModule.APU_PPT,
      process: process,
      province: formatAddress(watchedValues.province),
      registeredStockExchange: Boolean(watchedValues?.registeredStockExchange),
      subDistrict: formatAddress(watchedValues.subDistrict),
    };

    return Promise.resolve(payload);
  }, [
    watchedValues,
    processId,
    process,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'mip.apuppt.saveDebtor',
  });

  return {
    appliPurpose,
    bucketDetail,
    changeBgInput,
    checkDiffAppCategory,
    control,
    debtorDiffData,
    findDataMaster,
    formState,
    goToNextStep,
    handleRequestEdit,
    handleSubmit,
    handleSubmitForm,
    isAskForInfoMode,
    isAutoSaveFetching,
    isBusinessDivision,
    isDpopDivision,
    isKadiv,
    isRM,
    isRequest,
    isRequestPending,
    isSuperAdmin,
    listStatusAskForInfo,
    needCheckMaster,
    payload,
    process,
    provinceDropdownList,
    register,
    reset,
    setPayload,
    setValue,
    stepper,
    viewOnly,
    watch,
  };
};
