import { useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaIsoString, formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service';

import useGetDebtorById from '../../../../hooks/useGetDebtorById';
import useGetOtherRelatedById from '../../../hooks/useGetOtherRelatedById';
import useSaveOtherRelated from '../../../hooks/useSaveOtherRelated';

import { yupSchema } from './TabGeneralInformation.constants';


const useTabGeneralInformation = () => {
  // const identity = useIdentity();
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();
  const processId = pathname.split('/')[4];
  const { data: institutionTypeList } = useGetParameterList('institutionType');
  const { data: jobPositionList } = useGetParameterList('jobPosition');
  const { data: idDocTypeList } = useGetParameterList('idDocType');

  const isMaintenance = pathname.includes('/maintenance/');
  const isMaster = pathname.includes('/master/');

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer other related',
    });
  }, []);

  const { handleSubmit, control, reset, getValues, watch, setValue, formState: { isValid } } = useForm({
    defaultValues: {
      firstNoNotaryDeed: undefined,
      firstNoNotaryDeedFile: undefined,
      idDocFile: undefined,
      idNumber: undefined,
      idType: undefined,
      identityExpiry: undefined,
      institutionType: undefined,
      jobPosition: undefined,
      lastModified: undefined,
      lastNoNotaryDeed: undefined,
      lastNoNotaryDeedFile: undefined,
      modifiedBy: undefined,
      name: {
        fullName: undefined,
        prefix: undefined,
        suffix: undefined,
      },
      npwp: undefined,
      npwpDocFile: undefined,
      refId: undefined,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(yupSchema),
  });

  const { data: bucketDetailData, isSuccess: isBucketDetailSuccess } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: processId.includes('MAI'),
  });

  const { data: debtorDetail, isSuccess: isDebtorDetailSuccess } = useGetDebtorById({
    debtorId: processId,
  }, {
    enabled: processId.includes('DEBT'),
  });

  const { data: detailData, isSuccess: isDetailDataSuccess } = useGetOtherRelatedById({
    bucketProcessId: processId,
    debtorId: isMaintenance ? bucketDetailData?.debtorId : debtorDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    partyId: id as string,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: isMaintenance ? isBucketDetailSuccess : isDebtorDetailSuccess,
  });

  const { mutate: saveOtherRelated, isPending: isSaveLoading } = useSaveOtherRelated({
    onError: () => {
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(detailData),
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'gagal update other related',
      });
      showNiceModalV2({
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.EDIT,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(detailData || {}),
        menuCode: 'maintenance-data',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'berhasil update other related',
      });
      showNiceModalV2({
        onClose: () => router.back(),
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const isDataDeltaEnabled = useMemo(() => {
    let enable = false;

    if (!roleCanEdit && !!debtorDetail?.debtorId) {
      enable = true;
    }

    return enable;
  }, [debtorDetail]);

  const { data: dataDelta, isSuccess: isDataDeltaSuccess } = useGetCustomerInfoDataDelta({
    bucketProcessId: processId,
    component: DataDeltaGetDtoComponentEnum.OtherRelatedParties,
    componentIdentifier: String(id),
    debtorId: debtorDetail?.debtorId ? debtorDetail?.debtorId : bucketDetailData?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: isDataDeltaEnabled,
  });

  const findDataMaster = (
    inputKey: string,
    dropdownInputList?: {label: string; value: string}[]
  ) => {
    let previousValue = null;
    if (dataDelta?.differencesData?.some((el) => typeof el.field === 'string' && el?.field === inputKey) && isDataDeltaSuccess) {
      const findPrevValues = dataDelta?.differencesData?.find((el) => typeof el.field === 'string' && el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          const prevValueStr = typeof findPrevValues === 'string' ? findPrevValues : String(findPrevValues);
          previousValue = dropdownInputList?.find((item) => item?.value === prevValueStr)?.label;
        } else {
          if (inputKey === 'identityExpiry') {
            previousValue = formatDateTime(findPrevValues);
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    return previousValue;
  };

  useEffect(() => {
    if (isDetailDataSuccess && !!detailData) {
      reset({
        firstNoNotaryDeed: detailData?.firstNoNotaryDeed,
        firstNoNotaryDeedFile: {
          extension: detailData?.firstNoNotaryDeedDocument?.documentExtension,
          file: detailData?.firstNoNotaryDeedDocument?.document,
          name: detailData?.firstNoNotaryDeedDocument?.documentName ? `${detailData?.firstNoNotaryDeedDocument?.documentName}.` : '',
          url: detailData?.firstNoNotaryDeedDocument?.document,
        },
        idDocFile: {
          extension: detailData?.idDocument?.documentExtension,
          file: detailData?.idDocument?.document,
          name: detailData?.idDocument?.documentName ? `${detailData?.idDocument?.documentName}.` : '',
          url: detailData?.idDocument?.document,
        },
        idNumber: detailData?.idNo,
        idType: detailData?.idType,
        identityExpiry: detailData?.identityExpiry,
        institutionType: detailData?.institutionType,
        jobPosition: detailData?.jobPosition,
        lastModified: formatDateTime(detailData?.modifiedDate),
        lastNoNotaryDeed: detailData?.lastNoNotaryDeed,
        lastNoNotaryDeedFile: {
          extension: detailData?.lastNoNotaryDeedDocument?.documentExtension,
          file: detailData?.lastNoNotaryDeedDocument?.document,
          name: detailData?.lastNoNotaryDeedDocument?.documentName ? `${detailData?.lastNoNotaryDeedDocument?.documentName}.` : '',
          url: detailData?.lastNoNotaryDeedDocument?.document,
        },
        modifiedBy: detailData?.modifiedBy,
        name: {
          fullName: detailData?.name,
          prefix: detailData?.prefix,
          suffix: detailData?.suffix,
        },
        npwp: detailData?.npwp,
        npwpDocFile: {
          extension: detailData?.npwpDocument?.documentExtension,
          file: detailData?.npwpDocument?.document,
          name: detailData?.npwpDocument?.documentName ? `${detailData?.npwpDocument?.documentName}.` : '',
          url: detailData?.npwpDocument?.document,
        },
        refId: detailData.partyId,
      });
    }
  }, [isDetailDataSuccess, detailData]);

  const handleOnSave = () => {

    const val = getValues();

    const optionallyInclude = (key: any, value: any) => {
      return value !== null && value !== undefined && value !== '' ? { [key]: value } : {};
    };

    const isDocFileNew = detailData?.idDocument?.document !== val.idDocFile?.file;
    const isNpwpDocFileNew = detailData?.npwpDocument?.document !== val.npwpDocFile?.file;
    const isFirstNoNotaryDeedFileNew =
          detailData?.firstNoNotaryDeedDocument?.document !== val.firstNoNotaryDeedFile?.file;
    const isLastNoNotaryDeedFileNew =
          detailData?.lastNoNotaryDeedDocument?.document !== val.lastNoNotaryDeedFile?.file;

    const payload = {
      bucketProcessId: processId,
      debtorId: bucketDetailData.debtorId,
      firstNoNotaryDeed: val.institutionType === 'INDIVIDUAL' || val.institutionType === 'PMA' ? undefined : val.firstNoNotaryDeed,
      firstNoNotaryDeedDocFile: val.institutionType === 'INDIVIDUAL' || val.institutionType === 'PMA' ? undefined : isFirstNoNotaryDeedFileNew ? val.firstNoNotaryDeedFile?.file : undefined,
      idDocFile: isDocFileNew ? val.idDocFile?.file : undefined,
      idNo: val.idNumber,
      idType: val.idType,
      identityExpiry: val.identityExpiry ? dayJsJakartaIsoString(val.identityExpiry) : '',
      institutionType: val.institutionType,
      jobPosition: val.jobPosition,
      lastNoNotaryDeed: val.institutionType === 'INDIVIDUAL' || val.institutionType === 'PMA' ? undefined : val.lastNoNotaryDeed,
      lastNoNotaryDeedDocFile: val.institutionType === 'INDIVIDUAL' || val.institutionType === 'PMA' ? undefined : isLastNoNotaryDeedFileNew ? val.lastNoNotaryDeedFile?.file : undefined,
      name: val.name.fullName,
      npwp: val.npwp,
      npwpDocFile: isNpwpDocFileNew ? val.npwpDocFile?.file : undefined,
      partyId: detailData?.partyId,
      prefix: val.name.prefix,
      refId: val.refId,
      suffix: val.name.suffix,
      ...optionallyInclude('partyId', detailData?.partyId),
      ...optionallyInclude('refId', detailData?.refId),

    };

    saveOtherRelated(payload);
  };

  const handleNotComplete = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        closeNiceModal(MODAL.GLOBAL.WARNING);
        handleOnSave();
      },
      submitText: 'Ya',
      title: 'Data belum lengkap, apakah anda ingin menyimpan data ini?',
      type: 'warning',
    });
  };

  const handleClose = () => {
    router.back();
  };

  const handleBackToListPage = () => {
    router.back();
  };

  return {
    control,
    findDataMaster,
    handleBackToListPage,
    handleClose,
    handleNotComplete,
    handleOnSave,
    handleSubmit,
    idDocTypeList,
    institutionTypeList,
    isSaveLoading,
    isValid,
    jobPositionList,
    setValue,
    watch,
  };
};

export default useTabGeneralInformation;
