import React, { createContext } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';


import { modal } from '../../Information.constant';

import useBusinessCallInformation from './BusinessCallInformation.hook';
import CallDescription from './component/CallDescription/CallDescription';
import CallDescriptionComponent from './component/CallDescription/component/CallDescriptionComponent';
import ClientInformation from './component/ClientInformation/ClientInformation';
import ClientRepresentative from './component/ClientRepresentative/ClientRepresentative';
import ModalDataDk from './component/ModalDataDK';
import SmiRepresentative from './component/SmiRepresentative/SmiRepresentative';

import type { BusinessCallInformationProps } from './BusinessCallInformation.constants';


export const InformationContext = createContext(undefined);

const BusinessCallInformation = ({ handleChangeTab }: BusinessCallInformationProps) => {

  const {
    renderCallDescriptionComponent,
    handleButtonSave,
    isAutoSaveFetching,
    isNew,
    isValid,
    isOpenDescription,
    isOpenRepresentative,
    canEditBAR,
    isBarCreation,
    canAddBAR,
    isViewOnly,
    currentStatus,
  } = useBusinessCallInformation({
    handleChangeTab,
  });

  return (
    <ColumnWrapper marginTop={3} sx={{ gap: 3 }}>
      <ClientInformation isViewOnly={isViewOnly} />
      <RowWrapper sx={{ gap: 3 }}>
        <ClientRepresentative isOpen={isOpenRepresentative} isViewOnly={isViewOnly} />
        <SmiRepresentative isOpen={isOpenRepresentative} isViewOnly={isViewOnly} />
      </RowWrapper>
      <CallDescription isOpen={isOpenDescription} isViewOnly={isViewOnly} />
      {renderCallDescriptionComponent && <CallDescriptionComponent isViewOnly={isViewOnly} />}
      {currentStatus !== 'RETURN_TO_MAKER' && (
        <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
          {((canAddBAR && isNew) || (canEditBAR && isBarCreation)) && (
            <Button
              disabled={!isValid || isAutoSaveFetching}
              onClick={() => handleButtonSave(false)}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
          )}
          {!isNew && (
            <Button
              disabled={!isValid}
              onClick={() => handleButtonSave(true)}
            >
              Next
            </Button>
          )}
        </RowWrapper>
      )}
      <ModalDef
        id={modal.CUSTOMER_DK_VALIDATION}
        component={ModalDataDk}
      />
    </ColumnWrapper>
  );
};

export default BusinessCallInformation;
