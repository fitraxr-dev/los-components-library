import { useState } from 'react';

import { useForm } from 'react-hook-form';


let tabList = [
  { label: 'Edit', value: 'editAccess' },
  { label: 'Current Access', value: 'currentAccess' },
  { label: 'User Access', value: 'userAccess' },
];

const useEditAccess = () => {
  const [activeTab, setActiveTab] = useState('editAccess');
  const forms = useForm();

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  return {
    activeTab,
    forms,
    handleChangeTab,
    setActiveTab,
    tabList,
  };
};

export default useEditAccess;
