'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';

import DivisionsTables from './components/DivisionsTables';
import ConsentSheetModal from './components/Modals/ConsentSheetModal';
import DivisionModal from './components/Modals/DivisionModal';
import SignatoryModal from './components/Modals/SignatoryModal';
import UserCollaborationModal from './components/Modals/UserCollaborationModal';
import PageHeader from './components/PageHeader';
import SaveButtons from './components/SaveButtons';
import { MODAL } from './RisalahRapatResult.contants';
import useRisalahRapatResult from './RisalahRapatResult.hooks';


const RisalahRapatResult = () => {
  const {
    divisions,
    userIsRegistered,
    handleCheckUser,
    currentStatus,
    isConfirmed,
  } = useRisalahRapatResult();


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <PageHeader />
      <TableDebtorInformation module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />
      {divisions.map((dt, index) =>
        <DivisionsTables
          key={index}
          title={dt.title}
          value={dt.value}
          isRegistered={(data) => handleCheckUser(data)}
        />)}
      <SaveButtons userIsRegistered={userIsRegistered} currentStatus={currentStatus} isConfirmed={isConfirmed} />
      <ModalDef id={MODAL.SET_DIVISION} component={DivisionModal} />

      <ModalDef id={MODAL.USER_COLLABORATION} component={UserCollaborationModal} />

      <ModalDef id={MODAL.CONSENT_SHEET} component={ConsentSheetModal} />

      <ModalDef id={MODAL.SIGNATORY} component={SignatoryModal} />
    </ColumnWrapper>
  );
};

export default RisalahRapatResult;
