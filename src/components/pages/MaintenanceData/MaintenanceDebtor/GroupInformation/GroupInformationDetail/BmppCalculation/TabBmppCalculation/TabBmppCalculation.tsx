import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BmppCalculationGroup
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/components/group/BmppCalculationGroup';
import BmppCalculationIndividual
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/components/individual/BmppCalculationIndividual';

import type { TabBmppCalculationProps } from './TabBmppCalculation.types';


const TabBmppCalculation = (props: TabBmppCalculationProps) => {
  const {
    isIndividual,
    isPemda,
    dataMasterDebtor } = props;

  return (
    <>
      {isIndividual ? (
        <>
          <BmppCalculationIndividual
            module={TypeModule.BMPP}
            process={TypeProcess.BMPP}
            bmppType={props.bmppType}
            calculationId={props.calculationId}
            debtorId={props.debtorId}
            isIndividual={isIndividual}
            isPemda={isPemda}
            viewOnly={false}
            dataMasterDebtor={dataMasterDebtor}
            onDataChange={props.onDataChange}
          />
        </>
      ) : (
        <BmppCalculationGroup
          module={TypeModule.BMPP}
          process={TypeProcess.BMPP}
          bmppType={props.bmppType}
          calculationId={props.calculationId}
          debtorId={props.debtorId}
          isIndividual={isIndividual}
          isPemda={isPemda}
          viewOnly={false}
          dataMasterDebtor={dataMasterDebtor}
          onDataChange={props.onDataChange}
        />
      )}
    </>
  );
};

export default TabBmppCalculation;
