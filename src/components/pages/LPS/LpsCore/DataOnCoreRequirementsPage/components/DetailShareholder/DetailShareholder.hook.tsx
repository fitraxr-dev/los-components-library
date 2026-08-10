import { useEffect } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { formatDateTime } from '@/helpers/date';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import recordLog from '@/services/api/recordLog';

import useGetShareholderById from '../../hooks/useGetShareholderById';


const useDetailShareholder = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const params = useParams();
  const { processId } = useIdentity();

  const isDebtor = processId?.includes('DEBT');
  const showPrefixSuffix = ['INDIVIDUAL', 'PMA'];

  const { data: IdDropdownList } = useGetParameterList(Modules.ID_DOC_TYPE, { label: 'value1', value: 'key' });
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const { data: institutionTypeList } = useGetParameterList(Modules.INSTITUTION_TYPE, { label: 'value1', rate: 'value2', value: 'key' });

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
  }, {
    enabled: !isDebtor,
  });

  const { data: shareholderData, isSuccess } = useGetShareholderById({
    bucketProcessId: isDebtor ? '' : processId,
    debtorId: isDebtor ? processId : bucketDetail?.debtorId,
    module: TypeModule.LPS,
    process: TypeProcess.LPS_CORE,
    shareholderId: String(params?.id),
  }, {
    enabled: !!params?.id,
  });

  useEffect(() => {
    recordLog({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lps-core',
      module: TypeModule.LPS,
      process: TypeProcess.LPS_CORE,
      remarks: 'Get detail shareholder',
    });
  }, []);

  const methods = useForm({
    defaultValues: {
      beneficialOwner: null,
      dataInformationSource: null,
      establishmentAct: null,
      establishmentActFile: null,
      exchangeRate: {
        currency: 'IDR',
        value: undefined,
      },
      idDocFile: null,
      idNo: null,
      idRefShareholder: null,
      idType: null,
      identityExpiry: null,
      institutionType: null,
      lastChangeAct: null,
      lastChangeActFile: null,
      lastModified: null,
      level: null,
      modifiedBy: null,
      name: null,
      nominal: {
        currency: 'IDR',
        value: undefined,
      },
      npwp: null,
      npwpFile: null,
      percentage: null,
      prefix: null,
      shareholderType: null,
      stockSheet: null,
      suffix: null,
      valuePersheet: {
        currency: 'IDR',
        value: undefined,
      },
    },
  });

  const { control, watch, setValue, reset } = methods;

  const handleBackToListPage = () => {
    router.back();
  };

  const formatCurr = (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    return Number(val) > 0 ? val : undefined;
  };

  useEffect(() => {
    if (shareholderData && isSuccess) {
      reset({
        beneficialOwner: String(shareholderData?.beneficialOwner || ''),
        dataInformationSource: shareholderData?.informationSource,
        establishmentAct: shareholderData?.establishmentAct,
        establishmentActFile: shareholderData?.establishmentActFile?.document ? {
          extension: `.${shareholderData?.establishmentActFile?.documentExtension}`,
          name: shareholderData?.establishmentActFile?.documentName,
          url: shareholderData?.establishmentActFile?.document,
        } : null,
        exchangeRate: {
          currency: 'IDR',
          value: shareholderData?.exchangeRate || undefined,
        },
        idDocFile: shareholderData?.idDocument?.document ? {
          extension: `.${shareholderData?.idDocument?.documentExtension}`,
          name: shareholderData?.idDocument?.documentName,
          url: shareholderData?.idDocument?.document,
        } : null,
        idNo: shareholderData?.idNo,
        idRefShareholder: shareholderData?.shareholderId,
        idType: shareholderData?.idType,
        identityExpiry: shareholderData?.identityExpiry,
        institutionType: shareholderData?.institutionType,
        lastChangeAct: shareholderData?.lastChangeAct,
        lastChangeActFile: shareholderData?.lastChangeActFile?.document ? {
          extension: `.${shareholderData?.lastChangeActFile?.documentExtension}`,
          name: shareholderData?.lastChangeActFile?.documentName,
          url: shareholderData?.lastChangeActFile?.document,
        } : null,
        lastModified: shareholderData?.modifiedDate ? formatDateTime(shareholderData?.modifiedDate) : '-',
        level: String(shareholderData?.level || ''),
        modifiedBy: shareholderData?.modifiedBy,
        name: shareholderData?.name,
        nominal: {
          currency: 'IDR',
          value: shareholderData?.nominal,
        },
        npwp: shareholderData?.npwp,
        npwpFile: shareholderData?.npwpDocument?.document ? {
          extension: `.${shareholderData?.npwpDocument?.documentExtension}`,
          name: shareholderData?.npwpDocument?.documentName,
          url: shareholderData?.npwpDocument?.document,
        } : null,
        percentage: Number(shareholderData?.percentage) || 0,
        prefix: shareholderData?.prefix,
        shareholderType: null,
        stockSheet: formatCurr(shareholderData?.stockSheet),
        suffix: shareholderData?.suffix,
        valuePersheet: {
          currency: 'IDR',
          value: shareholderData.value || 0,
        },
      });
    }
  }, [shareholderData, isSuccess]);

  return {
    IdDropdownList,
    control,
    currencyDropdownList,
    handleBackToListPage,
    institutionTypeList,
    setValue,
    showPrefixSuffix,
    theme,
    watch,
  };
};
export default useDetailShareholder;
