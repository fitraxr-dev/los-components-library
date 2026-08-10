import React from 'react';

import { useFormContext } from 'react-hook-form';

import ExposureDebtorSection from '@/components/shared/SmiSection/DebtorInformation/ExposureDebtorSection';

import useExposureDebtor from './ExposureDebtor.hook';


const ExposureDebtor = () => {
  const formMethods = useFormContext();

  const valueAsOf = formMethods.watch('performanceFinancial.performanceFinancialDate');

  const {
    exposuresDebtor,
  } = useExposureDebtor();

  return (
    <ExposureDebtorSection
      isAsOf
      valueAsOf={valueAsOf}
      exposuresData={exposuresDebtor}
      {...formMethods}
    />
  );
};

export default ExposureDebtor;
