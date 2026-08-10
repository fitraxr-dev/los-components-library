import { useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useSearchAllUser from '@/hooks/services/useSearchUser';

import { SITEVISIT_PARTY2_SCHEMA } from '../../../shared/constants/schema';

import type { PartySiteVisit } from '../AddNewSiteVisit/AddNewSIteVisit.hook';
import type * as yup from 'yup';


type Form = yup.InferType<typeof SITEVISIT_PARTY2_SCHEMA>

const useAddNewSmiParty = (editData?: PartySiteVisit) => {
  const [divisionId, setDivisionId] = useState<string | number>();
  const [userInput, setUserInput] = useState<string>();

  const { data: divisions, isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: '',
  });

  const { data: users, isFetching: isLoadingUsers } = useSearchAllUser({
    division: String(divisionId),
    value: userInput || '',
  }, {
    enabled: !!divisionId,
    staleTime: ONE_MINUTE,
  });

  const isSmiParty = true;
  const { control, watch, handleSubmit, setValue, reset } = useForm<Form>({
    context: { isSmiParty },
    defaultValues: {
      division: undefined,
      id: undefined,
      instance: undefined,
      name: undefined,
      position: undefined,
      staffId: undefined,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: yupResolver(SITEVISIT_PARTY2_SCHEMA),
    shouldUseNativeValidation: true,
  });

  // Set form values saat edit
  useEffect(() => {
    if (editData) {
      reset({
        division: editData.division || undefined,
        id: editData.id || undefined,
        instance: editData.instance || undefined,
        name: editData.name || undefined,
        position: editData.position || undefined,
        staffId: editData.staffId || undefined,
      });
      // Set divisionId untuk load users
      if (editData.division) {
        const divisionObj = divisions?.contents?.find((d) => d?.name === editData.division);
        if (divisionObj) {
          setDivisionId(divisionObj.id);
        }
      }
    } else {
      // Reset form saat add baru
      reset({
        division: undefined,
        id: undefined,
        instance: undefined,
        name: undefined,
        position: undefined,
        staffId: undefined,
      });
      setDivisionId(undefined);
    }
  }, [editData, divisions, reset]);

  const divisionList = (divisions?.contents ?? []).map((d) => ({ id: d?.id, label: d?.name }));
  const userList = (users?.contents ?? []).map((d) => ({
    id: d?.userId,
    job: d?.position[0]?.name,
    label: d?.fullName,
    staffId: d?.userId,
  }));

  const division = watch('division');
  const name = watch('name');

  useEffect(() => {
    if (name) {
      const selectedUser = userList.find((u) => u.label === name);
      setValue('staffId', Number(selectedUser?.staffId));
      setValue('position', selectedUser?.job || '-');
    } else {
      setValue('position', null);
    }
  }, [name]);

  return {
    control,
    division,
    divisionList,
    isLoadingDivisions,
    isLoadingUsers,
    onSave: handleSubmit,
    setDivisionId,
    setUserInput,
    setValue,
    userList,
  };

};

export default useAddNewSmiParty;
