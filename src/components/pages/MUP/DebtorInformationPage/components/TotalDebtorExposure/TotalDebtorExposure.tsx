import React from 'react';

import { useFormContext } from 'react-hook-form';

import ExposureDebtorSection from '@/components/shared/SmiSection/DebtorInformation/ExposureDebtorSection';

import useTotalDebtorExposure from './TotalDebtorExposure.hook';


const TotalDebtorExposure = () => {

  const formMethods = useFormContext();

  const valueAsOf = formMethods.watch('performanceFinancial.performanceFinancialDate');

  const { exposuresDebtor } = useTotalDebtorExposure();

  return (
    <ExposureDebtorSection
      isAsOf
      valueAsOf={valueAsOf}
      exposuresData={exposuresDebtor}
      {...formMethods}
    />
  );
};

export default TotalDebtorExposure;
