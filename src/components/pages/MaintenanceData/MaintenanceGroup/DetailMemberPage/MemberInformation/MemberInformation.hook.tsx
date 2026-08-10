import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSessionStorage from '@/hooks/useSessionStorage';

import { tabs } from './MemberInformation.constant';


const useMemberInformation = () => {
  const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();

  const methods = useForm({
    defaultValues: {
    },
  });

  const tabStorageKey = `activeTab-memberInformation-${groupId}-${memberId}`;
  const [activeTab, setActiveTab] = useSessionStorage(tabStorageKey, tabs.MEMBER_INFORMATION);

  useEffect(() => {
    setActiveTab(tabs.MEMBER_INFORMATION);
  }, [groupId, memberId, setActiveTab]);

  const handleChangeTab = (val: string, isSaveButtonEnabled: boolean = false) => {
    if (val === tabs.MEMBER_INFORMATION) {
      methods.reset(methods.getValues());
      setActiveTab(val);
      return;
    }

    if (isSaveButtonEnabled && val === tabs.BMPK) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          setActiveTab(val);
        },
        submitText: 'Ya',
        title: 'Apakah Anda yakin tidak save? Perubahan yang Anda buat tidak akan disimpan.',
        type: 'warning',
      });
    } else {
      setActiveTab(val);
    }
  };


  const resetFormState = () => {
    methods.reset(methods.getValues());
  };

  return {
    activeTab,
    handleChangeTab,
    methods,
    resetFormState,
  };
};

export default useMemberInformation;
