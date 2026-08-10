import { useEffect, useMemo, useRef, useState } from 'react';

import { useWatch } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetAllAnalyst from '@/hooks/services/useGetAllAnalyst';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useGetGamByDivision from '@/hooks/useGetGamByDivision';
import useViewOnly from '@/hooks/useViewOnly';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import useGetGroupList from '@/components/pages/Pipeline/GroupPage/hooks/useGetGroupList';

import useGetDebtorNameset from '../../hooks/useGetDebtorNameset';

import type { Control, FieldValues, UseFormResetField, UseFormSetValue } from 'react-hook-form';


const useFormDebtor = ({ control, userId, debtorId, bucketProcessId, disabledFields, resetField }: {
  control: Control;
  resetField: UseFormResetField<FieldValues>;
  userId: number;
  debtorId: string;
  disabledFields: any;
  bucketProcessId: string;
}) => {
  const { viewOnly } = useViewOnly();

  // Analyst autocomplete
  const [analystKeyword, setAnalystKeyword] = useState('');
  const [analystDropdownList, setAnalystDropdownList] = useState([]);

  // GAM autocomplete
  const [gamKeyword, setGamKeyword] = useState('');
  // const [gamDropdownList, setGamDropdownList] = useState([]);

  // Group autocomplete
  const [groupKeyword, setGroupKeyword] = useState('');
  const [groupDropdownList, setGroupDropdownList] = useState([]);
  const [filteredOwnership, setFilteredOwnership] = useState([]);

  const { data: institutionTypeDropdownList } = useGetParameterList('institutionType', { isPemda: 'value3', label: 'value1', value: 'key' });


  const { data: debtorType } = useGetParameterList('debtortype');

  const { data: dataSourceDropdownList } = useGetParameterList('datasource');

  const { data: typeProcessDropdownList } = useGetParameterList('typeProcess');

  const { data: financingTypeDropdownList } = useGetParameterList('financingType');

  const options = { label: 'value1', module: 'value2', value: 'key' };
  const { data: ownedByList } = useGetParameterList('ownership', options);
  const institutionTypeId: string = useWatch({ control: control, defaultValue: '', name: 'institutionTypeId' });
  const currentDebtorName: string = useWatch({ control: control, defaultValue: '', name: 'debtorName' });
  const divisionId: string = useWatch({ control: control, defaultValue: '', name: 'divisionId' });

  const isPemda = institutionTypeDropdownList.find((dt) => dt.value === institutionTypeId)?.isPemda === 'PEMDA';

  // Analyst data
  const {
    data: analystData,
    isSuccess: isGetAnalystDataSuccess,
    isFetching: isLoadingAnalystData,
  } = useGetAllAnalyst(
    { value: analystKeyword },
    { enabled: !disabledFields?.analyst }
  );

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

  const prevInstitutionTypeId = useRef(institutionTypeId);

  useEffect(() => {
    if (!!resetField && prevInstitutionTypeId.current && prevInstitutionTypeId.current !== institutionTypeId) {
      resetField('debtorName', { defaultValue: '' });
      resetField('npwp', { defaultValue: null });
    }
    prevInstitutionTypeId.current = institutionTypeId;
  }, [institutionTypeId, isPemda, resetField]);

  const nameset = useMemo(() => {
    if (data) {
      if (institutionTypeId === DebtorNamesetResponseDtoRegionalGovernEnum.CENTRALGOVERNMENT) {
        const baseNameset = [{ id: 'OTHERS', label: 'OTHERS' }];

        if (currentDebtorName && currentDebtorName !== 'OTHERS') {
          return [
            ...baseNameset,
            { id: currentDebtorName, label: currentDebtorName }
          ];
        }

        return baseNameset;
      } else {
        const list = data.data.map((val) => ({
          id: val.name,
          label: val.name,
        }));

        // If current value is not in the list, add it to prevent it from being cleared in the UI
        if (currentDebtorName && !list.find((item) => item.id === currentDebtorName)) {
          list.unshift({ id: currentDebtorName, label: currentDebtorName });
        }

        return list;
      }
    } else {
      // If still loading but we have a current value, show it as an option
      if (currentDebtorName) {
        return [{ id: currentDebtorName, label: currentDebtorName }];
      }
      return [];
    }
  }, [data, institutionTypeId, currentDebtorName]);

  useEffect(() => {
    if (analystData && isGetAnalystDataSuccess) {
      setAnalystDropdownList(
        (analystData as any)?.contents?.map((item) => ({
          id: item.userId,
          label: item.fullName,
        })) || []
      );
    }
  }, [analystData, isGetAnalystDataSuccess]);

  // Gam data
  const {
    data: gamData,
    isSuccess: isGetGamDataSuccess,
    isFetching: isLoadingGamData,
  } = useGetGamByDivision(
    { divisionId: divisionId || undefined, value: gamKeyword },
    { division: 'divisionShort', label: 'fullName', value: 'userId' },
    { enabled: !disabledFields?.gam && !!divisionId }
  );

  const gamDropdownList = gamData?.map((gam) => ({
    id: gam?.value ? String(gam.value) : '',
    label: `${gam?.division} - ${gam?.label}`,
  })) || [];


  // Group data
  const {
    data: groupData,
    isSuccess: isGetGroupDataSuccess,
    isFetching: isLoadingGroupData,
  } = useGetGroupList({
    bucketProcessId,
    debtorId,
    module: TypeModule.PIPELINE,
    name: groupKeyword,
    process: TypeProcess.PIPELINE,
  });

  useEffect(() => {
    if (groupData && isGetGroupDataSuccess) {
      setGroupDropdownList(
        groupData?.contents?.map((item) => ({
          id: item.id,
          label: item.name,
        }))
      );
    }
  }, [groupData, isGetGroupDataSuccess]);

  useEffect(() => {
    if (!!institutionTypeId && ownedByList?.length) {
      setFilteredOwnership(ownedByList?.filter((item) => item.module?.includes(institutionTypeId)));
    }
  }, [ownedByList, institutionTypeId]);

  return {
    analystDropdownList,
    dataSourceDropdownList,
    debtorType,
    filteredOwnership,
    financingTypeDropdownList,
    gamDropdownList,
    groupDropdownList,
    institutionTypeDropdownList,
    institutionTypeId,
    isLoadingAnalystData,
    isLoadingGamData,
    isLoadingGroupData,
    isNamesetLoading,
    isPemda,
    nameset,
    ownedByList,
    setAnalystKeyword,
    setGamKeyword,
    setGroupKeyword,
    typeProcessDropdownList,
    viewOnly,
  };
};

export default useFormDebtor;
