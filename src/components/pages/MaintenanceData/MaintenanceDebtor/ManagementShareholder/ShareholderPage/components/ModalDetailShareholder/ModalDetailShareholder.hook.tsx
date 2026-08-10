import React, { useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import { modal as MODAL } from '../../ShareHolder.constant';
import useGetShareholderById from '../../ShareHolderDetailForm/GeneralInformation/hooks/useGetShareholderById';

import { tab } from './ModalDetailShareholder.constants';


const useModalDetailShareholder = () => {
  const theme = useTheme();
  const modalId = MODAL.SHAREHOLDER_MODAL_DETAIL;
  const modal = useModal(modalId);
  const { processId } = useIdentity();
  const [activeTab, setActiveTab] = useState(tab.GENERAL_INFORMATION);
  const { data: shareholderData, isSuccess } = useGetShareholderById({
    bucketProcessId: processId,
    debtorId: '123108',
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
    shareholderId: 'SHARE-00001',
  }, {
    enabled: true,
  });


  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleChangeTab,
    modal,
    modalId,
    shareholderData,
    theme,
  };
};

export default useModalDetailShareholder;
