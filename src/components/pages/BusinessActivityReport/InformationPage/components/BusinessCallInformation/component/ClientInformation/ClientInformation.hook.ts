import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';
import { useFormContext, useWatch } from 'react-hook-form';

import { businessActivityReport, maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetDebtorNameset from '@/hooks/services/useGetDebtorNameset';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useGetGroupListV2 from '@/components/pages/BusinessActivityReport/GroupPage/hooks/useGetGroupListV2';
import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';


const useClientInformation = () => {
  const [groupKeyword, setGroupKeyword] = useState('');
  const { processId }: {processId: string} = useParams();
  const { isNew, canEditBAR, canCreateBAR, isBarCreation } = useBarInformation();
  const theme = useTheme();
  const router = useCustomRouter();
  const { watch, setValue, register, formState: { errors }, control } = useFormContext();

  const institutionTypeId: string = watch('institution');

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(institutionTypeId);
  const watchFields = watch();

  const { data: institutionTypeDropdownList } = useGetParameterList('institutionType');

  const { data: sectorList } = useGetParameterList('sector');

  const {
    data: groupData,
    isLoading: groupDataIsLoading,
  } = useGetGroupListV2({
    bucketProcessId: processId,
    debtorId: watchFields.debtorId,
    module: TypeModule.BAR,
    name: groupKeyword,
    process: TypeProcess.BAR,
  });


  let institutionType: string;

  switch (institutionTypeId) {
    case DebtorNamesetResponseDtoRegionalGovernEnum.REGENCYGOVERNMENT:
      institutionType = 'REGIONAL';
      break;
    case DebtorNamesetResponseDtoRegionalGovernEnum.MUNICIPALGOVERNMENT:
      institutionType = 'CITY';
      break;
    case DebtorNamesetResponseDtoRegionalGovernEnum.PROVINCEGOVERNMENT:
      institutionType = 'PROVINCE';
      break;
    default:
      institutionType = '';
      break;
  }

  const { data, isPending: isNamesetLoading } = useGetDebtorNameset({
    institution: institutionType,
  }, { enabled: isPemda });

  const nameset = useMemo(() => {
    if (data) {
      return data.data.map((val) => ({
        id: val.name,
        label: val.name,
      }));

    } else {
      return [];
    }
  }, [data]);

  const groupLists = useMemo(() => {
    return groupData?.contents?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [groupData, groupDataIsLoading]);

  const handleNewGroup = () => {
    if (canCreateBAR === false || canEditBAR === false || !isBarCreation) {
      router.push(
        replacePath(
          businessActivityReport.GROUP_DETAIL_PAGE,
          {
            debtorId: watchFields.debtorId,
            groupId: watchFields.group.id,
            processId: processId,
          }
        )
      );
    } else {
      router.push(
        replacePath(
          businessActivityReport.GROUP_PAGE,
          {
            debtorId: watchFields.debtorId,
            processId: processId,
          }
        )
      );
    }
  };

  const isRenderGroup: boolean = useMemo(() => {
    if (!canEditBAR || !canCreateBAR || !isBarCreation) {
      if (watchFields?.group?.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }, [isBarCreation, canEditBAR, watchFields?.group]);

  return {
    canCreateBAR,
    canEditBAR,
    control,
    errors,
    groupLists,
    handleNewGroup,
    institutionTypeDropdownList,
    institutionTypeId,
    isBarCreation,
    isNamesetLoading,
    isNew,
    isPemda,
    isRenderGroup,
    nameset,
    processId,
    register,
    router,
    sectorList,
    setGroupKeyword,
    setValue,
    theme,
    watchFields,
  };
};

export default useClientInformation;
