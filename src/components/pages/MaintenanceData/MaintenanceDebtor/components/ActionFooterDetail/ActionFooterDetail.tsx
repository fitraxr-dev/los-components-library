'use client';
import React, { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons';
import RowWrapper from '@/components/shared/RowWrapper';


import ModalPlafonValidation from '../ModalPlafonValidation/ModalPlafonValidation.page';

import { modal, type ActionFooterDetailProps } from './ActionFooterDetail.constant';
import { useActionFooterDetail } from './ActionFooterDetail.hooks';


const ActionFooterDetail = (props: ActionFooterDetailProps) => {

  const {
    actions,
    handleOpenSubmitModal,
    isPending,
    isSubmitLoading,
    handleClose,
    theme,
    saveAndSubmit,
    setSaveAndSubmit,
  } = useActionFooterDetail();

  useEffect(() => {
    props.onChange && props.onChange(saveAndSubmit);
    setSaveAndSubmit(false);
  }, [saveAndSubmit]);

  // const saveAction = actions?.action ? actions?.action[ACTIONS.SAVE] : null;

  return (
    <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
      <ActionButtons
        actions={actions?.action || {}}
        handleSave={props.handleSave ?? null}
        isAutoSaveFetching={props.isAutoSaveFetching ?? false}
        handleOpenSubmitModal={handleOpenSubmitModal}
        isPending={isPending}
        isSubmitLoading={isSubmitLoading}
        viewOnly={props.viewOnly}
        onClose={handleClose}
      />
      <ModalDef
        id={modal.PLAFON_VALIDATION}
        component={ModalPlafonValidation}
      />
    </RowWrapper>
  );
};

export default ActionFooterDetail;
